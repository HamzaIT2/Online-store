export function buildProductsQuery(filters) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q.trim());
  if (filters.category) params.set("categoryId", filters.category);
  if (filters.province) params.set("provinceId", filters.province);
  if (filters.city) params.set("cityId", filters.city);

  const map = {
    "جديد": "new",
    "شبه جديد": "like_new",
    "جيد": "good",
    "مقبول": "fair",
    "ضعيف": "poor",
  };
  if (filters.condition && map[filters.condition]) {
    params.set("condition", map[filters.condition]);
  }

  if (Array.isArray(filters.priceRange)) {
    const [minPrice, maxPrice] = filters.priceRange;
    params.set("minPrice", String(minPrice ?? 0));
    params.set("maxPrice", String(maxPrice ?? 1000000));
  }

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  return params.toString();
}

