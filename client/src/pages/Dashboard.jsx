import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

import CustomerDashboard from './CustomerDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    outstanding: 0,
    lowStockCount: 0,
    salesCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Redirect or render Customer Dashboard
  if (user?.role === 'CUSTOMER') {
    return <CustomerDashboard />;
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, we'd have a specific dashboard API that aggregates this
      // For now, we'll fetch from our reports APIs
      
      const [daybookRes, outstandingRes, lowStockRes] = await Promise.all([
        authAPI.getDaybook(),
        authAPI.getOutstanding(),
        authAPI.getLowStockAlerts()
      ]);

      setStats({
        totalSales: daybookRes.data.totalSales || 0,
        salesCount: daybookRes.data.totalSalesCount || 0,
        outstanding: outstandingRes.data.totalOutstanding || 0,
        lowStockCount: lowStockRes.data.length || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value={`₹${stats.totalSales.toLocaleString()}`}
          subtext={`${stats.salesCount} invoices generated`}
          color="bg-green-100 text-green-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Outstanding Receivables"
          value={`₹${stats.outstanding.toLocaleString()}`}
          subtext="Total pending payments"
          color="bg-red-100 text-red-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          subtext="Items below minimum level"
          color="bg-orange-100 text-orange-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          title="Active Users"
          value="-" 
          subtext="System users"
          color="bg-blue-100 text-blue-600"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center text-center">
                 <span className="text-2xl mb-2">📦</span>
                 <span className="text-sm font-medium">New Sales Order</span>
              </button>
              <button className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center text-center">
                 <span className="text-2xl mb-2">📚</span>
                 <span className="text-sm font-medium">Add Book</span>
              </button>
           </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
           <h3 className="text-lg font-bold text-gray-800 mb-4">System Status</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                 <span className="text-gray-600">Database Connection</span>
                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                 <span className="text-gray-600">Last Setup</span>
                 <span className="text-sm text-gray-500">Just now</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
