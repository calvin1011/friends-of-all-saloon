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
            <div className="max-w-4xl mx-auto p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Client Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.filter(client => client.image).map(client => (
                    <div key={client.id} className="card">
                      <div className="h-64 bg-gray-100">
                        <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{client.name}</h3>
                      </div>
                    </div>
                ))}
              </div>
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