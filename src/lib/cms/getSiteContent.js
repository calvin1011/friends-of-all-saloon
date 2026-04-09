import { logError } from '../../utils/logger';
import { getSanityConfigFromEnv } from './cmsConfig';
import { fetchSanitySiteContent } from './fetchSanitySiteContent';
import { getFallbackSiteContent } from './fallbackContent';
import { mapSanityToSiteContent } from './mapSanityToSiteContent';

/**
 * Loads published site content from Sanity when configured, otherwise embedded fallbacks.
 * @returns {Promise<{ source: 'cms' | 'fallback', content: import('./siteContentTypes').SiteContent, error: Error | null }>}
 */
export async function getSiteContent() {
    const fallback = getFallbackSiteContent();
    const config = getSanityConfigFromEnv();

    if (!config) {
        return { source: 'fallback', content: fallback, error: null };
    }

    try {
        const result = await fetchSanitySiteContent(config);
        const content = mapSanityToSiteContent(result, fallback);
        return { source: 'cms', content, error: null };
    } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        logError('Failed to load site content from Sanity', err);
        return { source: 'fallback', content: fallback, error: err };
    }
}
