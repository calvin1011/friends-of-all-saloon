import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import {
    getBeholdFeedJsonUrl,
    getBeholdPostGridImageUrl,
    isValidBeholdFeedId
} from '../lib/beholdFeed';
import { instagramProfileUrl } from '../lib/instagramHandle';
import { logError } from '../utils/logger';

/**
 * Live Instagram grid from Behold JSON (feed id in REACT_APP_BEHOLD_FEED_ID).
 * No Sanity: configure only env + Behold dashboard.
 */
const BeholdInstagramFeed = () => {
    const feedId =
        typeof process.env.REACT_APP_BEHOLD_FEED_ID === 'string'
            ? process.env.REACT_APP_BEHOLD_FEED_ID.trim()
            : '';

    const feedUrl = isValidBeholdFeedId(feedId) ? getBeholdFeedJsonUrl(feedId) : null;

    const [state, setState] = useState(() => ({
        loading: Boolean(feedUrl),
        error: null,
        data: null
    }));

    useEffect(() => {
        if (!feedUrl) {
            setState({ loading: false, error: null, data: null });
            return undefined;
        }
        const url = feedUrl;

        const controller = new AbortController();

        async function load() {
            try {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: { Accept: 'application/json' },
                    credentials: 'omit',
                    signal: controller.signal
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Behold feed failed: ${res.status} ${text.slice(0, 120)}`);
                }
                const json = await res.json();
                if (!json || typeof json !== 'object') {
                    throw new Error('Behold feed: invalid JSON');
                }
                setState({ loading: false, error: null, data: json });
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }
                const e = err instanceof Error ? err : new Error(String(err));
                logError('Behold feed load failed', e);
                setState({ loading: false, error: e, data: null });
            }
        }

        load();
        return () => controller.abort();
    }, [feedUrl]);

    if (!feedId || !feedUrl) {
        return null;
    }

    if (state.loading) {
        return (
            <section aria-label="Instagram feed" className="mb-16">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Instagram</h3>
                <p className="text-center text-gray-500">Loading feed...</p>
            </section>
        );
    }

    if (state.error || !state.data) {
        return (
            <section aria-label="Instagram feed" className="mb-16">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Instagram</h3>
                <p className="text-center text-gray-600 max-w-lg mx-auto">
                    Could not load the Instagram feed. Check your connection or Behold feed id.
                </p>
            </section>
        );
    }

    const data = state.data;
    const username = typeof data.username === 'string' ? data.username : '';
    const biography = typeof data.biography === 'string' ? data.biography : '';
    const avatar = typeof data.profilePictureUrl === 'string' ? data.profilePictureUrl : '';
    const posts = Array.isArray(data.posts) ? data.posts : [];

    return (
        <section aria-label="Instagram feed" className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">Follow us</h3>
            {username && (
                <p className="text-center text-gray-600 mb-2 text-lg">@{username}</p>
            )}
            {biography && (
                <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
                    {biography}
                </p>
            )}
            {!biography && username && <div className="mb-8" />}

            {avatar && username && (
                <div className="flex justify-center mb-8">
                    <img
                        src={avatar}
                        alt=""
                        className="w-16 h-16 rounded-full object-cover border-2 border-rose-100"
                        role="presentation"
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {posts.map((post, index) => {
                    if (!post || typeof post !== 'object') {
                        return null;
                    }
                    const p = /** @type {Record<string, unknown>} */ (post);
                    const id =
                        typeof p.id === 'string' ? p.id : `behold-post-${String(index)}`;
                    const href = typeof p.permalink === 'string' ? p.permalink : '#';
                    const imgUrl = getBeholdPostGridImageUrl(post);
                    const isVideo = p.mediaType === 'VIDEO';
                    if (!imgUrl) {
                        return null;
                    }
                    return (
                        <a
                            key={id}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 group focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        >
                            <img
                                src={imgUrl}
                                alt="Instagram post"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                            />
                            {isVideo && (
                                <span
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                                    aria-hidden
                                >
                                    <Play className="w-12 h-12 text-white drop-shadow-md opacity-90" />
                                </span>
                            )}
                        </a>
                    );
                })}
            </div>

            {username && (
                <p className="text-center mt-10">
                    <a
                        href={instagramProfileUrl(username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 font-semibold hover:text-rose-700 underline-offset-2 hover:underline"
                    >
                        View all on Instagram
                    </a>
                </p>
            )}
        </section>
    );
};

export default BeholdInstagramFeed;
