/**
 * Single GROQ query for published salon content.
 * Schema: businessProfile (singleton), service (list).
 * businessProfile may include: gallery[] with an `image` (image type) and optional alt, caption;
 * featuredVideos[] with title, provider (youtube | vimeo), videoId.
 * See Sanity Studio for field definitions. Instagram uses Behold JSON in the app (REACT_APP_BEHOLD_FEED_ID), not Sanity.
 */
export const SANITY_SITE_QUERY = `{
  "profile": *[_type == "businessProfile"][0]{
    name,
    tagline,
    heroTitle,
    heroSubtitle,
    phone,
    addressLine,
    hours[]{ dayLabel, hoursText },
    gallery[]{
      alt,
      caption,
      "url": image.asset->url
    },
    featuredVideos[]{
      title,
      provider,
      videoId
    },
  },
  "services": *[_type == "service"] | order(name asc) {
    _id,
    name,
    price,
    category
  }
}`;
