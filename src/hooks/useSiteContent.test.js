import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getFallbackSiteContent } from '../lib/cms/fallbackContent';
import { getSiteContent } from '../lib/cms/getSiteContent';
import { useSiteContent } from './useSiteContent';

jest.mock('../lib/cms/getSiteContent', () => ({
    getSiteContent: jest.fn()
}));

function Probe() {
    const state = useSiteContent();
    return (
        <div>
            <span data-testid="loading">{String(state.loading)}</span>
            <span data-testid="source">{state.source}</span>
            <span data-testid="phone">{state.businessInfo.phone}</span>
        </div>
    );
}

describe('useSiteContent', () => {
    const originalId = process.env.REACT_APP_SANITY_PROJECT_ID;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (originalId === undefined) {
            delete process.env.REACT_APP_SANITY_PROJECT_ID;
        } else {
            process.env.REACT_APP_SANITY_PROJECT_ID = originalId;
        }
    });

    it('stays on fallback synchronously when Sanity is not configured', () => {
        delete process.env.REACT_APP_SANITY_PROJECT_ID;
        render(<Probe />);
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('source')).toHaveTextContent('fallback');
        expect(getSiteContent).not.toHaveBeenCalled();
    });

    it('loads from getSiteContent when Sanity project id is set', async () => {
        process.env.REACT_APP_SANITY_PROJECT_ID = 'abc123';
        const fallback = getFallbackSiteContent();
        getSiteContent.mockResolvedValue({
            source: 'cms',
            content: {
                ...fallback,
                businessInfo: { ...fallback.businessInfo, phone: '999-000-0000' }
            },
            error: null
        });

        render(<Probe />);

        expect(screen.getByTestId('loading')).toHaveTextContent('true');

        await waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });

        expect(screen.getByTestId('source')).toHaveTextContent('cms');
        expect(screen.getByTestId('phone')).toHaveTextContent('999-000-0000');
        expect(getSiteContent).toHaveBeenCalled();
    });
});
