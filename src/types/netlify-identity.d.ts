export {};

type NetlifyIdentityWidgetApi = {
    init: (opts?: Record<string, unknown>) => void;
    on: (event: string, cb: (...args: unknown[]) => void) => void;
    off: (event: string, cb: (...args: unknown[]) => void) => void;
    open: (tab?: string) => void;
    logout: () => void;
    currentUser: () => unknown;
};

declare global {
    interface Window {
        netlifyIdentity?: NetlifyIdentityWidgetApi;
    }
}
