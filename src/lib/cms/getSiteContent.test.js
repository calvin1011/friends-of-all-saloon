import { fetchSanitySiteContent } from './fetchSanitySiteContent';
import { getFallbackSiteContent } from './fallbackContent';
import { getSiteContent } from './getSiteContent';

jest.mock('./fetchSanitySiteContent', () => ({
    fetchSanitySiteContent: jest.fn()
}));

jest.mock('../../utils/logger', () => ({
    logError: jest.fn()
}));

describe('getSiteContent', () => {
    const originalId = process.env.REACT_APP_SANITY_PROJECT_ID;
    const originalDataset = process.env.REACT_APP_SANITY_DATASET;

    beforeEach(() => {
        jest.clearAllMocks();
    });

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

    it('returns fallback without calling network when project id is missing', async () => {
        delete process.env.REACT_APP_SANITY_PROJECT_ID;
        const res = await getSiteContent();
        expect(res.source).toBe('fallback');
        expect(res.error).toBeNull();
        expect(fetchSanitySiteContent).not.toHaveBeenCalled();
        expect(res.content).toEqual(getFallbackSiteContent());
    });

    it('returns cms content when Sanity fetch succeeds', async () => {
        process.env.REACT_APP_SANITY_PROJECT_ID = 'abc123';
        fetchSanitySiteContent.mockResolvedValue({
            profile: {
                name: 'From CMS',
                phone: '111',
                addressLine: 'There',
                hours: [],
                heroTitle: 'Hi',
                heroSubtitle: 'There'
            },
            services: [{ _id: 'a1', name: 'Style', price: 55, category: 'Style' }]
        });

        const res = await getSiteContent();
        expect(res.source).toBe('cms');
        expect(res.error).toBeNull();
        expect(res.content.businessInfo.name).toBe('From CMS');
        expect(res.content.services.some((s) => s.name === 'Style')).toBe(true);
        expect(fetchSanitySiteContent).toHaveBeenCalledWith({
            projectId: 'abc123',
            dataset: 'production'
        });
    });

    it('returns fallback when Sanity fetch throws', async () => {
        process.env.REACT_APP_SANITY_PROJECT_ID = 'abc123';
        fetchSanitySiteContent.mockRejectedValue(new Error('network down'));

        const res = await getSiteContent();
        expect(res.source).toBe('fallback');
        expect(res.error).toBeInstanceOf(Error);
        expect(res.content).toEqual(getFallbackSiteContent());
    });
});
