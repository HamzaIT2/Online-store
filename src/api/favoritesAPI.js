import axiosInstance from "./axiosInstance";

export const addFavorite = async (productId) => {
  return axiosInstance.post("/favorites", { productId });
};

export const removeFavoriteByProduct = async (productId) => {
  return axiosInstance.delete(`/favorites/product/${productId}`);
};

export const getMyFavorites = async () => {
  const candidates = [
    "/favorites/my-favorites",
    "/favorites/me",
    "/favorites",
    "/users/me/favorites",
    "/favorite/my-favorites",
  ];
  let lastErr;
  for (const path of candidates) {
    try {
      const res = await axiosInstance.get(path);
      return res;
    } catch (e) {
      lastErr = e;
      // try next
    }
  }
  throw lastErr || new Error("Favorites endpoint not found");
};

export const checkIsFavorited = async (productId) => {
  return axiosInstance.get(`/favorites/check/${productId}`);
};

export const getFavoriteCount = async (productId) => {
  return axiosInstance.get(`/favorites/count/${productId}`);
};

