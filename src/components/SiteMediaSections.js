import React, { useCallback, useState } from 'react';
import { ImageOff } from 'lucide-react';
import BeholdInstagramFeed from './BeholdInstagramFeed';
import { isValidBeholdFeedId } from '../lib/beholdFeed';

function hasBeholdFeedIdConfigured() {
    const raw = process.env.REACT_APP_BEHOLD_FEED_ID;
    return typeof raw === 'string' && isValidBeholdFeedId(raw);
}

/**
 * @param {object} props
 * @param {import('../lib/cms/siteContentTypes').SiteContent['gallery']} props.gallery
 * @param {import('../lib/cms/siteContentTypes').SiteContent['featuredVideos']} props.featuredVideos
 */
const SiteMediaSections = ({ gallery, featuredVideos }) => {
    const [failedImageKeys, setFailedImageKeys] = useState(() => new Set());

    const markImageFailed = useCallback((key) => {
        setFailedImageKeys((prev) => {
            const next = new Set(prev);
            next.add(key);
            return next;
        });
    }, []);

    const showGallery = gallery.length > 0;
    const showVideos = featuredVideos.length > 0;

    if (!showGallery && !showVideos) {
        if (!hasBeholdFeedIdConfigured()) {
            return null;
        }
        return <BeholdInstagramFeed />;
    }

    return (
        <div className="space-y-16 mb-16">
            <BeholdInstagramFeed />

            {showGallery && (
                <section aria-label="Photo gallery">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Gallery</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gallery.map((item, index) => {
                            const key = `${item.url}-${index}`;
                            const failed = failedImageKeys.has(key);
                            return (
                                <figure
                                    key={key}
                                    className="card overflow-hidden fade-in"
                                    data-testid="gallery-item"
                                >
                                    {failed ? (
                                        <div
                                            className="aspect-[4/5] bg-gray-100 flex flex-col items-center justify-center text-gray-500 px-4 text-center"
                                            data-testid="gallery-image-fallback"
                                        >
                                            <ImageOff className="w-12 h-12 mb-2 opacity-60" aria-hidden />
                                            <span className="text-sm">Image could not be loaded</span>
                                        </div>
                                    ) : (
                                        <div className="aspect-[4/5] bg-gray-100">
                                            <img
                                                src={item.url}
                                                alt={item.alt}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                                onError={() => markImageFailed(key)}
                                            />
                                        </div>
                                    )}
                                    {item.caption && (
                                        <figcaption className="p-4 text-gray-600 text-sm leading-relaxed">
                                            {item.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            );
                        })}
                    </div>
                </section>
            )}

            {showVideos && (
                <section aria-label="Featured videos">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">
                        Featured videos
                    </h3>
                    <div className="space-y-10 max-w-4xl mx-auto">
                        {featuredVideos.map((video) => {
                            const src =
                                video.provider === 'youtube'
                                    ? `https://www.youtube.com/embed/${encodeURIComponent(
                                          video.videoId
                                      )}`
                                    : `https://player.vimeo.com/video/${encodeURIComponent(
                                          video.videoId
                                      )}`;
                            return (
                                <div key={`${video.provider}-${video.videoId}`} className="card p-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                        {video.title}
                                    </h4>
                                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                                        <iframe
                                            src={src}
                                            title={video.title}
                                            className="absolute inset-0 w-full h-full"
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default SiteMediaSections;
