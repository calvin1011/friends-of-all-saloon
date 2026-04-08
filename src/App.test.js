import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
    afterEach(() => {
        window.history.replaceState({}, '', '/');
    });

    it('shows the home hero by default', () => {
        render(<App />);
        expect(
            screen.getByRole('heading', { name: /Welcome to Friends of All/i })
        ).toBeInTheDocument();
    });

    it('navigates to Services and lists a known service', async () => {
        render(<App />);

        await userEvent.click(screen.getAllByRole('button', { name: /^Services$/i })[0]);

        expect(
            screen.getByRole('heading', { name: /Our Services & Pricing/i })
        ).toBeInTheDocument();
        expect(screen.getByText(/Cut & Style/i)).toBeInTheDocument();
    });

    it('navigates to Contact and shows booking form', async () => {
        render(<App />);

        await userEvent.click(screen.getAllByRole('button', { name: /^Contact$/i })[0]);

        expect(screen.getByRole('heading', { name: /Contact Us/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Book Appointment/i })).toBeInTheDocument();
    });

    it('shows public gallery when Clients tab is used while not admin', async () => {
        render(<App />);

        await userEvent.click(screen.getAllByRole('button', { name: /^Gallery$/i })[0]);

        expect(screen.getByRole('heading', { name: /Client Gallery/i })).toBeInTheDocument();
    });

    it('opens admin login from nav and returns to public site', async () => {
        render(<App />);

        await userEvent.click(screen.getAllByRole('button', { name: /^Admin$/i })[0]);

        expect(screen.getByRole('heading', { name: /Admin Access/i })).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: /Back to Public Site/i }));

        expect(
            screen.getByRole('heading', { name: /Welcome to Friends of All/i })
        ).toBeInTheDocument();
    });

    it('opens admin login when URL contains admin=true', () => {
        window.history.replaceState({}, '', '/?admin=true');
        render(<App />);

        expect(screen.getByRole('heading', { name: /Admin Access/i })).toBeInTheDocument();
    });
});
