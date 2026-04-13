import { instagramProfileUrl, normalizeInstagramHandle } from './instagramHandle';

describe('normalizeInstagramHandle', () => {
    it('strips @ and returns valid usernames', () => {
        expect(normalizeInstagramHandle('@my_salon')).toBe('my_salon');
        expect(normalizeInstagramHandle('friendsof.all')).toBe('friendsof.all');
    });

    it('returns null for invalid input', () => {
        expect(normalizeInstagramHandle('')).toBeNull();
        expect(normalizeInstagramHandle('../evil')).toBeNull();
        expect(normalizeInstagramHandle('a'.repeat(31))).toBeNull();
    });
});

describe('instagramProfileUrl', () => {
    it('builds a profile URL', () => {
        expect(instagramProfileUrl('my_salon')).toBe('https://www.instagram.com/my_salon/');
    });
});
