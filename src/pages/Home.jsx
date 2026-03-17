import { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress, Card, CardContent, Button, Box } from "@mui/material";
import { t } from "../i18n";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { Grow } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchHeroSlidesFromApi } from "@/api/heroApi";
import HeroSlider from "../components/HeroSlider";

// Get current language
const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};

export default function Home() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    province: "",
    condition: "",
    priceRange: [1000, 2000000],
  });

  const [heroSlides, setHeroSlides] = useState([]);
  const [loadingHero, setLoadingHero] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [products, setProducts] = useState([]);
  const [prevProducts, setPrevProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
  const canSell = userType === 'seller' || userType === 'both';
  const showCreateCta = !token || canSell;

  const loadingHeroSlides = async () => {
    try {
      const data = await fetchHeroSlidesFromApi();
      console.log("🔥 البيانات الخام من السيرفر:", data);

      if (!data || data.length === 0) {
        setHeroSlides([]);
        return;
      }

      const formattedSlides = data.map((product, index) => {
        const baseUrl = "/uploads";
        let imageUrl = '/placeholder.jpg';
        if (product.images && product.images.length > 0 && product.images[0].url) {
          let cleanPath = product.images[0].url;
          if (cleanPath.startsWith('/uploads/')) {
            cleanPath = cleanPath.replace('/uploads', '');
          } else if (cleanPath.startsWith('uploads/')) {
            cleanPath = cleanPath.replace('uploads', '');
          }

          if (!cleanPath.startsWith('/')) {
            cleanPath = `/${cleanPath}`;
          }

          imageUrl = `${baseUrl}${cleanPath}`;
        }

        return {
          id: `slide-${product.productId || index}-${index}`,
          image: imageUrl,
          title: product.title || "No Title",
          description: product.price ? `${Number(product.price).toLocaleString()} IQD` : '',
          link: `/products/${product.productId}`,
          buttonText: t('view_details') || "View Details"
        };
      });

      console.log("✅ البيانات المنسقة للسلايدر:", formattedSlides);
      setHeroSlides(formattedSlides);

    } catch (error) {
      console.error("❌ Error fetching hero slides:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      // جلب المنتجات من API - الكود البسيط الذي كان يعمل
      const res = await axiosInstance.get('/products', {
        headers: { 'Cache-Control': 'no-cache' },
        params: { _ts: Date.now() },
      });

      console.log('Products fetched:', res.data);
      setProducts(res.data.data || []);

    } catch (err) {
      console.error('Error loading products:', err);
      setError(t('error_loading_product'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadingHeroSlides();
  }, []);

  useEffect(() => {
    // Read category from URL (e.g., /?category=c-clothes) and prefill filters
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const q = params.get('q');

    // تحديث الفئة إذا كانت موجودة في URL
    if (cat) {
      setFilters((prevFilters) => {
        // تحديث الفئة فقط إذا كانت مختلفة عن الحالية
        if (prevFilters.category !== cat) {
          return { ...prevFilters, category: cat };
        }
        return prevFilters;
      });
    } else {
      // مسح الفئة إذا لم تكن موجودة في URL
      setFilters((prevFilters) => {
        if (prevFilters.category !== '') {
          return { ...prevFilters, category: '' };
        }
        return prevFilters;
      });
    }

    // تحديث مصطلح البحث إذا كان موجوداً في URL
    if (q) {
      // Apply search term from URL for subcategory quick search
      setSearchTerm(q);
    } else {
      // مسح مصطلح البحث إذا لم يكن موجوداً
      setSearchTerm('');
    }
  }, [location.search]);

  useEffect(() => {
    loadProducts();
  }, [filters, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // الاستماع لحدث إضافة منتج جديد
  useEffect(() => {
    const handleProductAdded = () => {
      console.log('Product added event detected - refreshing products');
      loadProducts();
      loadingHeroSlides();
    };

    window.addEventListener('productAdded', handleProductAdded);
    return () => {
      window.removeEventListener('productAdded', handleProductAdded);
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        mt: 8.1,
        width: {
          xs: "100%",
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "100%",
        }
      }}
    >
      <Box sx={{ mb: 6 }}>
        <HeroSlider slides={heroSlides} loading={loadingHero} />
      </Box>

      <Box>
        {/* <Filters onFilterChange={handleFilterChange} /> */}
      </Box>

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
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {products.map((p, index) => (
              <Grow in={true} timeout={(index * 800)} key={p.productId}>
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                  sx={{ display: 'flex' }}
                >
                  <ProductCard product={p} />
                </Grid>
              </Grow>
            ))}
          </Grid>
          {showCreateCta && (
            <Box sx={{ mt: 6 }}>
              <Card>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 100 }}>{t('add_product') || 'Add Listing'}</Typography>
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
