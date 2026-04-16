import axiosInstance from './axiosInstance';

export const getMyOrders = async () => {
  try {
    const response = await axiosInstance.get('/orders/my-orders');
    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
