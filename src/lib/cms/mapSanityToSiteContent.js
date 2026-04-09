import { SERVICE_CATEGORIES } from '../../utils/constants';

/**
 * @param {unknown} value
 * @returns {string}
 */
function asNonEmptyString(value, fallback) {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }
    return fallback;
}

/**
 * @param {unknown} value
 * @returns {number}
 */
function asPositiveInt(value, fallback) {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
        return Math.round(value);
    }
    return fallback;
}

/**
 * @param {unknown} raw
 * @param {string} fallback
 * @returns {string}
 */
function normalizeCategory(raw, fallback) {
    const s = typeof raw === 'string' ? raw.trim() : '';
    if (s && SERVICE_CATEGORIES.includes(s)) {
        return s;
    }
    if (s) {
        return s;
    }
    return fallback;
}

/**
 * Stable numeric id from Sanity _id for React keys and ServicesPage logic.
 * @param {string} sanityId
 * @param {number} index
 */
export function sanityIdToNumericId(sanityId, index) {
    if (typeof sanityId !== 'string' || sanityId.length === 0) {
        return index + 1;
    }
    let hash = 0;
    for (let i = 0; i < sanityId.length; i += 1) {
        hash = (hash * 31 + sanityId.charCodeAt(i)) % 2147483647;
    }
    if (hash === 0) {
        return index + 1;
    }
    return hash;
}

/**
 * @param {unknown} profile
 * @param {import('./siteContentTypes').SiteContent} fallback
 */
export function mapProfileToBusinessAndHome(profile, fallback) {
    if (!profile || typeof profile !== 'object') {
        return {
            businessInfo: { ...fallback.businessInfo, hours: { ...fallback.businessInfo.hours } },
            home: { ...fallback.home }
        };
    }

    const p = /** @type {Record<string, unknown>} */ (profile);

    /** @type {{ dayLabel?: unknown, hoursText?: unknown }[]} */
    const hoursRows = Array.isArray(p.hours) ? p.hours : [];
    const hoursMap = {};
    for (const row of hoursRows) {
        if (!row || typeof row !== 'object') continue;
        const day = typeof row.dayLabel === 'string' ? row.dayLabel.trim() : '';
        const hrs = typeof row.hoursText === 'string' ? row.hoursText.trim() : '';
        if (day && hrs) {
            hoursMap[day] = hrs;
        }
    }

    const name = asNonEmptyString(p.name, fallback.businessInfo.name);
    const phone = asNonEmptyString(p.phone, fallback.businessInfo.phone);
    const address = asNonEmptyString(p.addressLine, fallback.businessInfo.address);

    const businessInfo = {
        name,
        phone,
        address,
        hours: Object.keys(hoursMap).length > 0 ? hoursMap : { ...fallback.businessInfo.hours }
    };

    const heroTitle = asNonEmptyString(p.heroTitle, `Welcome to ${name}`);
    const heroSubtitle = asNonEmptyString(p.heroSubtitle, fallback.home.heroSubtitle);
    const tagline = asNonEmptyString(
        p.tagline,
        fallback.home.tagline || fallback.home.heroSubtitle
    );

    return {
        businessInfo,
        home: {
            heroTitle,
            heroSubtitle,
            tagline
        }
    };
}

/**
 * @param {unknown} servicesRaw
 * @param {import('./siteContentTypes').SiteContent} fallback
 * @returns {import('./siteContentTypes').ServiceItem[]}
 */
export function mapServicesList(servicesRaw, fallback) {
    if (!Array.isArray(servicesRaw) || servicesRaw.length === 0) {
        return fallback.services.map((s) => ({ ...s }));
    }

    const mapped = [];
    servicesRaw.forEach((item, index) => {
        if (!item || typeof item !== 'object') {
            return;
        }
        const row = /** @type {Record<string, unknown>} */ (item);
        const name = asNonEmptyString(row.name, '');
        if (!name) {
            return;
        }
        const id = sanityIdToNumericId(typeof row._id === 'string' ? row._id : '', index);
        const price = asPositiveInt(row.price, 0);
        const category = normalizeCategory(row.category, SERVICE_CATEGORIES[0]);
        mapped.push({ id, name, price, category });
    });

    return mapped.length > 0 ? mapped : fallback.services.map((s) => ({ ...s }));
}

/**
 * @param {unknown} apiResult
 * @param {import('./siteContentTypes').SiteContent} fallback
 * @returns {import('./siteContentTypes').SiteContent}
 */
export function mapSanityToSiteContent(apiResult, fallback) {
    if (!apiResult || typeof apiResult !== 'object') {
        return {
            businessInfo: {
                ...fallback.businessInfo,
                hours: { ...fallback.businessInfo.hours }
            },
            home: { ...fallback.home },
            services: fallback.services.map((s) => ({ ...s }))
        };
    }

    const profile = /** @type {{ profile?: unknown }} */ (apiResult).profile;
    const servicesRaw = /** @type {{ services?: unknown }} */ (apiResult).services;

    const partial = mapProfileToBusinessAndHome(profile, fallback);
    const services = mapServicesList(servicesRaw, fallback);

    return {
        businessInfo: {
            ...partial.businessInfo,
            hours: { ...partial.businessInfo.hours }
        },
        home: { ...partial.home },
        services
    };
}
