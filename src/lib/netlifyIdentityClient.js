import { logError } from '../utils/logger';

let widgetInitialized = false;

/**
 * Optional override for local dev or split domains. On the deployed Netlify hostname,
 * the widget discovers Identity from the same origin when this is unset.
 * @returns {string}
 */
export function getExplicitIdentityApiUrl() {
    const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL;
    return typeof url === 'string' && url.trim().length > 0 ? url.trim() : '';
}

function isTestEnv() {
    return process.env.NODE_ENV === 'test';
}

function getInitOpts() {
    const apiUrl = getExplicitIdentityApiUrl();
    return apiUrl ? { APIUrl: apiUrl } : {};
}

function getWidget() {
    if (typeof window === 'undefined') {
        return null;
    }
    const w = window.netlifyIdentity;
    if (!w) {
        logError('Netlify Identity widget is not available. Ensure public/index.html includes the identity.netlify.com script.');
        return null;
    }
    return w;
}

/**
 * Initializes the widget once. Listeners should be registered before calling this when possible.
 */
export function initNetlifyIdentityWidget() {
    if (widgetInitialized || isTestEnv()) {
        return;
    }
    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        return;
    }
    try {
        netlifyIdentity.init(getInitOpts());
        widgetInitialized = true;
    } catch (err) {
        logError('Netlify Identity init failed', err);
    }
}

export function openNetlifyIdentityLogin() {
    if (isTestEnv()) {
        return;
    }
    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        return;
    }
    initNetlifyIdentityWidget();
    try {
        netlifyIdentity.open('login');
    } catch (err) {
        logError('Netlify Identity open login failed', err);
    }
}

export function logoutNetlifyIdentity() {
    if (isTestEnv()) {
        return;
    }
    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        return;
    }
    initNetlifyIdentityWidget();
    try {
        netlifyIdentity.logout();
    } catch (err) {
        logError('Netlify Identity logout failed', err);
    }
}

/**
 * Registers Identity listeners, then initializes the widget once.
 * @param {{ setUser: (user: unknown) => void, setIdentityError: (msg: string) => void }} handlers
 * @returns {() => void}
 */
export function subscribeNetlifyIdentity({ setUser, setIdentityError }) {
    if (isTestEnv()) {
        setUser(null);
        return () => {};
    }

    const netlifyIdentity = getWidget();
    if (!netlifyIdentity) {
        setIdentityError('Sign-in is unavailable. The Identity script failed to load.');
        setUser(null);
        return () => {};
    }

    const onInit = (user) => {
        setIdentityError('');
        setUser(user ?? null);
    };
    const onLogin = (user) => {
        setIdentityError('');
        setUser(user ?? null);
    };
    const onLogout = () => {
        setIdentityError('');
        setUser(null);
    };
    const onError = (err) => {
        const message = err && typeof err.message === 'string' ? err.message : String(err);
        setIdentityError(message || 'Identity error');
        logError('Netlify Identity error', err);
    };

    netlifyIdentity.on('init', onInit);
    netlifyIdentity.on('login', onLogin);
    netlifyIdentity.on('logout', onLogout);
    netlifyIdentity.on('error', onError);

    initNetlifyIdentityWidget();

    try {
        setUser(netlifyIdentity.currentUser() ?? null);
    } catch (err) {
        logError('Netlify Identity currentUser failed', err);
        setUser(null);
    }

    return () => {
        try {
            netlifyIdentity.off('init', onInit);
            netlifyIdentity.off('login', onLogin);
            netlifyIdentity.off('logout', onLogout);
            netlifyIdentity.off('error', onError);
        } catch (err) {
            logError('Netlify Identity unsubscribe failed', err);
        }
    };
}
