
import axiosInstance from './axiosInstance';


export const fetchHeroSlidesFromApi = async () => {
  try {
    // استبدل '/banners' بالمسار الحقيقي في الباك إند الخاص بك
    const response = await axiosInstance.get('/products/hero-slides');
    
    // إرجاع البيانات فقط (response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching hero slides",error);
    throw error;
  }
};