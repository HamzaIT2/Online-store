import axiosInstance from "./axiosInstance";

export const registerUser = async (data) => {
  return axiosInstance.post("/auth/register", data);
};

export const loginUser = async (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const validateToken = async () => {
  // Backend does not provide /auth/validate; use profile endpoint to validate token
  return axiosInstance.get("/users/profile");
};
