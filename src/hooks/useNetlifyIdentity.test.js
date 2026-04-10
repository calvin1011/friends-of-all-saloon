import { renderHook, waitFor } from '@testing-library/react';
import { useNetlifyIdentity } from './useNetlifyIdentity';

describe('useNetlifyIdentity', () => {
    it('exposes ready state and null user under Jest (no live Identity)', async () => {
        const { result } = renderHook(() => useNetlifyIdentity());

        await waitFor(() => {
            expect(result.current.isReady).toBe(true);
        });

        expect(result.current.user).toBeNull();
        expect(result.current.identityError).toBe('');
        expect(typeof result.current.login).toBe('function');
        expect(typeof result.current.logout).toBe('function');
    });
});
