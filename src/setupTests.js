import '@testing-library/jest-dom';

function createMockNetlifyIdentity() {
    return {
        init: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        open: jest.fn(),
        logout: jest.fn(),
        currentUser: jest.fn(() => null),
    };
}

beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
    window.netlifyIdentity = createMockNetlifyIdentity();
});
