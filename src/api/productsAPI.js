import axiosInstance from "./axiosInstance";

export const getAllProducts = async (filters = {}, search = "") => {
  const params = {};

  if (search && search.trim()) params.search = search.trim();

  if (filters.category && String(filters.category).trim() && filters.category !== "undefined" && filters.category !== "null") {
    params.categoryId = String(filters.category).trim();
  }

  if (filters.provinceId) params.provinceId = filters.provinceId;
  if (filters.city) params.cityId = filters.city.trim();
  if (filters.condition) params.condition = filters.condition;

  if (filters.priceRange && Array.isArray(filters.priceRange)) {
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000000) {
      params.minPrice = String(filters.priceRange[0]);
      params.maxPrice = String(filters.priceRange[1]);
    }
  }

  params.page = filters.page ? String(filters.page) : "1";
  params.limit = filters.limit ? String(filters.limit) : "20";

  const query = new URLSearchParams(params).toString();


  const endpoint = `/products/filter?${query}`;



  const res = await axiosInstance.get(endpoint);
  return res;
};