import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import CustomerDashboard from './pages/CustomerDashboard';
import PlaceOrder from './pages/PlaceOrder';
import Reports from './pages/Reports';

// Placeholder components for new routes
const Placeholder = ({ title }) => (
  <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600">This module is currently under development.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<Inventory />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/my-orders" element={<CustomerDashboard />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/purchases" element={<Placeholder title="Purchase Orders" />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Placeholder title="User Administration" />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
