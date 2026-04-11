import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { verifyAndSetPassword } from '../lib/netlifyIdentityClient';

const AdminLogin = ({ onOpenSignIn, identityError, isIdentityReady, setShowAdminLogin, identityToken }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [passwordSet, setPasswordSet] = useState(false);

    const handleBackToPublic = () => {
        setShowAdminLogin(false);
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    const handleSetPassword = async (e) => {
        e.preventDefault();
        setFormError('');

        if (password.length < 6) {
            setFormError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        const result = await verifyAndSetPassword(identityToken.token, identityToken.type, password);
        setSubmitting(false);

        if (result.success) {
            setPasswordSet(true);
        } else {
            setFormError(result.error);
        }
    };

    const isRecovery = identityToken?.type === 'recovery';
    const isInvite = identityToken?.type === 'invite';
    const hasToken = Boolean(identityToken);

    return (
        <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
            <div className="card max-w-md w-full p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {passwordSet
                            ? 'Password Set!'
                            : isRecovery
                                ? 'Reset Your Password'
                                : isInvite
                                    ? 'Set Your Password'
                                    : 'Admin Access'}
                    </h2>
                    {!hasToken && (
                        <p className="text-gray-600">
                            Sign in with the email address you were invited with.
                        </p>
                    )}
                </div>

                <div className="space-y-6">
                    {(identityError || formError) && (
                        <p className="text-red-600 text-sm" role="alert">
                            {formError || identityError}
                        </p>
                    )}

                    {hasToken && !passwordSet ? (
                        <form onSubmit={handleSetPassword} className="space-y-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    {isRecovery ? 'New Password' : 'Password'}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    required
                                    minLength={6}
                                    autoFocus
                                    disabled={submitting}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    required
                                    minLength={6}
                                    disabled={submitting}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                {submitting ? 'Setting password...' : isRecovery ? 'Reset Password' : 'Set Password'}
                            </button>
                        </form>
                    ) : passwordSet ? (
                        <>
                            <p className="text-green-700 text-sm text-center">
                                Your password has been {isRecovery ? 'reset' : 'set'} successfully.
                                You can now sign in.
                            </p>
                            <button
                                type="button"
                                onClick={onOpenSignIn}
                                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isIdentityReady}
                            >
                                Sign In
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={onOpenSignIn}
                                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!isIdentityReady}
                            >
                                Sign in with Netlify Identity
                            </button>
                            {!isIdentityReady ? (
                                <p className="text-gray-500 text-sm text-center">Preparing sign-in…</p>
                            ) : null}
                        </>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={handleBackToPublic}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                        Back to Public Site
                    </button>
                </div>

                {!hasToken && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Admin Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>Upload and manage client photos</li>
                            <li>Edit service prices</li>
                            <li>Add/remove clients</li>
                            <li>View appointment requests</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
