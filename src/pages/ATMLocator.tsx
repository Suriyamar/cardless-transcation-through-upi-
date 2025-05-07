import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ATMCard from '../components/ATMCard';
import { MapPin, Filter, Plus } from 'lucide-react';

const ATMLocator: React.FC = () => {
  const { filteredAtms, filterAtms, addNewATM } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddATM, setShowAddATM] = useState(false);
  const [newATM, setNewATM] = useState({
    name: '',
    address: '',
    status: 'Working' as const
  });

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    filterAtms(status);
  };

  const handleAddATM = (e: React.FormEvent) => {
    e.preventDefault();
    addNewATM({
      name: newATM.name,
      location: {
        address: newATM.address,
        latitude: 0,
        longitude: 0
      },
      status: newATM.status
    });
    setShowAddATM(false);
    setNewATM({ name: '', address: '', status: 'Working' });
  };

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-blue-600" />
          ATM Locator
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All ATMs</option>
              <option value="Working">Working</option>
              <option value="No Cash">No Cash</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowAddATM(true)}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add ATM
          </button>
        </div>
      </div>

      {showAddATM && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New ATM</h2>
            <form onSubmit={handleAddATM}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ATM Name
                  </label>
                  <input
                    type="text"
                    value={newATM.name}
                    onChange={(e) => setNewATM({ ...newATM, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={newATM.address}
                    onChange={(e) => setNewATM({ ...newATM, address: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={newATM.status}
                    onChange={(e) => setNewATM({ ...newATM, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="Working">Working</option>
                    <option value="No Cash">No Cash</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddATM(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add ATM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAtms.map((atm) => (
          <ATMCard key={atm.id} atm={atm} />
        ))}
      </div>
    </div>
  );
};

export default ATMLocator;