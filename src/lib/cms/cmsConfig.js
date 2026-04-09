const SANITY_PROJECT_ID_PATTERN = /^[a-z0-9]+$/;
const SANITY_DATASET_PATTERN = /^[a-z0-9_-]+$/;

/**
 * @returns {{ projectId: string, dataset: string } | null}
 */
export function getSanityConfigFromEnv() {
    const rawId = process.env.REACT_APP_SANITY_PROJECT_ID;
    const rawDataset = process.env.REACT_APP_SANITY_DATASET || 'production';

    if (!rawId || typeof rawId !== 'string') {
        return null;
    }

    const projectId = rawId.trim().toLowerCase();
    const dataset = rawDataset.trim();

    if (!SANITY_PROJECT_ID_PATTERN.test(projectId)) {
        return null;
    }
    if (!SANITY_DATASET_PATTERN.test(dataset)) {
        return null;
    }

    return { projectId, dataset };
}
