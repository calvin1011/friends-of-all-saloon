/**
 * Single GROQ query for published salon content.
 * Schema: businessProfile (singleton), service (list).
 * See project docs or Sanity Studio for field definitions.
 */
export const SANITY_SITE_QUERY = `{
  "profile": *[_type == "businessProfile"][0]{
    name,
    tagline,
    heroTitle,
    heroSubtitle,
    phone,
    addressLine,
    hours[]{ dayLabel, hoursText }
  },
  "services": *[_type == "service"] | order(name asc) {
    _id,
    name,
    price,
    category
  }
}`;
