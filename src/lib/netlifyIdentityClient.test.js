import { getExplicitIdentityApiUrl } from './netlifyIdentityClient';

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
});
