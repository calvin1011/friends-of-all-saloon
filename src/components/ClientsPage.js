import React, { useState } from 'react';
import { Camera, Upload, Trash2, Plus, X, Save } from 'lucide-react';

const ClientsPage = ({ clients, setClients }) => {
    const [showAddClient, setShowAddClient] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', notes: '' });

    const handleImageUpload = (clientId, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setClients(prev => prev.map(client =>
                    client.id === clientId
                        ? { ...client, image: e.target.result }
                        : client
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    const addClient = () => {
        if (newClient.name.trim()) {
            const client = {
                id: Date.now(),
                name: newClient.name,
                image: null,
                notes: newClient.notes,
                dateAdded: new Date().toISOString()
            };
            setClients(prev => [...prev, client]);
            setNewClient({ name: '', notes: '' });
            setShowAddClient(false);
        }
    };

    const deleteClient = (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            setClients(prev => prev.filter(client => client.id !== clientId));
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Client Gallery</h2>
                    <p className="text-gray-600 mt-2">Manage your client photos and information</p>
                </div>
                <button
                    onClick={() => setShowAddClient(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Client</span>
                </button>
            </div>

            {/* Add Client Form */}
            {showAddClient && (
                <div className="card p-6 mb-6 border-2 border-rose-200 fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Add New Client</h3>
                        <button
                            onClick={() => setShowAddClient(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Client Name"
                            value={newClient.name}
                            onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Notes (e.g., hair type, preferences)"
                            value={newClient.notes}
                            onChange={(e) => setNewClient(prev => ({ ...prev, notes: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={addClient}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Add Client</span>
                        </button>
                        <button
                            onClick={() => setShowAddClient(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Clients Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map(client => (
                    <div key={client.id} className="card fade-in">
                        <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                            {client.image ? (
                                <img
                                    src={client.image}
                                    alt={client.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-500">No photo yet</p>
                                </div>
                            )}

                            <div className="absolute top-2 right-2 flex space-x-2">
                                <label className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <Upload className="w-4 h-4 text-rose-600" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(client.id, e)}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    onClick={() => deleteClient(client.id)}
                                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2">{client.name}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{client.notes}</p>
                            {client.dateAdded && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Added: {new Date(client.dateAdded).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {clients.length === 0 && (
                <div className="text-center py-16">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No clients yet</h3>
                    <p className="text-gray-500 mb-6">Start building your client gallery by adding your first client</p>
                    <button
                        onClick={() => setShowAddClient(true)}
                        className="btn-primary"
                    >
                        Add Your First Client
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientsPage;