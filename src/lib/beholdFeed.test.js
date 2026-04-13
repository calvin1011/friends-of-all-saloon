import {
    getBeholdFeedJsonUrl,
    getBeholdPostGridImageUrl,
    isValidBeholdFeedId
} from './beholdFeed';

describe('isValidBeholdFeedId', () => {
    it('accepts Behold feed ids', () => {
        expect(isValidBeholdFeedId('KtNbsXhoCaWaWXdHNm2q')).toBe(true);
    });

    it('rejects invalid values', () => {
        expect(isValidBeholdFeedId('')).toBe(false);
        expect(isValidBeholdFeedId('short')).toBe(false);
        expect(isValidBeholdFeedId('../evil')).toBe(false);
    });
});

describe('getBeholdFeedJsonUrl', () => {
    it('builds the public JSON URL', () => {
        expect(getBeholdFeedJsonUrl('KtNbsXhoCaWaWXdHNm2q')).toBe(
            'https://feeds.behold.so/KtNbsXhoCaWaWXdHNm2q'
        );
    });
});

describe('getBeholdPostGridImageUrl', () => {
    it('prefers video thumbnail', () => {
        const url = getBeholdPostGridImageUrl({
            mediaType: 'VIDEO',
            thumbnailUrl: 'https://thumb.example/p.jpg',
            sizes: { medium: { mediaUrl: 'https://medium.example/m.jpg' } }
        });
        expect(url).toBe('https://thumb.example/p.jpg');
    });

    it('uses medium size for images', () => {
        const url = getBeholdPostGridImageUrl({
            mediaType: 'IMAGE',
            sizes: { medium: { mediaUrl: 'https://behold.pictures/x/medium.jpg' } }
        });
        expect(url).toBe('https://behold.pictures/x/medium.jpg');
    });
});
