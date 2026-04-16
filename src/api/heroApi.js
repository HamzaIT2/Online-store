import axiosInstance from './axiosInstance';


export const fetchHeroSlidesFromApi = async () => {
  try {
    // استبدل '/banners' بالمسار الحقيقي في الباك إند الخاص بك
    const response = await axiosInstance.get('/products/hero-slides');
    
    // إرجاع البيانات مباشرة (الـ interceptor يستخرجها تلقائياً)
    return response;
  } catch (error) {
    console.error("Error fetching hero slides",error);
    throw error;
  }
};