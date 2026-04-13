/**
 * @typedef {Record<string, string>} BusinessHoursMap
 */

/**
 * @typedef {Object} BusinessInfo
 * @property {string} name
 * @property {string} phone
 * @property {string} address
 * @property {BusinessHoursMap} hours
 */

/**
 * @typedef {Object} HomeContent
 * @property {string} heroTitle
 * @property {string} heroSubtitle
 * @property {string} [tagline]
 */

/**
 * @typedef {Object} ServiceItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string} category
 */

/**
 * @typedef {Object} GalleryImage
 * @property {string} url
 * @property {string} alt
 * @property {string} [caption]
 */

/**
 * @typedef {Object} FeaturedVideo
 * @property {string} title
 * @property {'youtube'|'vimeo'} provider
 * @property {string} videoId
 */

/**
 * @typedef {Object} SiteContent
 * @property {BusinessInfo} businessInfo
 * @property {HomeContent} home
 * @property {ServiceItem[]} services
 * @property {GalleryImage[]} gallery
 * @property {FeaturedVideo[]} featuredVideos
 */

export {};
