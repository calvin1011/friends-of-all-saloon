import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = ({ setIsAdmin, setShowAdminLogin }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const expectedPassword = process.env.REACT_APP_ADMIN_PASSWORD || '';
    const loginConfigured = expectedPassword.length > 0;

    const handleLogin = (e) => {
        e.preventDefault();
        if (!loginConfigured) {
            setError(
                'Admin login is not configured. Set REACT_APP_ADMIN_PASSWORD in .env (local) or in your host (e.g. Netlify) and rebuild.'
            );
            return;
        }
        if (password === expectedPassword) {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setError('');
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    const handleBackToPublic = () => {
        setShowAdminLogin(false);
        // Remove admin parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    return (
        <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
            <div className="card max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h2>
                    <p className="text-gray-600">Enter your password to manage the salon</p>
                    {!loginConfigured && (
                        <p className="text-amber-700 text-sm mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                            Admin password is missing. Add <code className="text-xs">REACT_APP_ADMIN_PASSWORD</code>{' '}
                            to <code className="text-xs">.env</code> or hosting env, then restart dev server or redeploy.
                        </p>
                    )}
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pr-12"
                                placeholder="Enter admin password"
                                required={loginConfigured}
                                disabled={!loginConfigured}
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={!loginConfigured}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-40"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {error && (
                            <p className="text-red-600 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!loginConfigured}
                    >
                        Login as Admin
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleBackToPublic}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                        ← Back to Public Site
                    </button>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Admin Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Upload and manage client photos</li>
                        <li>• Edit service prices</li>
                        <li>• Add/remove clients</li>
                        <li>• View appointment requests</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;