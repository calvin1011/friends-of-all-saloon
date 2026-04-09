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
 * @typedef {Object} SiteContent
 * @property {BusinessInfo} businessInfo
 * @property {HomeContent} home
 * @property {ServiceItem[]} services
 */

export {};
