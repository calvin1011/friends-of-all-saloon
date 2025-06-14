import React, { useState } from 'react';
import { Scissors, Menu, X, Settings, LogOut } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab, isAdmin, setIsAdmin, setShowAdminLogin }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home' },
        { id: 'clients', label: isAdmin ? 'Manage Clients' : 'Gallery' },
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

    const handleAdminLogin = () => {
        setShowAdminLogin(true);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        setIsAdmin(false);
        setActiveTab('home');
        setIsMobileMenuOpen(false);
        // Remove admin parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    return (
        <nav className="bg-rose-600 text-white shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center py-6">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <Scissors className="w-12 h-12" />
                        <h1 className="text-4xl font-bold">Friends of All</h1>
                        {isAdmin && (
                            <span className="bg-white text-rose-600 px-2 py-1 rounded text-sm font-semibold ml-2">
                                Admin
                            </span>
                        )}
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={`px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                                    activeTab === item.id
                                        ? 'bg-white text-rose-600 font-bold shadow-lg scale-105'
                                        : 'hover:bg-rose-700 hover:scale-105 hover:shadow-md'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}

                        {/* Admin Controls */}
                        {isAdmin ? (
                            <button
                                onClick={handleLogout}
                                className="px-6 py-3 rounded-xl text-lg font-semibold hover:bg-rose-700 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleAdminLogin}
                                className="px-6 py-3 rounded-xl text-lg font-semibold hover:bg-rose-700 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Admin</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-3 rounded-xl hover:bg-rose-700 transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-6 border-t border-rose-500">
                        <div className="flex flex-col space-y-3">
                            {navItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabClick(item.id)}
                                    className={`px-6 py-4 rounded-xl text-lg font-semibold text-left transition-all duration-300 ${
                                        activeTab === item.id
                                            ? 'bg-white text-rose-600 font-bold shadow-lg'
                                            : 'hover:bg-rose-700 hover:scale-105'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}

                            {/* Mobile Admin Controls */}
                            {isAdmin ? (
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-4 rounded-xl text-lg font-semibold text-left hover:bg-rose-700 transition-all duration-300 flex items-center space-x-3"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleAdminLogin}
                                    className="px-6 py-4 rounded-xl text-lg font-semibold text-left hover:bg-rose-700 transition-all duration-300 flex items-center space-x-3"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Admin Login</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;