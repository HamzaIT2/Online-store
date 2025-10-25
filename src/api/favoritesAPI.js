import axiosInstance from "./axiosInstance";

export const addFavorite = async (productId) => {
  // Try multiple common endpoints/payload shapes used by different backends
  const candidates = [
    { method: "post", path: "/favorites", body: { productId } },
    { method: "post", path: `/favorites/${productId}`, body: null },
    { method: "post", path: "/favorites/add", body: { id: productId } },
    { method: "post", path: "/users/me/favorites", body: { productId } },
    { method: "post", path: "/users/favorites", body: { productId } },
  ];
  let lastErr;
  for (const c of candidates) {
    try {
      if (c.method === "post") {
        console.log("[favoritesAPI] trying", c.path, "body=", c.body);
        const res = c.body
          ? await axiosInstance.post(c.path, c.body)
          : await axiosInstance.post(c.path);
        console.log("[favoritesAPI] success", c.path, "status=", res?.status);
        return res;
      }
    } catch (e) {
      lastErr = e;
      // try next
    }
  }
  // fallback: original call to keep behavior
  try {
    return await axiosInstance.post("/favorites", { productId });
  } catch (e) {
    throw lastErr || e;
  }
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
