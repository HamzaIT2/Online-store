/* eslint-disable no-unused-vars */
import axiosInstance from "./axiosInstance";

export const getAllProducts = async (filters = {}, search = "") => {
  const hasFilters = Object.keys(filters).some(key => 
    filters[key] !== null && filters[key] !== undefined && filters[key] !== ""
  );
  const hasSearch = search && search.trim();

  const endpoint = hasFilters ? "/products/filter" : "/products";
  const params = {};

  // Add search parameter (only if not empty)
  if (hasSearch) {
    params.search = search.trim();
  }

  // Add filter parameters (only if not empty)
  if (filters.category && filters.category.trim() && filters.category !== 'undefined' && filters.category !== 'null') {
    params.categoryId = filters.category.trim();
  }
  if (filters.provinceId && filters.provinceId !== null) {
    params.provinceId = filters.provinceId;
  }
  if (filters.city && filters.city.trim()) {
    params.cityId = filters.city.trim();
  }
  if (filters.condition && filters.condition !== null && ['new', 'used', 'like_new', 'bad'].includes(filters.condition)) {
    params.condition = filters.condition;
  }
  
  // Handle price range (only if valid values exist)
  if (filters.minPrice !== null && filters.minPrice !== undefined && filters.minPrice !== "") {
    params.minPrice = String(filters.minPrice);
  }
  if (filters.maxPrice !== null && filters.maxPrice !== undefined && filters.maxPrice !== "") {
    params.maxPrice = String(filters.maxPrice);
  }
  
  // Add pagination parameters (only if not empty)
  if (filters.page != null && filters.page !== "") {
    params.page = String(filters.page);
  }
  if (filters.limit != null && filters.limit !== "") {
    params.limit = String(filters.limit);
  }

  // Only add query string if there are parameters
  const query = Object.keys(params).length > 0 ? new URLSearchParams(params).toString() : "";
  const url = query ? `${endpoint}?${query}` : endpoint;
  
  const res = await axiosInstance.get(url);
  return res;
};
