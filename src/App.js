import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import ClientsPage from './components/ClientsPage';
import ServicesPage from './components/ServicesPage';
import ContactPage from './components/ContactPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_CLIENTS, INITIAL_PRODUCTS } from './utils/constants';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [clients, setClients] = useLocalStorage('salon-clients', INITIAL_CLIENTS);
  const [products, setProducts] = useLocalStorage('salon-products', INITIAL_PRODUCTS);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'clients':
        return <ClientsPage clients={clients} setClients={setClients} />;
      case 'services':
        return <ServicesPage products={products} setProducts={setProducts} />;
      case 'contact':
        return <ContactPage products={products} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="pt-8">
          {renderActiveTab()}
        </main>
      </div>
  );
}

export default App;