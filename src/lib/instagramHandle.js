/**
 * Normalizes an Instagram username for display and profile links.
 * Rejects values that are not safe to put in a path segment.
 * @param {unknown} raw
 * @returns {string | null}
 */
export function normalizeInstagramHandle(raw) {
    if (typeof raw !== 'string') {
        return null;
    }
    let s = raw.trim();
    if (s.startsWith('@')) {
        s = s.slice(1);
    }
    if (s.length === 0 || s.length > 30) {
        return null;
    }
    if (!/^[a-zA-Z0-9._]+$/.test(s)) {
        return null;
    }
    if (s.includes('..') || s.startsWith('.') || s.endsWith('.')) {
        return null;
    }
    return s;
}

/**
 * @param {string} handle normalized username without @
 * @returns {string}
 */
export function instagramProfileUrl(handle) {
    return `https://www.instagram.com/${encodeURIComponent(handle)}/`;
}
