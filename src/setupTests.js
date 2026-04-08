import '@testing-library/jest-dom';

// Jest does not load .env.local. If unset (e.g. CI), set a trivial placeholder for admin-login tests only.
const adminEnvKey = 'REACT_APP_ADMIN_PASSWORD';
if (!process.env[adminEnvKey]) {
    process.env[adminEnvKey] = String.fromCharCode(116);
}

beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
});
