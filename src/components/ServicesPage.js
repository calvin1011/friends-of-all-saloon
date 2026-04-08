import React, { useState } from 'react';
import { Edit3, Save, X, DollarSign, Plus, Trash2 } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../utils/constants';

const ServicesPage = ({ products, setProducts, isAdmin }) => {
    const [editingProduct, setEditingProduct] = useState(null);
    const [addName, setAddName] = useState('');
    const [addPrice, setAddPrice] = useState('');
    const [addCategory, setAddCategory] = useState(SERVICE_CATEGORIES[SERVICE_CATEGORIES.length - 1]);

    const updateProduct = (productId, updates) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === productId ? { ...product, ...updates } : product
            )
        );
        setEditingProduct(null);
    };

    const saveProduct = (productId) => {
        const nameInput = /** @type {HTMLInputElement | null} */ (
            document.getElementById(`product-name-${productId}`)
        );
        const priceInput = /** @type {HTMLInputElement | null} */ (
            document.getElementById(`product-price-${productId}`)
        );
        const categorySelect = /** @type {HTMLSelectElement | null} */ (
            document.getElementById(`product-category-${productId}`)
        );

        if (nameInput && priceInput) {
            updateProduct(productId, {
                name: nameInput.value.trim() || 'Service',
                price: parseInt(priceInput.value, 10) || 0,
                ...(categorySelect ? { category: categorySelect.value } : {})
            });
        }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
    };

    const handleAddService = (e) => {
        e.preventDefault();
        const name = addName.trim();
        if (!name) return;

        setProducts((prev) => {
            const id = prev.length === 0 ? 1 : Math.max(...prev.map((p) => p.id)) + 1;
            return [
                ...prev,
                {
                    id,
                    name,
                    price: parseInt(addPrice, 10) || 0,
                    category: addCategory
                }
            ];
        });
        setAddName('');
        setAddPrice('');
        setAddCategory(SERVICE_CATEGORIES[SERVICE_CATEGORIES.length - 1]);
    };

    const handleRemoveProduct = (product) => {
        if (
            !window.confirm(
                `Remove "${product.name}" from the list? This cannot be undone on this device except by re-adding the service.`
            )
        ) {
            return;
        }
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        if (editingProduct === product.id) setEditingProduct(null);
    };

    const hasProducts = products.length > 0;
    const avgPrice = hasProducts
        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0;
    const minPrice = hasProducts ? Math.min(...products.map((p) => p.price)) : 0;
    const maxPrice = hasProducts ? Math.max(...products.map((p) => p.price)) : 0;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {isAdmin ? 'Manage Services & Pricing' : 'Our Services & Pricing'}
                </h2>
                <p className="text-gray-600">
                    {isAdmin
                        ? 'Add, edit, or remove services. Pick a category for each item (e.g. Braiding).'
                        : 'Professional hair styling services'}
                </p>
            </div>

            {isAdmin && (
                <form
                    onSubmit={handleAddService}
                    className="card p-4 mb-8 border-2 border-dashed border-rose-200 bg-rose-50/40"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-rose-600" />
                        Add a new service
                    </h3>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[160px] w-full">
                            <label htmlFor="add-service-name" className="block text-sm text-gray-600 mb-1">
                                Service name
                            </label>
                            <input
                                id="add-service-name"
                                type="text"
                                value={addName}
                                onChange={(e) => setAddName(e.target.value)}
                                className="w-full input-field"
                                placeholder="e.g. Box braids — medium"
                            />
                        </div>
                        <div className="w-full sm:w-28">
                            <label htmlFor="add-service-price" className="block text-sm text-gray-600 mb-1">
                                Price ($)
                            </label>
                            <input
                                id="add-service-price"
                                type="number"
                                min="0"
                                value={addPrice}
                                onChange={(e) => setAddPrice(e.target.value)}
                                className="w-full input-field"
                                placeholder="0"
                            />
                        </div>
                        <div className="w-full sm:w-44">
                            <label htmlFor="add-service-category" className="block text-sm text-gray-600 mb-1">
                                Category
                            </label>
                            <select
                                id="add-service-category"
                                value={addCategory}
                                onChange={(e) => setAddCategory(e.target.value)}
                                className="w-full input-field"
                            >
                                {SERVICE_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                        >
                            Add service
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Service list is saved in this browser only (not synced to other phones or computers). Clearing site
                        data may reset the list to defaults until you deploy a CMS (see PHASE_BUILD.md).
                    </p>
                </form>
            )}

            <div className="grid gap-6">
                {SERVICE_CATEGORIES.map((category) => {
                    const categoryProducts = products.filter((product) => product.category === category);

                    if (categoryProducts.length === 0) return null;

                    return (
                        <div key={category} className="card fade-in">
                            <div className="bg-rose-600 text-white p-4 rounded-t-lg">
                                <h3 className="text-xl font-semibold flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    {category} Services
                                </h3>
                            </div>

                            <div className="p-4">
                                <div className="grid gap-4">
                                    {categoryProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors flex-wrap gap-3"
                                        >
                                            {isAdmin && editingProduct === product.id ? (
                                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 w-full">
                                                    <input
                                                        type="text"
                                                        id={`product-name-${product.id}`}
                                                        defaultValue={product.name}
                                                        className="flex-1 min-w-0 input-field"
                                                    />
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-gray-600">$</span>
                                                        <input
                                                            type="number"
                                                            id={`product-price-${product.id}`}
                                                            defaultValue={product.price}
                                                            className="w-24 input-field"
                                                            min="0"
                                                        />
                                                        <select
                                                            id={`product-category-${product.id}`}
                                                            defaultValue={product.category}
                                                            className="input-field min-w-[8rem]"
                                                        >
                                                            {SERVICE_CATEGORIES.map((cat) => (
                                                                <option key={cat} value={cat}>
                                                                    {cat}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => saveProduct(product.id)}
                                                            className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                            title="Save changes"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={cancelEdit}
                                                            className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-2 sm:gap-4">
                                                        <span className="text-2xl font-bold text-rose-600">
                                                            ${product.price}
                                                        </span>
                                                        {isAdmin && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingProduct(product.id)}
                                                                    className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                                    title="Edit service"
                                                                >
                                                                    <Edit3 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveProduct(product)}
                                                                    className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                                    title="Remove service"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isAdmin && hasProducts && (
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="card p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Services</h4>
                        <p className="text-3xl font-bold text-rose-600">{products.length}</p>
                    </div>
                    <div className="card p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Average Price</h4>
                        <p className="text-3xl font-bold text-rose-600">${avgPrice}</p>
                    </div>
                    <div className="card p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Price Range</h4>
                        <p className="text-3xl font-bold text-rose-600">
                            ${minPrice} - ${maxPrice}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;
