import axios from "axios";

const envUrl = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.PROD;
let resolvedBaseURL = envUrl;
if (isProd && (!resolvedBaseURL || /localhost|127\.0\.0\.1/i.test(String(resolvedBaseURL)))) {
  resolvedBaseURL = "https://al-dawaar-backend.onrender.com/api/vl";
}

const axiosInstance = axios.create({
  baseURL: resolvedBaseURL,
 // baseURL: process.env.REACT_APP_API_URL
  //baseURL: "https://al-dawaar-backend.onrender.com/api/v1",
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

