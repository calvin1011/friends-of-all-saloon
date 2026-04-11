import React from 'react';
import { Lock } from 'lucide-react';

const AdminLogin = ({ onOpenSignIn, identityError, isIdentityReady, setShowAdminLogin, hasTokenHash }) => {
    const handleBackToPublic = () => {
        setShowAdminLogin(false);
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
                    {hasTokenHash ? (
                        <p className="text-gray-600">
                            A sign-in window should open automatically to let you set or reset your password.
                            If you do not see it, check for a pop-up or scroll the page. Once you have set
                            your password you will be signed in.
                        </p>
                    ) : (
                        <p className="text-gray-600">
                            Sign in with the email address you were invited with.
                        </p>
                    )}
                </div>

                <div className="space-y-6">
                    {identityError ? (
                        <p className="text-red-600 text-sm" role="alert">
                            {identityError}
                        </p>
                    ) : null}

                    {hasTokenHash && isIdentityReady ? (
                        // Widget is ready and should have opened the invite/recovery modal.
                        // Show a status message and a secondary fallback in case the user
                        // dismissed the modal or already has a password from a previous invite.
                        <>
                            <p className="text-gray-500 text-sm text-center mb-4">
                                The sign-in window should be open now. Set your password there to continue.
                            </p>
                            <button
                                type="button"
                                onClick={onOpenSignIn}
                                className="text-rose-600 hover:text-rose-800 text-sm w-full text-center"
                            >
                                Already set your password? Sign in here
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

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Admin Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>Upload and manage client photos</li>
                        <li>Edit service prices</li>
                        <li>Add/remove clients</li>
                        <li>View appointment requests</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
