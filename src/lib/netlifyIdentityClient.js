import { logError } from '../utils/logger';

let widgetInitialized = false;

/**
 * Optional override for local dev or split domains. On the deployed Netlify hostname,
 * the widget discovers Identity from the same origin when this is unset.
 * @returns {string}
 */
export function getExplicitIdentityApiUrl() {
    const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL;
    return typeof url === 'string' && url.trim().length > 0 ? url.trim() : '';
}

/** Maps widget error payloads to a safe user-visible string (never "null"). */
export function formatIdentityError(err) {
    if (err == null) {
        return 'Sign-in error. Please try again.';
    }
    if (typeof err === 'string') {
        const s = err.trim();
        return s.length > 0 ? s : 'Sign-in error. Please try again.';
    }
    if (typeof err === 'object' && typeof err.message === 'string') {
        const s = err.message.trim();
        return s.length > 0 ? s : 'Sign-in error. Please try again.';
    }
    return 'Sign-in error. Please try again.';
}

function isTestEnv() {
    return process.env.NODE_ENV === 'test';
}

function getInitOpts() {
    const apiUrl = getExplicitIdentityApiUrl();
    return apiUrl ? { APIUrl: apiUrl } : {};
}

function getWidget() {
    if (typeof window === 'undefined') {
        return null;
    }
    const w = window.netlifyIdentity;
    if (!w) {
        logError('Netlify Identity widget is not available. Ensure public/index.html includes the identity.netlify.com script.');
        return null;
    }
    return w;
}

const IDENTITY_HASH_TOKEN_RE = /(confirmation|invite|recovery|email_change)_token=/;

/**
 * Extract and immediately clear any identity token hash from the URL at module-load time.
 * This runs BEFORE the widget can call runRoutes(), so the widget never sees the token and
 * never opens its buggy full-screen modal overlay that freezes the page. We handle the token
 * ourselves via direct GoTrue REST API calls and our own password form.
 */
const _extractedTokenHash = (() => {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash || '';
    const match = hash.match(/#(confirmation|invite|recovery|email_change)_token=([^&]+)/);
    if (!match) return null;
    // Clear the hash immediately so the widget never processes it.
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search,
    );
    return { type: match[1], token: match[2] };
})();

/** Returns the extracted token info if the page was loaded with an identity token hash. */
export function getExtractedIdentityToken() {
    if (_extractedTokenHash) return _extractedTokenHash;
    // Fallback: check current hash (covers tests and late navigation).
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash || '';
    const match = hash.match(/#(confirmation|invite|recovery|email_change)_token=([^&]+)/);
    return match ? { type: match[1], token: match[2] } : null;
}

// After extraction the hash is cleared, so this will be false — widget behaves normally.
const _hadTokenHashOnLoad =
    typeof window !== 'undefined' && IDENTITY_HASH_TOKEN_RE.test(window.location.hash || '');

/** True when the location hash carries an Identity invite, recovery, or confirmation token. */
export function urlHasNetlifyIdentityTokenHash() {
    if (typeof window === 'undefined') {
        return false;
    }
    return IDENTITY_HASH_TOKEN_RE.test(window.location.hash || '');
}

function isLocalDevHostname(hostname) {
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
}

/**
 * When REACT_APP_NETLIFY_IDENTITY_URL points at another host on a deployed site, invites and
 * password reset tokens (bound to this origin) will never work against the wrong API.
 * @returns {string} User-visible error, or empty string when OK.
 */
export function getIdentityUrlConfigurationError() {
    const explicit = getExplicitIdentityApiUrl();
    if (!explicit || typeof window === 'undefined') {
        return '';
    }
    try {
        const url = new URL(explicit);
        const host = window.location.hostname;
        if (isLocalDevHostname(host)) {
            return '';
        }
        if (url.hostname !== host) {
            return 'Admin sign-in is misconfigured: REACT_APP_NETLIFY_IDENTITY_URL does not match this website. In Netlify open Site configuration → Environment variables and remove or correct REACT_APP_NETLIFY_IDENTITY_URL for this site.';
        }
    } catch {
        return 'REACT_APP_NETLIFY_IDENTITY_URL is not a valid URL. Fix or remove it in Netlify environment variables.';
    }
    return '';
}

/**
 * The Identity widget keeps the modal body empty until settings load. If this request fails,
 * users see a blank overlay. Preflight surfaces that as a readable error on our admin screen.
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function preflightNetlifyIdentitySettings(signal) {
    if (typeof window === 'undefined') {
        return { ok: true };
    }
    const path = '/.netlify/identity/settings';
    try {
        const res = await fetch(`${window.location.origin}${path}`, {
            method: 'GET',
            credentials: 'omit',
            signal,
            headers: { Accept: 'application/json' },
        });
        if (res.ok) {
            return { ok: true };
        }
        return {
            ok: false,
            message: `Netlify Identity is not available on this domain (settings returned ${res.status}). In Netlify enable Identity under Site configuration and set Site URL to this exact site address.`,
        };
    } catch (err) {
        if (err && typeof err === 'object' && err.name === 'AbortError') {
            return { ok: true };
        }
        logError('Identity settings preflight failed', err);
        return {
            ok: false,
            message: 'Could not reach Netlify Identity from this browser. Check your network or try again.',
        };
    }
}

/**
 * Initializes the widget once. Listeners should be registered before calling this when possible.
 */
export function initNetlifyIdentityWidget() {
    if (widgetInitialized || isTestEnv()) {
        return;
    }
    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        return;
    }
    try {
        netlifyIdentity.init(getInitOpts());
        widgetInitialized = true;
    } catch (err) {
        logError('Netlify Identity init failed', err);
    }
}

