import { BUSINESS_INFO } from '../../utils/constants';
import {
    mapSanityToSiteContent,
    mapServicesList,
    sanityIdToNumericId
} from './mapSanityToSiteContent';
import { getFallbackSiteContent } from './fallbackContent';

describe('sanityIdToNumericId', () => {
    it('returns index-based id when sanity id is empty', () => {
        expect(sanityIdToNumericId('', 4)).toBe(5);
    });

    it('returns a stable positive integer for a string id', () => {
        const a = sanityIdToNumericId('service-abc', 0);
        const b = sanityIdToNumericId('service-abc', 0);
        expect(a).toBe(b);
        expect(a).toBeGreaterThan(0);
    });
});

describe('mapServicesList', () => {
    const fallback = getFallbackSiteContent();

    it('uses fallback when payload is not an array', () => {
        const out = mapServicesList(null, fallback);
        expect(out).toEqual(fallback.services);
    });

    it('maps valid service rows and skips invalid rows', () => {
        const out = mapServicesList(
            [
                { _id: 's1', name: 'Custom Cut', price: 42, category: 'Cut' },
                { _id: 's2', name: '', price: 10, category: 'Cut' },
                null
            ],
            fallback
        );
        expect(out).toHaveLength(1);
        expect(out[0].name).toBe('Custom Cut');
        expect(out[0].price).toBe(42);
        expect(out[0].category).toBe('Cut');
    });
});

describe('mapSanityToSiteContent', () => {
    const fallback = getFallbackSiteContent();

    it('returns fallback-shaped content when api result is null', () => {
        const mapped = mapSanityToSiteContent(null, fallback);
        expect(mapped.businessInfo.phone).toBe(BUSINESS_INFO.phone);
        expect(mapped.services).toEqual(fallback.services);
    });

    it('merges profile and services from api result', () => {
        const mapped = mapSanityToSiteContent(
            {
                profile: {
                    name: 'CMS Salon',
                    tagline: 'Great hair',
                    heroTitle: 'Hello',
                    heroSubtitle: 'We style',
                    phone: '555-000-1111',
                    addressLine: '1 Main St',
                    hours: [{ dayLabel: 'Mon', hoursText: '9-5' }]
                },
                services: [{ _id: 'x', name: 'Trim', price: 20, category: 'Cut' }]
            },
            fallback
        );

        expect(mapped.businessInfo.name).toBe('CMS Salon');
        expect(mapped.businessInfo.phone).toBe('555-000-1111');
        expect(mapped.businessInfo.hours).toEqual({ Mon: '9-5' });
        expect(mapped.home.heroTitle).toBe('Hello');
        expect(mapped.home.heroSubtitle).toBe('We style');
        expect(mapped.services.some((s) => s.name === 'Trim')).toBe(true);
    });
});
