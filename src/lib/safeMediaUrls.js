/**
 * Validates URLs used for <img src> from CMS (owner-controlled, still normalize and gate).
 * Requires HTTPS. Blocks javascript: and other non-http(s) schemes via URL parsing.
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isSafeHttpsImageUrl(raw) {
    if (typeof raw !== 'string') {
        return false;
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 2048) {
        return false;
    }
    try {
        const u = new URL(trimmed);
        return u.protocol === 'https:';
    } catch {
        return false;
    }
}

/** Hostnames allowed for Instagram or third-party feed widget iframes (HTTPS only). */
const ALLOWED_EMBED_IFRAME_HOSTS = new Set([
    'www.instagram.com',
    'instagram.com',
    'snapwidget.com',
    'cdn.lightwidget.com',
    'widgets.juicer.io',
    'www.juicer.io',
    'apps.elfsight.com',
    'elfsightcdn.com'
]);

/**
 * Validates an iframe src URL from CMS for Instagram embeds or reputable widgets.
 * Does not call the network; used before rendering iframes.
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isSafeEmbedIframeSrc(raw) {
    if (typeof raw !== 'string') {
        return false;
    }
    const trimmed = raw.trim();
    if (trimmed.length === 0 || trimmed.length > 2048) {
        return false;
    }
    try {
        const u = new URL(trimmed);
        if (u.protocol !== 'https:') {
            return false;
        }
        return ALLOWED_EMBED_IFRAME_HOSTS.has(u.hostname);
    } catch {
        return false;
    }
}

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isValidYoutubeVideoId(raw) {
    if (typeof raw !== 'string') {
        return false;
    }
    const id = raw.trim();
    return /^[a-zA-Z0-9_-]{6,32}$/.test(id);
}

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isValidVimeoVideoId(raw) {
    if (typeof raw !== 'string') {
        return false;
    }
    const id = raw.trim();
    return /^\d{5,12}$/.test(id);
}

/**
 * @param {unknown} raw
 * @returns {raw is 'youtube'|'vimeo'}
 */
export function isValidVideoProvider(raw) {
    return raw === 'youtube' || raw === 'vimeo';
}
