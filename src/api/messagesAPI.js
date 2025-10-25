import axiosInstance from "./axiosInstance";

export const listChats = async (params = {}) => {
  return axiosInstance.get("/chats", { params });
};

export const getChatMessages = async (chatId, params = {}) => {
  return axiosInstance.get(`/chats/${chatId}/messages`, { params });
};

export const createOrGetChat = async ({ sellerId, productId, orderId }) => {
  const payload = {};
  const s = Number(sellerId);
  if (Number.isFinite(s)) payload.sellerId = s;
  const p = Number(productId);
  if (Number.isFinite(p)) payload.productId = p;
  const o = Number(orderId);
  if (Number.isFinite(o)) payload.orderId = o;
  return axiosInstance.post("/chats", payload);
};

export const sendMessage = async (chatId, payload) => {
  // payload: { type: 'text'|'image', text?, imageUrl? }
  return axiosInstance.post(`/chats/${chatId}/messages`, payload);
};