export function openNetlifyIdentityLogin() {
    if (isTestEnv()) {
        return;
    }
    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        return;
    }
    initNetlifyIdentityWidget();
    try {
        netlifyIdentity.open('login');
    } catch (err) {
        logError('Netlify Identity open login failed', err);
    }
}

export function logoutNetlifyIdentity() {
    if (isTestEnv()) {
        return;
    }
    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        return;
    }
    initNetlifyIdentityWidget();
    try {
        netlifyIdentity.logout();
    } catch (err) {
        logError('Netlify Identity logout failed', err);
    }
}

/**
 * Registers Identity listeners, then initializes the widget once.
 * @param {{ setUser: (user: unknown) => void, setIdentityError: (msg: string) => void, setIsReady?: (ready: boolean) => void }} handlers
 * @returns {() => void}
 */
export function subscribeNetlifyIdentity({ setUser, setIdentityError, setIsReady }) {
    if (isTestEnv()) {
        setUser(null);
        if (setIsReady) setIsReady(true);
        return () => {};
    }

    const urlConfigError = getIdentityUrlConfigurationError();
    if (urlConfigError) {
        setIdentityError(urlConfigError);
        setUser(null);
        return () => {};
    }

    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        setIdentityError('Sign-in is unavailable. The Identity script failed to load.');
        setUser(null);
        return () => {};
    }

    const onInit = (user) => {
        setIdentityError('');
        if (!_hadTokenHashOnLoad) {
            setUser(user ?? null);
        }
        if (setIsReady) setIsReady(true);
    };
    const onLogin = (user) => {
        setIdentityError('');
        setUser(user ?? null);
    };
    const onLogout = () => {
        setIdentityError('');
        setUser(null);
    };
    const onError = (err) => {
        setIdentityError(formatIdentityError(err));
        logError('Netlify Identity error', err);
    };

    netlifyIdentity.on('init', onInit);
    netlifyIdentity.on('login', onLogin);
    netlifyIdentity.on('logout', onLogout);
    netlifyIdentity.on('error', onError);

    initNetlifyIdentityWidget();

    // If the early-init in index.html already ran and fired the init event before React registered
    // listeners, onInit above will never be called. Detect that via the flag set by index.html and
    // mark the widget ready directly.
    if (typeof window !== 'undefined' && window.__netlifyIdentityWidgetReady) {
        if (setIsReady) setIsReady(true);
    }

    if (!_hadTokenHashOnLoad) {
        try {
            setUser(netlifyIdentity.currentUser() ?? null);
        } catch (err) {
            logError('Netlify Identity currentUser failed', err);
            setUser(null);
        }
    }

    return () => {
        try {
            netlifyIdentity.off('init', onInit);
            netlifyIdentity.off('login', onLogin);
            netlifyIdentity.off('logout', onLogout);
            netlifyIdentity.off('error', onError);
        } catch (err) {
            logError('Netlify Identity unsubscribe failed', err);
        }
    };
}

/**
 * Verify an identity token (invite or recovery) and set a new password via the GoTrue REST API.
 * Bypasses the widget entirely — no modal overlay, no frozen UI.
 * @param {string} token  The raw token value from the URL hash.
 * @param {string} type   One of 'invite', 'recovery', 'confirmation', 'email_change'.
 * @param {string} newPassword  The password the user wants to set.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function verifyAndSetPassword(token, type, newPassword) {
    const origin = window.location.origin;
    const verifyType = type === 'invite' ? 'signup' : type;

    // For invite (signup) tokens, GoTrue requires the password in the verify request itself.
    // For recovery tokens, we verify first then update the password separately.
    const verifyBody = { token, type: verifyType };
    if (type === 'invite') {
        verifyBody.password = newPassword;
    }

    let session;
    try {
        const verifyRes = await fetch(`${origin}/.netlify/identity/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verifyBody),
        });
        if (!verifyRes.ok) {
            const body = await verifyRes.text().catch(() => '');
            return {
                success: false,
                error: verifyRes.status === 404
                    ? 'This link has expired or was already used. Please request a new one.'
                    : `Token verification failed (${verifyRes.status}). ${body}`,
            };
        }
        session = await verifyRes.json();
    } catch (err) {
        logError('Identity token verify failed', err);
        return { success: false, error: 'Network error verifying your link. Please try again.' };
    }

    // Invite tokens already set the password during verify — done.
    if (type === 'invite') {
        return { success: true };
    }

    // Recovery tokens need a separate password update call.
    try {
        const updateRes = await fetch(`${origin}/.netlify/identity/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ password: newPassword }),
        });
        if (!updateRes.ok) {
            const body = await updateRes.text().catch(() => '');
            return { success: false, error: `Password update failed (${updateRes.status}). ${body}` };
        }
        return { success: true };
    } catch (err) {
        logError('Identity password update failed', err);
        return { success: false, error: 'Network error setting your password. Please try again.' };
    }
}
