import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
    logoutNetlifyIdentity,
    openNetlifyIdentityLogin,
    preflightNetlifyIdentitySettings,
    subscribeNetlifyIdentity,
    urlHasNetlifyIdentityTokenHash,
} from '../lib/netlifyIdentityClient';

/**
 * Netlify Identity session for admin access. No password in the client bundle.
 */
export function useNetlifyIdentity() {
    const [user, setUser] = useState(null);
    const [identityError, setIdentityError] = useState('');
    const [isReady, setIsReady] = useState(false);

    useLayoutEffect(() => {
        const unsub = subscribeNetlifyIdentity({ setUser, setIdentityError });
        setIsReady(true);
        return unsub;
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV === 'test') {
            return undefined;
        }
        if (!urlHasNetlifyIdentityTokenHash()) {
            return undefined;
        }
        const controller = new AbortController();
        preflightNetlifyIdentitySettings(controller.signal).then((result) => {
            if (result.ok) {
                return;
            }
            setIdentityError((prev) => {
                const trimmed = typeof prev === 'string' ? prev.trim() : '';
                return trimmed.length > 0 ? prev : (result.message ?? '');
            });
        });
        return () => {
            controller.abort();
        };
    }, []);

    const login = useCallback(() => {
        openNetlifyIdentityLogin();
    }, []);

    const logout = useCallback(() => {
        logoutNetlifyIdentity();
    }, []);

    return {
        user,
        identityError,
        isReady,
        login,
        logout,
    };
}
