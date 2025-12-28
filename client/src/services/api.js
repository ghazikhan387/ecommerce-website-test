import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if not already on login page to avoid loops
      if (!window.location.pathname.startsWith('/login')) {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/users/me'),
  getAllUsers: () => api.get('/users'),

  // Branches
  getBranches: () => api.get('/branches'),

  // Inventory
  getBooks: () => api.get('/inventory/stock'), // Simplified: Getting stock includes books
  getStock: (params) => api.get('/inventory/stock', { params }),
  getLowStockAlerts: (params) => api.get('/inventory/alerts/low-stock', { params }),
  updateStock: (data) => api.post('/inventory/adjust-stock', data),
  transferStock: (data) => api.post('/inventory/transfer', data),
  createBook: (data) => api.post('/inventory/books', data),
  
  // Sales
  createProforma: (data) => api.post('/sales', data),
  confirmOrder: (id) => api.post(`/sales/${id}/confirm`),
  generateInvoice: (id, data) => api.post(`/sales/${id}/invoice`, data),
  getChallan: (id) => api.get(`/sales/${id}/challan`), // View Challan
  
  // Purchases
  createPurchase: (data) => api.post('/purchases', data),
  updatePurchaseStatus: (id, data) => api.post(`/purchases/${id}/status`, data),

  // Reports
  getDaybook: (params) => api.get('/reports/daybook', { params }),
  getOutstanding: (params) => api.get('/reports/outstanding', { params }),
  getAging: () => api.get('/reports/aging'),
  getInvoices: (params) => api.get('/reports/invoices', { params }),
  getPendingOrders: (params) => api.get('/reports/orders', { params }), // ?status=PROFORMA
  getChallans: () => api.get('/reports/challans'),
  getSalesAnalysis: () => api.get('/reports/analysis'),
  getProfitability: (params) => api.get('/reports/profitability', { params }),
  
  // Customers (Admin View)
  getCustomers: (params) => api.get('/reports/outstanding', { params }),

  // Customer Portal
  getMyOrders: () => api.get('/customer/orders'),
  placeBulkOrder: (data) => api.post('/customer/orders', data),
  getMyFinance: () => api.get('/customer/finance'),
};

export default api;
