import {
    formatIdentityError,
    getExplicitIdentityApiUrl,
    getIdentityUrlConfigurationError,
    preflightNetlifyIdentitySettings,
    urlHasNetlifyIdentityTokenHash,
} from './netlifyIdentityClient';

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

    describe('getIdentityUrlConfigurationError', () => {
        const originalEnv = process.env.REACT_APP_NETLIFY_IDENTITY_URL;
        const originalLocation = window.location;

        afterEach(() => {
            if (originalEnv === undefined) {
                delete process.env.REACT_APP_NETLIFY_IDENTITY_URL;
            } else {
                process.env.REACT_APP_NETLIFY_IDENTITY_URL = originalEnv;
            }
            window.location = originalLocation;
        });

        it('returns empty when override is unset', () => {
            delete process.env.REACT_APP_NETLIFY_IDENTITY_URL;
            expect(getIdentityUrlConfigurationError()).toBe('');
        });

        it('returns empty on localhost even when override host differs', () => {
            process.env.REACT_APP_NETLIFY_IDENTITY_URL = 'https://friendsofall.netlify.app/.netlify/identity';
            expect(getIdentityUrlConfigurationError()).toBe('');
        });

        it('returns a message when override host does not match deployed hostname', () => {
            process.env.REACT_APP_NETLIFY_IDENTITY_URL = 'https://wrong-site.netlify.app/.netlify/identity';
            delete window.location;
            window.location = new URL('https://friendsofall.netlify.app/');
            expect(getIdentityUrlConfigurationError()).toContain('misconfigured');
        });

        it('returns a message for an invalid URL', () => {
            process.env.REACT_APP_NETLIFY_IDENTITY_URL = 'not-a-valid-url';
            delete window.location;
            window.location = new URL('https://friendsofall.netlify.app/');
            expect(getIdentityUrlConfigurationError()).toContain('not a valid URL');
        });
    });

    describe('preflightNetlifyIdentitySettings', () => {
        const originalFetch = global.fetch;

        afterEach(() => {
            global.fetch = originalFetch;
        });

        it('returns ok true when settings respond 200', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                })
            );
            const result = await preflightNetlifyIdentitySettings();
            expect(result.ok).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringMatching(/\/\.netlify\/identity\/settings$/),
                expect.any(Object)
            );
        });

        it('returns ok false when settings respond 404', async () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 404,
                })
            );
            const result = await preflightNetlifyIdentitySettings();
            expect(result.ok).toBe(false);
            expect(result.message).toMatch(/404/);
        });
    });
});
