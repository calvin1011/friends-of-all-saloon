import {
    isSafeEmbedIframeSrc,
    isSafeHttpsImageUrl,
    isValidVideoProvider,
    isValidVimeoVideoId,
    isValidYoutubeVideoId
} from './safeMediaUrls';

describe('isSafeHttpsImageUrl', () => {
    it('accepts https URLs', () => {
        expect(isSafeHttpsImageUrl('https://cdn.sanity.io/images/proj/production/abc.jpg')).toBe(
            true
        );
    });

    it('rejects non-strings, empty, and non-https', () => {
        expect(isSafeHttpsImageUrl(null)).toBe(false);
        expect(isSafeHttpsImageUrl('')).toBe(false);
        expect(isSafeHttpsImageUrl('http://example.com/x.png')).toBe(false);
        expect(isSafeHttpsImageUrl('ftp://example.com/x.png')).toBe(false);
    });
});

describe('isSafeEmbedIframeSrc', () => {
    it('accepts known widget and Instagram hosts over https', () => {
        expect(isSafeEmbedIframeSrc('https://www.instagram.com/p/abc/embed/')).toBe(true);
        expect(isSafeEmbedIframeSrc('https://snapwidget.com/embed/123')).toBe(true);
    });

    it('rejects unknown hosts and http', () => {
        expect(isSafeEmbedIframeSrc('https://evil.com/embed')).toBe(false);
        expect(isSafeEmbedIframeSrc('http://www.instagram.com/p/x/embed/')).toBe(false);
    });
});

describe('video id validation', () => {
    it('validates YouTube ids', () => {
        expect(isValidYoutubeVideoId('dQw4w9WgXcQ')).toBe(true);
        expect(isValidYoutubeVideoId('ab')).toBe(false);
    });

    it('validates Vimeo ids', () => {
        expect(isValidVimeoVideoId('123456789')).toBe(true);
        expect(isValidVimeoVideoId('123')).toBe(false);
    });

    it('validates provider enum', () => {
        expect(isValidVideoProvider('youtube')).toBe(true);
        expect(isValidVideoProvider('vimeo')).toBe(true);
        expect(isValidVideoProvider('tiktok')).toBe(false);
    });
});
