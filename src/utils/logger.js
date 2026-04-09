/**
 * Centralized error logging. Avoids console noise in production builds.
 * @param {string} message
 * @param {unknown} [error]
 */
export function logError(message, error) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    if (error !== undefined) {
        // eslint-disable-next-line no-console -- dev-only diagnostics
        console.error(message, error);
        return;
    }
    // eslint-disable-next-line no-console -- dev-only diagnostics
    console.error(message);
}
