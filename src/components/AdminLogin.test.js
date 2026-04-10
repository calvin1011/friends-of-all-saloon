import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLogin from './AdminLogin';

describe('AdminLogin', () => {
    it('calls onOpenSignIn when Sign in is clicked', async () => {
        const onOpenSignIn = jest.fn();
        const setShowAdminLogin = jest.fn();

        render(
            <AdminLogin
                onOpenSignIn={onOpenSignIn}
                identityError=""
                isIdentityReady
                setShowAdminLogin={setShowAdminLogin}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Sign in with Netlify Identity/i }));

        expect(onOpenSignIn).toHaveBeenCalled();
    });

    it('disables sign-in until Identity is ready', () => {
        render(
            <AdminLogin
                onOpenSignIn={jest.fn()}
                identityError=""
                isIdentityReady={false}
                setShowAdminLogin={jest.fn()}
            />
        );

        expect(screen.getByRole('button', { name: /Sign in with Netlify Identity/i })).toBeDisabled();
        expect(screen.getByText(/Preparing sign-in/i)).toBeInTheDocument();
    });

    it('shows identity errors from the provider', () => {
        render(
            <AdminLogin
                onOpenSignIn={jest.fn()}
                identityError="Invalid token"
                isIdentityReady
                setShowAdminLogin={jest.fn()}
            />
        );

        expect(screen.getByRole('alert')).toHaveTextContent('Invalid token');
    });

    it('returns to the public site from Back', async () => {
        const setShowAdminLogin = jest.fn();

        render(
            <AdminLogin
                onOpenSignIn={jest.fn()}
                identityError=""
                isIdentityReady
                setShowAdminLogin={setShowAdminLogin}
            />
        );

        await userEvent.click(screen.getByRole('button', { name: /Back to Public Site/i }));

        expect(setShowAdminLogin).toHaveBeenCalledWith(false);
    });
});
