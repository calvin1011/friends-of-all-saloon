import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServicesPage from './ServicesPage';

const sampleProducts = [
    { id: 1, name: 'Test Cut', price: 40, category: 'Cut' },
    { id: 2, name: 'Test Color', price: 80, category: 'Color' }
];

function ServicesHarness({ initialProducts = sampleProducts, isAdmin = false }) {
    const [products, setProducts] = useState(initialProducts);
    return (
        <ServicesPage products={products} setProducts={setProducts} isAdmin={isAdmin} />
    );
}

describe('ServicesPage', () => {
    it('renders public pricing copy and grouped services', () => {
        render(<ServicesHarness isAdmin={false} />);

        expect(
            screen.getByRole('heading', { name: /Our Services & Pricing/i })
        ).toBeInTheDocument();
        expect(screen.getByText('Test Cut')).toBeInTheDocument();
        expect(screen.queryByText(/Add a new service/i)).not.toBeInTheDocument();
    });

    it('adds a service in admin mode', async () => {
        render(<ServicesHarness isAdmin />);

        await userEvent.type(screen.getByLabelText(/Service name/i), 'Box braids');
        await userEvent.clear(screen.getByLabelText(/Price \(\$\)/i));
        await userEvent.type(screen.getByLabelText(/Price \(\$\)/i), '120');
        await userEvent.selectOptions(screen.getByLabelText(/^Category$/i), 'Braiding');
        await userEvent.click(screen.getByRole('button', { name: /^Add service$/i }));

        expect(screen.getByText('Box braids')).toBeInTheDocument();
    });

    it('edits a service name in admin mode', async () => {
        render(<ServicesHarness isAdmin />);

        const [firstEdit] = screen.getAllByTitle('Edit service');
        await userEvent.click(firstEdit);

        const nameInput = screen.getByDisplayValue('Test Cut');
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'Precision Cut');

        await userEvent.click(screen.getByTitle('Save changes'));

        expect(screen.getByText('Precision Cut')).toBeInTheDocument();
    });

    it('removes a service when admin confirms', async () => {
        window.confirm = jest.fn(() => true);

        render(<ServicesHarness isAdmin />);

        expect(screen.getByText('Test Cut')).toBeInTheDocument();

        const [firstRemove] = screen.getAllByTitle('Remove service');
        await userEvent.click(firstRemove);

        expect(window.confirm).toHaveBeenCalled();
        expect(screen.queryByText('Test Cut')).not.toBeInTheDocument();
    });
});
