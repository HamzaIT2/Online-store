/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress, Card, CardContent, Button, Box } from "@mui/material";
import { t } from "../i18n";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [filters, setFilters] = useState({
    category: "",
    province: "",
    condition: "",
    priceRange: [0, 1000000],
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
  const canSell = userType === 'seller' || userType === 'both';
  const showCreateCta = !token || canSell;

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      let url = "/products";

      const isNumeric = (v) => v !== undefined && v !== null && /^\d+$/.test(String(v));
      const trimmedSearch = searchTerm.trim();

      if (trimmedSearch) {
        url = `/products/search?q=${encodeURIComponent(trimmedSearch)}`;
      } else {
        const hasAnyFilter =
          filters.category || filters.province || filters.condition ||
          (Array.isArray(filters.priceRange) && (filters.priceRange[0] != null || filters.priceRange[1] != null));

        if (hasAnyFilter) {
          const params = new URLSearchParams();
          const catIsId = isNumeric(filters.category);
          const provIsId = isNumeric(filters.province);

          if (catIsId || provIsId || filters.condition || filters.priceRange) {
            url = "/products/filter";
            if (catIsId) params.append("categoryId", String(filters.category));
            if (provIsId) params.append("provinceId", String(filters.province));
            if (filters.condition) params.append("condition", filters.condition);
            if (filters.priceRange) {
              params.append("minPrice", String(filters.priceRange[0]));
              params.append("maxPrice", String(filters.priceRange[1]));
            }
            const qs = params.toString();
            if (qs) url += `?${qs}`;
          } else {
            // Fallback: if using string slugs (from static lists), search by keywords
            const categoryMap = {
              'c-clothes': 'ملابس',
              'c-furniture': 'أثاث',
              'c-electronics': 'إلكترونيات',
              'c-auto': 'سيارات',
              'c-beauty': 'جمال',
              'c-hobbies': 'هوايات',
            };
            const provinceMap = {
              'p-baghdad': 'بغداد',
              'p-basra': 'البصرة',
              'p-ninawa': 'نينوى',
              'p-erbil': 'أربيل',
              'p-sulaymaniyah': 'السليمانية',
              'p-dohuk': 'دهوك',
              'p-karbala': 'كربلاء',
              'p-najaf': 'النجف',
              'p-babil': 'بابل',
              'p-wasit': 'واسط',
              'p-dhiqar': 'ذي قار',
              'p-maysan': 'ميسان',
              'p-diwaniya': 'الديوانية',
              'p-kirkuk': 'كركوك',
              'p-diyala': 'ديالى',
              'p-anbar': 'الأنبار',
              'p-salah': 'صلاح الدين',
              'p-muthanna': 'المثنى',
            };
            const parts = [];
            if (filters.category && categoryMap[filters.category]) parts.push(categoryMap[filters.category]);
            if (filters.province && provinceMap[filters.province]) parts.push(provinceMap[filters.province]);
            const q = parts.join(' ');
            url = q ? `/products/search?q=${encodeURIComponent(q)}` : "/products";
          }
        }
      }

      const res = await axiosInstance.get(url);
      setProducts(res.data?.products || []);
    } catch (err) {
      console.error(err);
      setError(t('error_loading_product'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Read category from URL (e.g., /?category=c-clothes) and prefill filters
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const q = params.get('q');
    if (cat) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
    if (q) {
      // Apply search term from URL for subcategory quick search
      setSearchTerm(q);
    }
    loadProducts();
  }, [filters, searchTerm, location.search]);

  return (
    <Container sx={{ mt: 4, maxWidth: 'lg' }}>
      <SearchBar onSearch={setSearchTerm} />
      <Filters onFilterChange={handleFilterChange} />

      {loading ? (
        <Container sx={{ mt: 6, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      ) : error ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.productId}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
          {showCreateCta && (
            <Box sx={{ mt: 6 }}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{t('add_product') || 'Add Listing'}</Typography>
                  <Button component={RouterLink} to="/add-product" variant="contained">{t('add_product')}</Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

