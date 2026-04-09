import { fetchSanitySiteContent } from './fetchSanitySiteContent';

describe('fetchSanitySiteContent', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });

    it('throws when response is not ok', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            text: async () => 'error'
        });

        await expect(
            fetchSanitySiteContent({ projectId: 'abc123', dataset: 'production' })
        ).rejects.toThrow(/Sanity request failed/);
    });

    it('returns parsed result on success', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ result: { profile: null, services: [] } })
        });

        const out = await fetchSanitySiteContent({ projectId: 'abc123', dataset: 'production' });
        expect(out).toEqual({ profile: null, services: [] });
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://abc123.apicdn.sanity.io'),
            expect.objectContaining({ method: 'GET', credentials: 'omit' })
        );
    });

    it('throws when body has no result field', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        await expect(
            fetchSanitySiteContent({ projectId: 'abc123', dataset: 'production' })
        ).rejects.toThrow(/missing result/);
    });
});
