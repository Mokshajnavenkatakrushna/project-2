import axios from 'axios';

const apiBaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  ? import.meta.env.VITE_API_BASE
  : 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API calls
export const authApi = {
  signup: (userData: any) => api.post('/auth/signup', userData),
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
};

// Soil Analysis API calls
export const soilAnalysisApi = {
  createAnalysis: (data: any) => api.post('/soil-analysis', data),
  getUserAnalyses: (userId: string) => api.get(`/soil-analysis/user/${userId}`),
  getAnalysis: (id: string) => api.get(`/soil-analysis/${id}`),
  updateAnalysis: (id: string, data: any) => api.put(`/soil-analysis/${id}`, data),
  deleteAnalysis: (id: string) => api.delete(`/soil-analysis/${id}`),
};

// Order API calls
export const orderApi = {
  createOrder: (orderData: any) => api.post('/orders', orderData),
  getUserOrders: (userId: string) => api.get(`/orders/user/${userId}`),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id: string, reason?: string) => api.put(`/orders/${id}/cancel`, { reason }),
};

// Payment API calls
export const paymentApi = {
  processPayment: (paymentData: any) => api.post('/payments/process', paymentData),
  getPayment: (id: string) => api.get(`/payments/${id}`),
  getUserPayments: (userId: string) => api.get(`/payments/user/${userId}`),
  refundPayment: (id: string, reason?: string, amount?: number) => api.post(`/payments/${id}/refund`, { reason, amount }),
};

// User API calls (legacy)
export const userApi = {
  getUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
  createUser: (userData: any) => api.post('/users', userData),
};

export default api;