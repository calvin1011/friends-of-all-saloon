import { formatIdentityError, getExplicitIdentityApiUrl, urlHasNetlifyIdentityTokenHash } from './netlifyIdentityClient';

describe('netlifyIdentityClient', () => {
    const original = process.env.REACT_APP_NETLIFY_IDENTITY_URL;

    afterEach(() => {
        if (original === undefined) {
            delete process.env.REACT_APP_NETLIFY_IDENTITY_URL;
        } else {
            process.env.REACT_APP_NETLIFY_IDENTITY_URL = original;
        }
    });

    it('returns empty string when REACT_APP_NETLIFY_IDENTITY_URL is unset', () => {
        delete process.env.REACT_APP_NETLIFY_IDENTITY_URL;
        expect(getExplicitIdentityApiUrl()).toBe('');
    });

    it('returns trimmed URL when set', () => {
        process.env.REACT_APP_NETLIFY_IDENTITY_URL = '  https://example.netlify.app/.netlify/identity  ';
        expect(getExplicitIdentityApiUrl()).toBe('https://example.netlify.app/.netlify/identity');
    });

    describe('formatIdentityError', () => {
        it('returns a generic message when err is null', () => {
            expect(formatIdentityError(null)).toBe('Sign-in error. Please try again.');
        });

        it('uses string errors when non-empty', () => {
            expect(formatIdentityError('Invalid token')).toBe('Invalid token');
        });

        it('uses Error.message when present', () => {
            expect(formatIdentityError(new Error('Expired'))).toBe('Expired');
        });
    });

    describe('urlHasNetlifyIdentityTokenHash', () => {
        afterEach(() => {
            window.history.replaceState({}, '', '/');
        });

        it('is true when hash contains invite_token', () => {
            window.history.replaceState({}, '', '/#invite_token=abc');
            expect(urlHasNetlifyIdentityTokenHash()).toBe(true);
        });

        it('is false when hash is empty', () => {
            window.history.replaceState({}, '', '/');
            expect(urlHasNetlifyIdentityTokenHash()).toBe(false);
        });
    });
});
