import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from './ContactPage';
import { BUSINESS_INFO } from '../utils/constants';

const minimalProducts = [{ id: 1, name: 'Wash & Go', price: 35, category: 'Wash' }];

const defaultBusinessInfo = {
    name: BUSINESS_INFO.name,
    phone: BUSINESS_INFO.phone,
    address: BUSINESS_INFO.address,
    hours: { ...BUSINESS_INFO.hours }
};

describe('ContactPage', () => {
    beforeEach(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    it('renders business phone and hours from props', () => {
        render(<ContactPage products={minimalProducts} businessInfo={defaultBusinessInfo} />);

        expect(screen.getByText(BUSINESS_INFO.phone)).toBeInTheDocument();
        expect(screen.getByText(/Monday - Friday/i)).toBeInTheDocument();
    });

    it('lists services in the booking dropdown', () => {
        render(<ContactPage products={minimalProducts} businessInfo={defaultBusinessInfo} />);

        expect(screen.getByRole('option', { name: /Wash & Go - \$35/i })).toBeInTheDocument();
    });

    it('alerts when required booking fields are missing', async () => {
        render(<ContactPage products={minimalProducts} businessInfo={defaultBusinessInfo} />);

        await userEvent.click(screen.getByRole('button', { name: /Request Appointment/i }));

        expect(window.alert).toHaveBeenCalledWith(
            expect.stringMatching(/fill in all required fields/i)
        );
    });

    it('submits a valid booking request and resets the form', async () => {
        render(<ContactPage products={minimalProducts} businessInfo={defaultBusinessInfo} />);

        await userEvent.type(screen.getByPlaceholderText(/Your full name/i), 'Jane Client');
        await userEvent.type(screen.getByPlaceholderText(/\(555\) 123-4567/i), '555-111-2222');
        await userEvent.selectOptions(screen.getByRole('combobox'), 'Wash & Go');

        await userEvent.click(screen.getByRole('button', { name: /Request Appointment/i }));

        expect(window.alert).toHaveBeenCalled();
        const alertText = window.alert.mock.calls[0][0];
        expect(alertText).toMatch(/Jane Client/);
        expect(alertText).toMatch(/Wash & Go/);

        expect(screen.getByPlaceholderText(/Your full name/i)).toHaveValue('');
        expect(screen.getByPlaceholderText(/\(555\) 123-4567/i)).toHaveValue('');
    });
});
