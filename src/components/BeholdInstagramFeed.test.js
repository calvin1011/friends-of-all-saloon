import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BeholdInstagramFeed from './BeholdInstagramFeed';

describe('BeholdInstagramFeed', () => {
    const originalEnv = process.env.REACT_APP_BEHOLD_FEED_ID;
    const originalFetch = global.fetch;

    beforeEach(() => {
        process.env.REACT_APP_BEHOLD_FEED_ID = 'KtNbsXhoCaWaWXdHNm2q';
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        username: 'testsalon',
                        biography: 'Test bio',
                        profilePictureUrl: 'https://cdn2.behold.pictures/avatar.webp',
                        posts: [
                            {
                                id: '1',
                                permalink: 'https://www.instagram.com/p/abc/',
                                mediaType: 'IMAGE',
                                sizes: {
                                    medium: {
                                        mediaUrl: 'https://behold.pictures/img/medium.jpg'
                                    }
                                }
                            }
                        ]
                    })
            })
        );
    });

    afterEach(() => {
        global.fetch = originalFetch;
        if (originalEnv === undefined) {
            delete process.env.REACT_APP_BEHOLD_FEED_ID;
        } else {
            process.env.REACT_APP_BEHOLD_FEED_ID = originalEnv;
        }
    });

    it('renders feed from JSON after fetch', async () => {
        render(<BeholdInstagramFeed />);

        await waitFor(() => {
            expect(screen.getByText('@testsalon')).toBeInTheDocument();
        });

        expect(screen.getByText('Test bio')).toBeInTheDocument();
        expect(screen.getByAltText('Instagram post')).toHaveAttribute(
            'src',
            'https://behold.pictures/img/medium.jpg'
        );

        const profileLink = screen.getByRole('link', { name: /View all on Instagram/i });
        expect(profileLink).toHaveAttribute('href', 'https://www.instagram.com/testsalon/');
    });

    it('renders nothing when feed id is not set', () => {
        delete process.env.REACT_APP_BEHOLD_FEED_ID;
        const { container } = render(<BeholdInstagramFeed />);
        expect(container.firstChild).toBeNull();
        expect(global.fetch).not.toHaveBeenCalled();
    });
});
