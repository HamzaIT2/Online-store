import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;
//let resolvedBaseURL = envUrl;
//if (isProd && (!resolvedBaseURL || /localhost|127\.0\.0\.1/i.test(String(resolvedBaseURL)))) {
//  resolvedBaseURL = "https://al-dawaar-backend.onrender.com/api/v1";
//}

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "/api/v1",
  // baseURL: process.env.REACT_APP_API_URL
  // baseURL: "https://al-dawaar-backend.onrender.com/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
},
(error) =>{
  return Promise.reject(error);
}

);

// Response interceptor to handle new backend structure { success: true, data: ... }
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response has the new structure, extract the data
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return response.data.data;
    }
    // Otherwise, return the response data as is (for backward compatibility)
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized errors gracefully
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Don't redirect automatically for background API calls to avoid disrupting user experience
      // Components will handle redirection when needed
      
      // For background checks (like favorite status), resolve with null/false instead of throwing
      const requestUrl = error.config?.url || '';
      if (requestUrl.includes('/favorites/check/') || 
          requestUrl.includes('/favorites/count/') ||
          requestUrl.includes('/chats') ||
          requestUrl.includes('/users/profile')) {
        return Promise.resolve(null); // Resolve with null for background checks
      }
    }
    
    // Handle error responses with new backend structure
    if (error.response && error.response.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
      // If error also has the new structure, pass through the error data
      return Promise.reject(error.response.data);
    }
    // Otherwise, pass through the original error
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ✅ Debug utility function - call from browser console: checkAuth()
window.checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const userId = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  
  console.log('Token:', token ? 'Present' : 'Not found');
  console.log('User:', user ? 'Present' : 'Not found');
  console.log('UserId:', userId || 'Not found');
  console.log('UserType:', userType || 'Not found');
  
  return { token: !!token, user: !!user, userId, userType };
};

// ✅ Debug function to test profile API - call from browser console: testProfileAPI()
window.testProfileAPI = async () => {
  try {
    const response = await axiosInstance.get('/users/profile');
    console.log('Profile API Success:', response);
    return response;
  } catch (error) {
    console.error('Profile API Error:', error);
    return error;
  }
};

