import React, { useState } from 'react';
import { Scissors, Menu, X } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'clients', label: 'Clients' },
        { id: 'services', label: 'Services' },
        { id: 'contact', label: 'Contact' }
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-rose-600 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Scissors className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">Friends of All</h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                    activeTab === item.id
                                        ? 'bg-white text-rose-600 font-semibold'
                                        : 'hover:bg-rose-700 hover:scale-105'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-rose-500">
                        <div className="flex flex-col space-y-2">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className={`px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                                        activeTab === item.id
                                            ? 'bg-white text-rose-600 font-semibold'
                                            : 'hover:bg-rose-700'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;