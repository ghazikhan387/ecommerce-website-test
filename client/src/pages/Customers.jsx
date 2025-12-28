import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // Using reports/outstanding as it provides the exact view needed: Name, Credit Limit, Outstanding
      const response = await authAPI.getOutstanding();
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading customers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        {/* Placeholder for Add Customer - assuming manual DB entry or separate flow for now */}
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-400 cursor-not-allowed hidden">
          + New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">ID: {customer.id} • {customer.branch?.name}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${customer.outstandingAmount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {customer.outstandingAmount > 0 ? 'Outstanding' : 'Clear'}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">GST Number</span>
                 <span className="font-medium text-gray-900">{customer.gstNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Credit Limit</span>
                 <span className="font-medium text-gray-900">₹{customer.creditLimit.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-600">Current Balance</span>
                 <span className={`text-lg font-bold ${customer.outstandingAmount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                   ₹{customer.outstandingAmount.toLocaleString()}
                 </span>
              </div>
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-500">No customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
