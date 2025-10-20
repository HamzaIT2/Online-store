/* eslint-disable no-unused-vars */
import axiosInstance from "./axiosInstance";

export const getAllProducts = async (filters = {}, search = "") => {
  let endpoint = "/products";
  const params = new URLSearchParams();

  if (search) {
    endpoint = "/products/search";
    params.set("q", search);
  }

  const hasFilter =
    !search && (
      filters.category ||
      filters.province ||
      filters.city ||
      filters.condition ||
      (Array.isArray(filters.priceRange) &&
        (filters.priceRange[0] != null || filters.priceRange[1] != null))
    );

  if (hasFilter) {
    endpoint = "/products/filter";
  }

  if (filters.category) params.set("categoryId", filters.category);
  if (filters.province) params.set("provinceId", filters.province);
  if (filters.city) params.set("cityId", filters.city);
  if (filters.condition) params.set("condition", filters.condition);
  if (Array.isArray(filters.priceRange)) {
    params.set("minPrice", String(filters.priceRange[0] ?? 0));
    params.set("maxPrice", String(filters.priceRange[1] ?? 1000000));
  }
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const query = params.toString();
  const url = query ? `${endpoint}?${query}` : endpoint;
  const res = await axiosInstance.get(url);
  return res.data;
};
