import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await authAPI.getMyFinance();
      setFinance(res.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your account details...</div>;

  const { stats, recentInvoices } = finance;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Welcome, {stats?.name}</h1>
           <p className="text-gray-500">Customer Portal</p>
        </div>
        <Link to="/place-order" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">
           + Place New Order
        </Link>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-sm font-medium text-gray-500">Outstanding Balance</p>
           <h3 className={`text-2xl font-bold mt-2 ${stats.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
             ₹{stats.outstandingAmount.toLocaleString()}
           </h3>
           <p className="text-xs text-gray-400 mt-1">Total pending payments</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-sm font-medium text-gray-500">Credit Limit</p>
           <h3 className="text-2xl font-bold text-gray-900 mt-2">₹{stats.creditLimit.toLocaleString()}</h3>
           <p className="text-xs text-gray-400 mt-1">Available credit: ₹{(stats.creditLimit - stats.outstandingAmount).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <p className="text-sm font-medium text-gray-500">My Discount</p>
           <h3 className="text-2xl font-bold text-blue-600 mt-2">{stats.discountPercent}%</h3>
           <p className="text-xs text-gray-400 mt-1">Applied to all orders</p>
        </div>
      </div>

      {/* Recent Orders / Invoices */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
           <h3 className="font-bold text-gray-800">Recent Invoices</h3>
           <Link to="/my-orders" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">Date</th>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">Invoice #</th>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">Type</th>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">Amount</th>
              <th className="px-6 py-3 text-xs uppercase text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{inv.invoiceType}</td>
                <td className="px-6 py-4 text-sm font-medium">₹{inv.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm">
                   <button className="text-indigo-600 hover:text-indigo-800">Download</button>
                </td>
              </tr>
            ))}
            {recentInvoices.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No recent orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerDashboard;
