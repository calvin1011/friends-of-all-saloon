import { useCallback, useLayoutEffect, useState } from 'react';
import {
    logoutNetlifyIdentity,
    openNetlifyIdentityLogin,
    subscribeNetlifyIdentity,
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
