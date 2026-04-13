import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
    name: 'businessProfile',
    title: 'Business profile',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Business name',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string'
        }),
        defineField({
            name: 'heroTitle',
            title: 'Hero title',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero subtitle',
            type: 'text',
            rows: 3
        }),
        defineField({
            name: 'phone',
            title: 'Phone',
            type: 'string'
        }),
        defineField({
            name: 'addressLine',
            title: 'Address (one line)',
            type: 'string'
        }),
        defineField({
            name: 'hours',
            title: 'Hours',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'hoursRow',
                    fields: [
                        defineField({
                            name: 'dayLabel',
                            title: 'Day label',
                            type: 'string',
                            description: 'Example: Mon, Tue, or Monday'
                        }),
                        defineField({
                            name: 'hoursText',
                            title: 'Hours text',
                            type: 'string',
                            description: 'Example: 9:00 AM - 6:00 PM'
                        })
                    ]
                })
            ]
        }),
        defineField({
            name: 'gallery',
            title: 'Photo gallery',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'galleryImage',
                    fields: [
                        defineField({
                            name: 'image',
                            title: 'Image',
                            type: 'image',
                            options: { hotspot: true },
                            validation: (rule) => rule.required()
                        }),
                        defineField({
                            name: 'alt',
                            title: 'Alt text',
                            type: 'string',
                            description: 'Short description for accessibility'
                        }),
                        defineField({
                            name: 'caption',
                            title: 'Caption',
                            type: 'string'
                        })
                    ],
                    preview: {
                        select: {
                            media: 'image',
                            alt: 'alt'
                        },
                        prepare({ media, alt }) {
                            return {
                                title: alt || 'Gallery image',
                                media
                            };
                        }
                    }
                })
            ]
        }),
        defineField({
            name: 'featuredVideos',
            title: 'Featured videos (embeds)',
            type: 'array',
            of: [
                defineArrayMember({
                    type: 'object',
                    name: 'video',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'string',
                            validation: (rule) => rule.required()
                        }),
                        defineField({
                            name: 'provider',
                            title: 'Provider',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'YouTube', value: 'youtube' },
                                    { title: 'Vimeo', value: 'vimeo' }
                                ],
                                layout: 'radio'
                            },
                            validation: (rule) => rule.required()
                        }),
                        defineField({
                            name: 'videoId',
                            title: 'Video ID',
                            type: 'string',
                            description:
                                'YouTube: letters, numbers, dash, underscore. Vimeo: numeric ID from the video URL.'
                        })
                    ],
                    preview: {
                        select: {
                            title: 'title',
                            provider: 'provider'
                        },
                        prepare({ title, provider }) {
                            return {
                                title: title || 'Video',
                                subtitle: provider
                            };
                        }
                    }
                })
            ]
        })
    ],
    preview: {
        prepare() {
            return {
                title: 'Business profile'
            };
        }
    }
});
