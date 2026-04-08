import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
    it('reads initial value when storage is empty', () => {
        const { result } = renderHook(() =>
            useLocalStorage('test-key', { count: 0 })
        );

        expect(result.current[0]).toEqual({ count: 0 });
    });

    it('persists updates to localStorage', () => {
        const { result } = renderHook(() =>
            useLocalStorage('persist-key', { a: 1 })
        );

        act(() => {
            result.current[1]({ a: 2, b: true });
        });

        expect(result.current[0]).toEqual({ a: 2, b: true });
        expect(JSON.parse(localStorage.getItem('persist-key'))).toEqual({ a: 2, b: true });
    });

    it('supports functional updates', () => {
        const { result } = renderHook(() => useLocalStorage('fn-key', [1]));

        act(() => {
            result.current[1]((prev) => [...prev, 2]);
        });

        expect(result.current[0]).toEqual([1, 2]);
    });
});
