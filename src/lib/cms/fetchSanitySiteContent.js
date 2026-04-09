import { SANITY_SITE_QUERY } from './sanityQuery';

const SANITY_API_VERSION = '2023-05-03';

/**
 * Read-only fetch against Sanity API CDN (HTTPS, fixed host pattern).
 * @param {{ projectId: string, dataset: string }} config
 * @returns {Promise<unknown>}
 */
export async function fetchSanitySiteContent(config) {
    const { projectId, dataset } = config;
    const base = `https://${projectId}.apicdn.sanity.io/${SANITY_API_VERSION}/data/query/${dataset}`;
    const url = `${base}?query=${encodeURIComponent(SANITY_SITE_QUERY)}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit'
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Sanity request failed: ${response.status} ${text.slice(0, 200)}`);
    }

    const body = await response.json();
    if (!body || typeof body !== 'object' || !('result' in body)) {
        throw new Error('Sanity response missing result');
    }

    return /** @type {{ result: unknown }} */ (body).result;
}
