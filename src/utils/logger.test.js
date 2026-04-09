import { logError } from './logger';

describe('logError', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalError = console.error;

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        console.error = originalError;
    });

    it('does not call console.error in production', () => {
        process.env.NODE_ENV = 'production';
        console.error = jest.fn();
        logError('msg', new Error('x'));
        expect(console.error).not.toHaveBeenCalled();
    });

    it('calls console.error in non-production when an error is provided', () => {
        process.env.NODE_ENV = 'development';
        console.error = jest.fn();
        logError('oops', new Error('e'));
        expect(console.error).toHaveBeenCalled();
    });
});
