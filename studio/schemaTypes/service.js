import { defineField, defineType } from 'sanity';

const SERVICE_CATEGORIES = [
    { title: 'Wash', value: 'Wash' },
    { title: 'Cut', value: 'Cut' },
    { title: 'Color', value: 'Color' },
    { title: 'Treatment', value: 'Treatment' },
    { title: 'Chemical', value: 'Chemical' },
    { title: 'Style', value: 'Style' },
    { title: 'Braiding', value: 'Braiding' }
];

export default defineType({
    name: 'service',
    title: 'Service',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required()
        }),
        defineField({
            name: 'price',
            title: 'Price (USD)',
            type: 'number',
            validation: (rule) => rule.required().min(0)
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: SERVICE_CATEGORIES,
                layout: 'dropdown'
            },
            validation: (rule) => rule.required()
        })
    ],
    preview: {
        select: {
            title: 'name',
            price: 'price',
            category: 'category'
        },
        prepare({ title, price, category }) {
            return {
                title: title || 'Service',
                subtitle: category ? `${category} · $${price}` : `$${price}`
            };
        }
    }
});
