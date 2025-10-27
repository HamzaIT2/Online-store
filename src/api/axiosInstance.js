import axios from "axios";

const axiosInstance = axios.create({
  //baseURL: import.meta.env.VITE_API_URL,
 // baseURL: process.env.REACT_APP_API_URL
  baseURL: "https://al-dawaar-backend.onrender.com/api/v1",
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

export default axiosInstance;

