import { getSanityConfigFromEnv } from './cmsConfig';

describe('getSanityConfigFromEnv', () => {
    const originalId = process.env.REACT_APP_SANITY_PROJECT_ID;
    const originalDataset = process.env.REACT_APP_SANITY_DATASET;

    afterEach(() => {
        if (originalId === undefined) {
            delete process.env.REACT_APP_SANITY_PROJECT_ID;
        } else {
            process.env.REACT_APP_SANITY_PROJECT_ID = originalId;
        }
        if (originalDataset === undefined) {
            delete process.env.REACT_APP_SANITY_DATASET;
        } else {
            process.env.REACT_APP_SANITY_DATASET = originalDataset;
        }
    });

    it('returns null when project id is missing', () => {
        delete process.env.REACT_APP_SANITY_PROJECT_ID;
        expect(getSanityConfigFromEnv()).toBeNull();
    });

    it('returns null when project id contains invalid characters', () => {
        process.env.REACT_APP_SANITY_PROJECT_ID = 'bad_id!';
        expect(getSanityConfigFromEnv()).toBeNull();
    });

    it('returns normalized config when values are valid', () => {
        process.env.REACT_APP_SANITY_PROJECT_ID = 'AbC12';
        process.env.REACT_APP_SANITY_DATASET = 'production';
        expect(getSanityConfigFromEnv()).toEqual({ projectId: 'abc12', dataset: 'production' });
    });
});
