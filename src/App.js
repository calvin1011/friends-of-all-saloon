import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ClientsPage from './components/ClientsPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import AdminLogin from './components/AdminLogin';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_CLIENTS, INITIAL_PRODUCTS } from './utils/constants';

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [clients, setClients] = useLocalStorage('salon-clients', INITIAL_CLIENTS);
    const [products, setProducts] = useLocalStorage('salon-products', INITIAL_PRODUCTS);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    // Check URL parameters for admin mode
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            setShowAdminLogin(true);
        }
    }, []);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'home':
                return <HomePage setActiveTab={setActiveTab} />;
            case 'clients':
                return isAdmin ?
                    <ClientsPage clients={clients} setClients={setClients} /> :
                    <div className="max-w-6xl mx-auto p-8 text-center">
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">Client Gallery</h2>
                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                            Discover the beautiful transformations at Friends of All
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {clients.filter(client => client.image).map(client => (
                                <div key={client.id} className="card hover:scale-105 transition-all duration-300">
                                    <div className="h-80 bg-gray-100">
                                        <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-800">{client.name}</h3>
                                        <p className="text-gray-600 mt-2">{client.notes}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {clients.filter(client => client.image).length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-4xl">✨</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-600 mb-4">No photos yet</h3>
                                <p className="text-lg text-gray-500">Check back soon for amazing client transformations!</p>
                            </div>
                        )}
                    </div>;
            case 'services':
                return <ServicesPage products={products} setProducts={setProducts} isAdmin={isAdmin} />;
            case 'contact':
                return <ContactPage products={products} />;
            default:
                return <HomePage setActiveTab={setActiveTab} />;
        }
    };

    if (showAdminLogin && !isAdmin) {
        return <AdminLogin setIsAdmin={setIsAdmin} setShowAdminLogin={setShowAdminLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                setShowAdminLogin={setShowAdminLogin}
            />
            <main className="pt-8">
                {renderActiveTab()}
            </main>
        </div>
    );
}

export default App;