#!/bin/sh
# Optional: copy to .git/hooks/pre-commit (Git Bash / Unix)
#   cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit
# Covers both Node (npm) and Python (pip) projects

echo "Running pre-commit checks..."

# --- 1. Block .env files ---
if git diff --cached --name-only | grep -qE '\.env$|\.env\.local$|\.env\.production$'; then
  echo "BLOCKED: Attempt to commit .env file."
  echo "Run: git reset HEAD <file>"
  exit 1
fi

# --- 2. Block hardcoded secrets (added lines only; removals still contain old literals in '-' lines) ---
PATTERNS="AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{32,}|password\s*=\s*['\"][^'\"]+['\"]|secret\s*=\s*['\"][^'\"]+['\"]"
if git diff --cached | grep -E '^\+' | grep -vE '^\+{3} ' | grep -iEq "$PATTERNS"; then
  echo "BLOCKED: Possible hardcoded secret detected."
  echo "Move secrets to environment variables."
  exit 1
fi

# --- 3. Node - npm audit ---
if [ -f "package.json" ]; then
  echo "Running npm audit..."
  npm audit --audit-level=high
  if [ $? -ne 0 ]; then
    echo "BLOCKED: npm audit found high or critical vulnerabilities."
    exit 1
  fi
fi

# --- 4. Python - pip-audit ---
if [ -f "requirements.txt" ] || [ -f "requirements.in" ]; then
  echo "Running pip-audit..."
  pip-audit
  if [ $? -ne 0 ]; then
    echo "BLOCKED: pip-audit found vulnerabilities."
    echo "Run 'pip-audit --fix' or resolve manually before committing."
    exit 1
  fi
fi

# --- 5. Python - block commit if requirements.in is stale ---
if [ -f "requirements.in" ] && [ -f "requirements.txt" ]; then
  if [ "requirements.in" -nt "requirements.txt" ]; then
    echo "BLOCKED: requirements.in is newer than requirements.txt."
    echo "Run 'pip-compile requirements.in' to regenerate the lockfile."
    exit 1
  fi
fi

# --- 6. ESLint (Node) ---
if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
  echo "Running ESLint..."
  npx eslint . --ext .js,.ts,.jsx,.tsx --max-warnings=0
  if [ $? -ne 0 ]; then
    echo "BLOCKED: ESLint errors found."
    exit 1
  fi
fi

# --- 7. Python - flake8 (only if this repo actually uses Python)
# Avoid: `find . -name "*.py"` walks node_modules and matches deps' .py files, then flake8
# runs on the whole tree and can hang or take minutes on Windows. Use tracked files only.
SHOULD_RUN_FLAKE8=0
if [ -f "setup.cfg" ] || [ -f ".flake8" ]; then
  SHOULD_RUN_FLAKE8=1
elif git ls-files "*.py" 2>/dev/null | grep -q .; then
  SHOULD_RUN_FLAKE8=1
fi

if [ "$SHOULD_RUN_FLAKE8" -eq 1 ] && command -v flake8 >/dev/null 2>&1; then
  echo "Running flake8..."
  flake8 . --exclude=node_modules,.venv,__pycache__,.git,dist,build
  if [ $? -ne 0 ]; then
    echo "BLOCKED: flake8 errors found."
    exit 1
  fi
fi

# --- 8. Prettier (Node) ---
if [ -f ".prettierrc" ] || [ -f "prettier.config.js" ]; then
  echo "Checking Prettier..."
  npx prettier --check .
  if [ $? -ne 0 ]; then
    echo "BLOCKED: Run 'npx prettier --write .' then re-stage."
    exit 1
  fi
fi

echo "All checks passed. Proceeding with commit."
exit 0
