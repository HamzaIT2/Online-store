import { useEffect, useState } from "react";
import { Container, Grid, Typography, CircularProgress, Card, CardContent, Button, Box } from "@mui/material";
import { t } from "../i18n";
import { Link as RouterLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getAllProducts } from "../api/productsAPI";
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
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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

      if (!data || data.length === 0) {
        setHeroSlides([]);
        return;
      }

      const formattedSlides = data.map((product, index) => {
        // Get backend base URL
        const backendUrl = (() => {
          try {
            const baseURL = axiosInstance.defaults.baseURL;
            const origin = new URL(baseURL).origin;
            return origin;
          } catch {
            return "http://localhost:3000";
          }
        })();

        let imageUrl = '/placeholder.jpg';
        if (product.images && product.images.length > 0 && product.images[0].url) {
          let cleanPath = product.images[0].url;
          if (cleanPath.startsWith('/uploads/')) {
            imageUrl = `${backendUrl}${cleanPath}`;
          } else if (cleanPath.startsWith('uploads/')) {
            imageUrl = `${backendUrl}/${cleanPath}`;
          } else if (cleanPath.startsWith('http')) {
            imageUrl = cleanPath;
          } else {
            imageUrl = `${backendUrl}/uploads/${cleanPath}`;
          }
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

      setHeroSlides(formattedSlides);

    } catch (error) {

    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };


  const loadProducts = async (currentSearchTerm, currentFilters) => {
    setLoading(true);
    setError("");
    try {

      const res = await getAllProducts(currentFilters, currentSearchTerm);
      const rawData = res?.data !== undefined ? res.data : res;
      const productsArray = Array.isArray(rawData) ? rawData : (rawData?.data || []);

      setProducts(productsArray);
    } catch (err) {
      setError(t('error_loading_product'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadingHeroSlides();
  }, []);

  // 2. المراقب الوحيد: يقرأ الرابط، يجهّز الفلاتر، ويستدعي loadProducts فوراً
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('categoryId');
    const provinceId = params.get('provinceId');
    const condition = params.get('condition');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    const q = params.get('search');

    // تجهيز الفلاتر المحدثة بناءً على الرابط
    const activeFilters = {
      category: (categoryId && categoryId !== 'undefined' && categoryId !== 'null') ? categoryId : "",
      provinceId: provinceId ? Number(provinceId) : null,
      condition: condition || null,
      priceRange: (minPrice && maxPrice) ? [Number(minPrice), Number(maxPrice)] : [0, 2000000],
    };

    const activeSearch = q || "";

    // 🎯 استدعاء دالة الجلب مباشرة بالقيم المستخرجة، مما يمنع أي استعلامات مزدوجة
    loadProducts(activeSearch, activeFilters);

    // مزامنة الـ States المحلية لتناسق واجهة المستخدم (FilterDrawer، الخ)
    setSearchTerm(activeSearch);
    setFilters(activeFilters);
    setSelectedCategoryId(activeFilters.category || null);

  }, [location.search]); // يعتمد فقط على تغير الرابط

  // ❌ تأكد من حذف الـ useEffect القديم الذي كان يعتمد على [selectedCategoryId, filters, searchTerm]

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
        mt: 10,
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
                  <Button
                    component={RouterLink}
                    to="/add-product"
                    variant="contained"
                    onClick={(e) => {
                      const token = localStorage.getItem('token');
                      if (!token) {
                        e.preventDefault();
                        navigate('/login');
                      }
                    }}
                  >
                    {t('add_product')}
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
