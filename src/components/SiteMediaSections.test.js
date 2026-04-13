import React from 'react';
import { render, screen } from '@testing-library/react';
import SiteMediaSections from './SiteMediaSections';

describe('SiteMediaSections', () => {
    it('renders gallery images from CMS URLs', () => {
        render(
            <SiteMediaSections
                gallery={[
                    {
                        url: 'https://cdn.sanity.io/images/proj/production/sample.jpg',
                        alt: 'Haircut',
                        caption: 'After'
                    }
                ]}
                featuredVideos={[]}
            />
        );

        expect(screen.getByRole('heading', { name: /^Gallery$/i })).toBeInTheDocument();
        const img = screen.getByRole('img', { name: /Haircut/i });
        expect(img).toHaveAttribute(
            'src',
            'https://cdn.sanity.io/images/proj/production/sample.jpg'
        );
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(screen.getByText('After')).toBeInTheDocument();
    });

    it('renders YouTube embeds with an iframe src built from the video id', () => {
        render(
            <SiteMediaSections
                gallery={[]}
                featuredVideos={[
                    { title: 'Tour', provider: 'youtube', videoId: 'dQw4w9WgXcQ' }
                ]}
            />
        );

        const iframe = screen.getByTitle('Tour');
        expect(iframe).toHaveAttribute(
            'src',
            'https://www.youtube.com/embed/dQw4w9WgXcQ'
        );
    });

    it('renders nothing when gallery and videos are empty and Behold is not configured', () => {
        const { container } = render(<SiteMediaSections gallery={[]} featuredVideos={[]} />);
        expect(container.firstChild).toBeNull();
    });
});
