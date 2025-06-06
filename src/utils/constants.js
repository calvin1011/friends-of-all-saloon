export const INITIAL_CLIENTS = [
    {
        id: 1,
        name: 'Sarah Johnson',
        image: null,
        notes: 'Regular highlights, shoulder length',
        dateAdded: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Maria Rodriguez',
        image: null,
        notes: 'Curly hair specialist, monthly trim',
        dateAdded: new Date().toISOString()
    }
];

export const INITIAL_PRODUCTS = [
    { id: 1, name: 'Shampoo & Condition', price: 25, category: 'Wash' },
    { id: 2, name: 'Cut & Style', price: 45, category: 'Cut' },
    { id: 3, name: 'Full Color', price: 85, category: 'Color' },
    { id: 4, name: 'Highlights', price: 95, category: 'Color' },
    { id: 5, name: 'Deep Conditioning', price: 35, category: 'Treatment' },
    { id: 6, name: 'Perm', price: 120, category: 'Chemical' },
    { id: 7, name: 'Blowout', price: 30, category: 'Style' },
    { id: 8, name: 'Root Touch-up', price: 65, category: 'Color' },
    { id: 9, name: 'Keratin Treatment', price: 150, category: 'Treatment' },
    { id: 10, name: 'Beard Trim', price: 20, category: 'Cut' }
];

export const SERVICE_CATEGORIES = ['Wash', 'Cut', 'Color', 'Treatment', 'Chemical', 'Style'];

export const BUSINESS_INFO = {
    name: 'Friends of All',
    phone: '(555) 123-4567',
    address: '123 Beauty Street, Salon City, SC 12345',
    hours: {
        'Monday - Friday': '9:00 AM - 7:00 PM',
        'Saturday': '8:00 AM - 5:00 PM',
        'Sunday': 'Closed'
    }
};