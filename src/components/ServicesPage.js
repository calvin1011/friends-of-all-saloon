import React, { useState } from 'react';
import { Edit3, Save, X, DollarSign } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../utils/constants';

const ServicesPage = ({ products, setProducts, isAdmin }) => {
    const [editingProduct, setEditingProduct] = useState(null);

    const updateProduct = (productId, updates) => {
        setProducts(prev => prev.map(product =>
            product.id === productId
                ? { ...product, ...updates }
                : product
        ));
        setEditingProduct(null);
    };

    const saveProduct = (productId) => {
        const nameInput = document.getElementById(`product-name-${productId}`);
        const priceInput = document.getElementById(`product-price-${productId}`);

        if (nameInput && priceInput) {
            updateProduct(productId, {
                name: nameInput.value,
                price: parseInt(priceInput.value) || 0
            });
        }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {isAdmin ? 'Manage Services & Pricing' : 'Our Services & Pricing'}
                </h2>
                <p className="text-gray-600">
                    {isAdmin ? 'Edit your service offerings and pricing' : 'Professional hair styling services'}
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6">
                {SERVICE_CATEGORIES.map(category => {
                    const categoryProducts = products.filter(product => product.category === category);

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
                                    {categoryProducts.map(product => (
                                        <div
                                            key={product.id}
                                            className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            {isAdmin && editingProduct === product.id ? (
                                                <div className="flex-1 flex items-center space-x-4">
                                                    <input
                                                        type="text"
                                                        id={`product-name-${product.id}`}
                                                        defaultValue={product.name}
                                                        className="flex-1 input-field"
                                                    />
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-600">$</span>
                                                        <input
                                                            type="number"
                                                            id={`product-price-${product.id}`}
                                                            defaultValue={product.price}
                                                            className="w-20 input-field"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => saveProduct(product.id)}
                                                            className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                                                            title="Save changes"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
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
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-2xl font-bold text-rose-600">
                                                            ${product.price}
                                                        </span>
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => setEditingProduct(product.id)}
                                                                className="text-gray-600 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                                title="Edit price"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
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

            {/* Summary Stats - Only show to admin */}
            {isAdmin && (
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="card p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Total Services</h4>
                        <p className="text-3xl font-bold text-rose-600">{products.length}</p>
                    </div>
                    <div className="card p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Average Price</h4>
                        <p className="text-3xl font-bold text-rose-600">
                            ${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}
                        </p>
                    </div>
                    <div className="card p-6 text-center">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Price Range</h4>
                        <p className="text-3xl font-bold text-rose-600">
                            ${Math.min(...products.map(p => p.price))} - ${Math.max(...products.map(p => p.price))}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;