import React, { useState } from 'react';
import { Phone, MapPin, Clock, Send } from 'lucide-react';
import { BUSINESS_INFO } from '../utils/constants';

const ContactPage = ({ products }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.service || formData.service === 'Select Service') {
            alert('Please fill in all required fields (Name, Phone, and Service).');
            return;
        }

        // Create booking summary
        const bookingSummary = `
Appointment Request Submitted!

Name: ${formData.name}
Phone: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ''}
Service: ${formData.service}
${formData.notes ? `Notes: ${formData.notes}` : ''}

We will contact you soon to confirm your appointment.
    `.trim();

        alert(bookingSummary);

        // Reset form
        setFormData({
            name: '',
            phone: '',
            email: '',
            service: '',
            notes: ''
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h2>
                <p className="text-gray-600">Get in touch to book your appointment</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div className="card p-8 fade-in">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Get in Touch</h3>
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <Phone className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Phone</p>
                                <p className="text-gray-600">{BUSINESS_INFO.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <MapPin className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Address</p>
                                <p className="text-gray-600">{BUSINESS_INFO.address}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                                <Clock className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 mb-2">Business Hours</p>
                                <div className="space-y-1">
                                    {Object.entries(BUSINESS_INFO.hours).map(([day, hours]) => (
                                        <div key={day} className="flex justify-between">
                                            <span className="text-gray-600">{day}:</span>
                                            <span className="text-gray-600">{hours}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links or Additional Info */}
                    <div className="mt-8 p-4 bg-rose-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Why Choose Us?</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• 15+ years of professional experience</li>
                            <li>• Personalized consultations</li>
                            <li>• Premium quality products</li>
                            <li>• Flexible scheduling</li>
                        </ul>
                    </div>
                </div>

                {/* Booking Form */}
                <div className="card p-8 fade-in animation-delay-150">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Book Appointment</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                className="input-field w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="(555) 123-4567"
                                className="input-field w-full"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email (Optional)
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                className="input-field w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service *
                            </label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleInputChange}
                                className="input-field w-full"
                                required
                            >
                                <option value="">Select Service</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.name}>
                                        {product.name} - ${product.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Special Requests or Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Any special requests, preferred time, or additional information..."
                                rows={4}
                                className="input-field w-full resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
                        >
                            <Send className="w-4 h-4" />
                            <span>Request Appointment</span>
                        </button>
                    </form>

                    <p className="text-xs text-gray-500 mt-4 text-center">
                        * Required fields. We'll contact you within 24 hours to confirm your appointment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;