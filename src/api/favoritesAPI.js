import axiosInstance from "./axiosInstance";

export const addFavorite = async (productId) => {
  return axiosInstance.post("/favorites", { productId });
};

export const removeFavoriteByProduct = async (productId) => {
  return axiosInstance.delete(`/favorites/product/${productId}`);
};

export const getMyFavorites = async () => {
  return axiosInstance.get("/favorites/my-favorites");
};

export const checkIsFavorited = async (productId) => {
  return axiosInstance.get(`/favorites/check/${productId}`);
};

export const getFavoriteCount = async (productId) => {
  return axiosInstance.get(`/favorites/count/${productId}`);
};
