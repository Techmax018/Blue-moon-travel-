// API Base URL - Update this to your backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== DESTINATIONS API ====================
const destinationAPI = {
  // Get all destinations
  getAll: async () => {
    try {
      const response = await apiClient.get('/destinations');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },

  // Get single destination
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/destinations/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching destination:', error);
      throw error;
    }
  },

  // Create destination (admin only)
  create: async (destinationData) => {
    try {
      const response = await apiClient.post('/destinations', destinationData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating destination:', error);
      throw error;
    }
  },

  // Update destination (admin only)
  update: async (id, destinationData) => {
    try {
      const response = await apiClient.put(`/destinations/${id}`, destinationData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating destination:', error);
      throw error;
    }
  },

  // Delete destination (admin only)
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/destinations/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting destination:', error);
      throw error;
    }
  },
};

// ==================== BOOKINGS API ====================
const bookingAPI = {
  // Get all bookings (admin only)
  getAll: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get user's bookings
  getUserBookings: async (userId) => {
    try {
      const response = await apiClient.get(`/bookings/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  },

  // Get single booking
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  // Create booking
  create: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  update: async (id, bookingData) => {
    try {
      const response = await apiClient.put(`/bookings/${id}`, bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Cancel booking
  cancel: async (id) => {
    try {
      const response = await apiClient.put(`/bookings/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Delete booking
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },
};

// ==================== PAYMENTS API ====================
const paymentAPI = {
  // Create payment intent
  createPaymentIntent: async (amount, bookingId) => {
    try {
      const response = await apiClient.post('/payments/create-intent', {
        amount,
        bookingId,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, paymentMethodId) => {
    try {
      const response = await apiClient.post('/payments/confirm', {
        paymentIntentId,
        paymentMethodId,
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (bookingId) => {
    try {
      const response = await apiClient.get(`/payments/status/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },
};

// ==================== HELPER FUNCTIONS ====================
// Format currency
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Get auth token
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Set auth token
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Clear auth token
function clearAuthToken() {
  localStorage.removeItem('authToken');
}

// Check if user is logged in
function isUserLoggedIn() {
  return !!getAuthToken();
}
