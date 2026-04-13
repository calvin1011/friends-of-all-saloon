import { BUSINESS_INFO, INITIAL_PRODUCTS } from '../../utils/constants';
import { getFallbackSiteContent } from './fallbackContent';

describe('getFallbackSiteContent', () => {
    it('aligns business info and services with embedded constants', () => {
        const content = getFallbackSiteContent();
        expect(content.businessInfo.name).toBe(BUSINESS_INFO.name);
        expect(content.businessInfo.phone).toBe(BUSINESS_INFO.phone);
        expect(content.businessInfo.address).toBe(BUSINESS_INFO.address);
        expect(content.businessInfo.hours).toEqual(BUSINESS_INFO.hours);
        expect(content.services).toHaveLength(INITIAL_PRODUCTS.length);
        expect(content.home.heroTitle.length).toBeGreaterThan(0);
        expect(content.home.heroSubtitle.length).toBeGreaterThan(0);
        expect(content.gallery).toEqual([]);
        expect(content.featuredVideos).toEqual([]);
    });
});
