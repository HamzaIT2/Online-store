import axiosInstance from "./axiosInstance";

export const listChats = async (params = {}) => {
  return axiosInstance.get("/chats", { params });
};

export const getChatMessages = async (chatId, params = {}) => {
  return axiosInstance.get(`/chats/${chatId}/messages`, { params });
};

export const findExistingChat = async (buyerId, sellerId, productId) => {
  return axiosInstance.get("/chats/find", { 
    params: { buyerId, sellerId, productId }
  });
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
  // Backend expects 'text' field, not 'content'
  console.log('API sendMessage called:', {
    chatId,
    payload,
    fullUrl: `/chats/${chatId}/messages`
  });
  
  // Transform payload to match backend expectations
  const apiPayload = {
    text: payload.text || payload.content || '',  // ✅ Backend expects 'text' field
    type: payload.type || 'text',
    // Include other fields if needed
    ...(payload.imageUrl && { imageUrl: payload.imageUrl })
  };
  
  
  
  try {
    const response = await axiosInstance.post(`/chats/${chatId}/messages`, apiPayload);
    
    return response;
  } catch (error) {
    console.error('API sendMessage error:', error);
    console.error('Error response data:', error.response?.data);
    throw error;
  }
};
