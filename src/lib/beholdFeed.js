/** Behold JSON feed base URL (public read, no secret in client). */
export const BEHOLD_FEEDS_ORIGIN = 'https://feeds.behold.so';

const FEED_ID_PATTERN = /^[a-zA-Z0-9]{8,64}$/;

/**
 * @param {unknown} raw
 * @returns {boolean}
 */
export function isValidBeholdFeedId(raw) {
    if (typeof raw !== 'string') {
        return false;
    }
    const id = raw.trim();
    return FEED_ID_PATTERN.test(id);
}

/**
 * @param {string} feedId
 * @returns {string | null}
 */
export function getBeholdFeedJsonUrl(feedId) {
    if (!isValidBeholdFeedId(feedId)) {
        return null;
    }
    return `${BEHOLD_FEEDS_ORIGIN}/${feedId.trim()}`;
}

/**
 * Pick a stable image URL for grid thumbnails (video uses poster).
 * @param {Record<string, unknown>} post
 * @returns {string}
 */
export function getBeholdPostGridImageUrl(post) {
    if (!post || typeof post !== 'object') {
        return '';
    }
    const p = /** @type {Record<string, unknown>} */ (post);
    if (p.mediaType === 'VIDEO' && typeof p.thumbnailUrl === 'string') {
        return p.thumbnailUrl;
    }
    const sizes = p.sizes;
    if (sizes && typeof sizes === 'object' && 'medium' in sizes) {
        const med = /** @type {Record<string, unknown>} */ (sizes).medium;
        if (med && typeof med === 'object' && typeof /** @type {Record<string, unknown>} */ (med).mediaUrl === 'string') {
            return /** @type {string} */ (/** @type {Record<string, unknown>} */ (med).mediaUrl);
        }
    }
    if (typeof p.thumbnailUrl === 'string') {
        return p.thumbnailUrl;
    }
    return '';
}
