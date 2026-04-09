import { BUSINESS_INFO, INITIAL_PRODUCTS } from '../../utils/constants';

/** @returns {import('./siteContentTypes').BusinessHoursMap} */
function defaultHours() {
    return { ...BUSINESS_INFO.hours };
}

/**
 * Default marketing copy when CMS is unavailable or not configured.
 * @returns {import('./siteContentTypes').SiteContent}
 */
export function getFallbackSiteContent() {
    return {
        businessInfo: {
            name: BUSINESS_INFO.name,
            phone: BUSINESS_INFO.phone,
            address: BUSINESS_INFO.address,
            hours: defaultHours()
        },
        home: {
            heroTitle: 'Welcome to Friends of All',
            heroSubtitle:
                'Professional hair styling services with a personal touch. Where every client becomes family.',
            tagline: 'Professional hair styling with a personal touch'
        },
        services: INITIAL_PRODUCTS.map((p) => ({ ...p }))
    };
}
