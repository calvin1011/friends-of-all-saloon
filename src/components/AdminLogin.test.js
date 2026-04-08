import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminLogin from './AdminLogin';

describe('AdminLogin', () => {
    it('shows an error when the password is wrong', async () => {
        const setIsAdmin = jest.fn();
        const setShowAdminLogin = jest.fn();

        render(<AdminLogin setIsAdmin={setIsAdmin} setShowAdminLogin={setShowAdminLogin} />);

        await userEvent.type(screen.getByPlaceholderText(/Enter admin password/i), 'nope');
        await userEvent.click(screen.getByRole('button', { name: /Login as Admin/i }));

        expect(screen.getByText(/Incorrect password/i)).toBeInTheDocument();
        expect(setIsAdmin).not.toHaveBeenCalled();
    });

    it('grants admin when the user enters the configured env value', async () => {
        const expected = process.env.REACT_APP_ADMIN_PASSWORD;
        expect(expected).toBeTruthy();

        const setIsAdmin = jest.fn();
        const setShowAdminLogin = jest.fn();

        render(<AdminLogin setIsAdmin={setIsAdmin} setShowAdminLogin={setShowAdminLogin} />);

        await userEvent.type(screen.getByPlaceholderText(/Enter admin password/i), expected);
        await userEvent.click(screen.getByRole('button', { name: /Login as Admin/i }));

        expect(setIsAdmin).toHaveBeenCalledWith(true);
        expect(setShowAdminLogin).toHaveBeenCalledWith(false);
    });

    it('toggles password visibility', async () => {
        render(<AdminLogin setIsAdmin={jest.fn()} setShowAdminLogin={jest.fn()} />);

        const input = screen.getByPlaceholderText(/Enter admin password/i);
        expect(input).toHaveAttribute('type', 'password');

        await userEvent.click(screen.getByRole('button', { name: /show password/i }));

        expect(input).toHaveAttribute('type', 'text');
    });
});
