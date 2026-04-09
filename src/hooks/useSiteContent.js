import { useEffect, useState } from 'react';
import { getFallbackSiteContent } from '../lib/cms/fallbackContent';
import { getSiteContent } from '../lib/cms/getSiteContent';

/**
 * Loads marketing copy and service list from Sanity when REACT_APP_SANITY_PROJECT_ID is set.
 * Otherwise uses embedded fallbacks synchronously (no loading state).
 * @returns {{
 *   loading: boolean,
 *   source: 'cms' | 'fallback',
 *   error: Error | null,
 *   businessInfo: import('../lib/cms/siteContentTypes').SiteContent['businessInfo'],
 *   home: import('../lib/cms/siteContentTypes').SiteContent['home'],
 *   services: import('../lib/cms/siteContentTypes').SiteContent['services']
 * }}
 */
export function useSiteContent() {
    const projectId = process.env.REACT_APP_SANITY_PROJECT_ID;
    const hasCms =
        typeof projectId === 'string' && projectId.trim().length > 0;

    const [state, setState] = useState(() => {
        const base = getFallbackSiteContent();
        return {
            loading: hasCms,
            source: /** @type {'cms' | 'fallback'} */ ('fallback'),
            error: null,
            businessInfo: base.businessInfo,
            home: base.home,
            services: base.services
        };
    });

    useEffect(() => {
        if (!hasCms) {
            return undefined;
        }
        let cancelled = false;
        getSiteContent().then((res) => {
            if (cancelled) {
                return;
            }
            setState({
                loading: false,
                source: res.source,
                error: res.error,
                businessInfo: res.content.businessInfo,
                home: res.content.home,
                services: res.content.services
            });
        });
        return () => {
            cancelled = true;
        };
    }, [hasCms]);

    return state;
}
