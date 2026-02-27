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
        setHeroSlides([]); // تأكد من تفريغ المصفوفة إذا لم توجد بيانات
        return;
      }

      const formattedSlides = data.map((product, index) => {
        // 1. تحديد رابط الصورة الأساسي - استخدام مسار uploads مباشر
        const baseUrl = "/uploads";

        // 2. معالجة مسار الصورة بحذر
        let imageUrl = '/placeholder.jpg'; // صورة افتراضية
        if (product.images && product.images.length > 0 && product.images[0].url) {
          // إزالة أي تكرار محتمل للـ slash وتنظيف المسار
          let cleanPath = product.images[0].url;
          if (cleanPath.startsWith('/uploads/')) {
            cleanPath = cleanPath.replace('/uploads', '');
          } else if (cleanPath.startsWith('uploads/')) {
            cleanPath = cleanPath.replace('uploads', '');
          }

          // التأكد من أن المسار يبدأ بـ /
          if (!cleanPath.startsWith('/')) {
            cleanPath = `/${cleanPath}`;
          }

          imageUrl = `${baseUrl}${cleanPath}`;
        }

        return {
          id: `slide-${product.productId || index}-${index}`, // ID فريد لكل slide
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





  useEffect(() => {
    loadingHeroSlides();
  }, []);



  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      // Build endpoint + params instead of concatenating query into URL string.
      let endpoint = "/products";
      const isNumeric = (v) => v !== undefined && v !== null && /^\d+$/.test(String(v));
      const trimmedSearch = searchTerm.trim();
      const params = { _ts: Date.now() };

      if (trimmedSearch) {
        // Primary attempt: ask backend to filter by q param on /products/search or /products
        endpoint = "/products/search";
        params.q = trimmedSearch;
      } else {
        const hasAnyFilter =
          filters.category || filters.province || filters.condition ||
          (Array.isArray(filters.priceRange) && (filters.priceRange[0] != null || filters.priceRange[1] != null));

        if (hasAnyFilter) {
          const catIsId = isNumeric(filters.category);
          const provIsId = isNumeric(filters.province);

          if (catIsId || provIsId || filters.condition || filters.priceRange) {
            endpoint = "/products/filter";
            if (catIsId) params.categoryId = String(filters.category);
            // support numeric province ids or string slugs (e.g. 'p-baghdad')
            if (provIsId) params.provinceId = String(filters.province);
            else if (filters.province) params.province = String(filters.province);
            if (filters.condition) params.condition = filters.condition;
            // Only include price range if user changed it from the default
            const DEFAULT_PRICE_RANGE = [1000, 2000000];
            if (
              Array.isArray(filters.priceRange) &&
              (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] || filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1])
            ) {
              params.minPrice = String(filters.priceRange[0]);
              params.maxPrice = String(filters.priceRange[1]);
            }
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
              'p-baghdad': getCurrentLang() === 'ar' ? 'بغداد' : 'Baghdad',
              'p-basra': getCurrentLang() === 'ar' ? 'البصرة' : 'Basra',
              'p-ninawa': getCurrentLang() === 'ar' ? 'نينوى' : 'Nineveh',
              'p-erbil': getCurrentLang() === 'ar' ? 'أربيل' : 'Erbil',
              'p-sulaymaniyah': getCurrentLang() === 'ar' ? 'السليمانية' : 'Sulaymaniyah',
              'p-dohuk': getCurrentLang() === 'ar' ? 'دهوك' : 'Dohuk',
              'p-karbala': getCurrentLang() === 'ar' ? 'كربلاء' : 'Karbala',
              'p-najaf': getCurrentLang() === 'ar' ? 'النجف' : 'Najaf',
              'p-babil': getCurrentLang() === 'ar' ? 'بابل' : 'Babil',
              'p-wasit': getCurrentLang() === 'ar' ? 'واسط' : 'Wasit',
              'p-dhiqar': getCurrentLang() === 'ar' ? 'ذي قار' : 'Dhi Qar',
              'p-maysan': getCurrentLang() === 'ar' ? 'ميسان' : 'Maysan',
              'p-diwaniya': getCurrentLang() === 'ar' ? 'الديوانية' : 'Diwaniya',
              'p-kirkuk': getCurrentLang() === 'ar' ? 'كركوك' : 'Kirkuk',
              'p-diyala': getCurrentLang() === 'ar' ? 'ديالى' : 'Diyala',
              'p-anbar': getCurrentLang() === 'ar' ? 'الأنبار' : 'Anbar',
              'p-salah': getCurrentLang() === 'ar' ? 'صلاح الدين' : 'Salah ad Din',
              'p-muthanna': getCurrentLang() === 'ar' ? 'المثنى' : 'Muthanna',
            };
            const parts = [];
            if (filters.category && categoryMap[filters.category]) parts.push(categoryMap[filters.category]);
            if (filters.province && provinceMap[filters.province]) parts.push(provinceMap[filters.province]);
            const q = parts.join(' ');
            if (q) {
              endpoint = "/products/search";
              params.q = q;
            } else {
              endpoint = "/products";
            }
            endpoint = "/products";
          }
        }
      }

      console.log('Fetching products from endpoint:', endpoint, 'params:', params, 'searchTerm:', trimmedSearch);
      const extractList = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== 'object') return [];
        if (Array.isArray(payload.products)) return payload.products;
        if (Array.isArray(payload.items)) return payload.items;
        if (Array.isArray(payload.data)) return payload.data;
        if (Array.isArray(payload.result)) return payload.result;
        if (Array.isArray(payload.records)) return payload.records;
        // Fallback: first array property
        for (const k of Object.keys(payload)) {
          if (Array.isArray(payload[k])) return payload[k];
        }
        return [];
      };
      const normalizeCondition = (p) => {
        const raw = (
          p.condition ?? p.Condition ?? p.conditionCode ?? p.condition_key ??
          p.conditionLabel ?? p.condition_ar ?? p.conditionAr ?? p.condition_en ?? ''
        );
        const s = String(raw).trim().toLowerCase();
        if (!s) return '';
        // direct codes
        if (["new", "like_new", "good", "fair", "poor"].includes(s)) return s;
        // english variants
        if (s.includes('like') && s.includes('new')) return 'like_new';
        if (s.includes('good')) return 'good';
        if (s.includes('fair') || s.includes('average')) return 'fair';
        if (s.includes('poor') || s.includes('bad')) return 'poor';
        if (s.includes('new')) return 'new';
        // arabic variants
        if (s.includes('مثل') && s.includes('الجديد')) return 'like_new';
        if (s.includes('جيد')) return 'good';
        if (s.includes('متوسط') || s.includes('مقبول')) return 'fair';
        if (s.includes('سيئ') || s.includes('سيء') || s.includes('سيئة')) return 'poor';
        if (s.includes('جديد')) return 'new';
        return '';
      };
      const matchProvince = (product, provFilter) => {
        if (!provFilter) return true;
        const pf = String(provFilter).toLowerCase();
        // if numeric filter, compare numeric province id fields
        if (/^\d+$/.test(pf)) {
          const num = Number(pf);
          const candidates = [product.provinceId, product.provinceID, product.province_id, product.location && product.location.provinceId, product.province && product.province.provinceId];
          for (const c of candidates) {
            if (c == null) continue;
            if (String(c) === String(num)) return true;
            if (/^\d+$/.test(String(c)) && Number(c) === num) return true;
          }
          return false;
        }
        // string filter: match slug, name, or embedded objects
        const candidates = [
          product.province, product.provinceName, product.provinceNameAr, product.province_slug,
          product.location && product.location.province, product.location && product.location.provinceSlug,
          product.address && product.address.province,
          product.province && (product.province.slug || product.province.name || product.province.nameAr || product.province.provinceId),
          product.provinceId, product.provinceID, product.province_id,
        ].filter(Boolean).map(x => String(x).toLowerCase());
        return candidates.some(c => c === pf || c.includes(pf));
      };
      let res;
      let data;
      let list = [];
      try {
        res = await axiosInstance.get(endpoint, {
          headers: { 'Cache-Control': 'no-cache' },
          params,
        });
        data = res.data;
        list = extractList(data);
        console.log('Products response shape:', Array.isArray(data) ? 'array' : typeof data, 'count:', list.length);
      } catch (reqErr) {
        console.error('Product fetch failed for', endpoint, reqErr?.response?.status, reqErr?.message || reqErr);
        // If server error (5xx) or other failure while searching, try alternative search endpoints if search term exists
        if (trimmedSearch) {
          const q = encodeURIComponent(trimmedSearch);
          const candidates = [
            `/products?q=${q}`,
            `/products?search=${q}`,
            `/products/search?keyword=${q}`,
            `/products/search?query=${q}`,
          ];
          for (const cand of candidates) {
            try {
              console.log('Trying alternative search endpoint due to error:', cand);
              // alt candidate expressed as path string; try it with same params where possible
              const altParams = { _ts: Date.now() };
              // If candidate includes query param already, let axios use the string path; otherwise pass params
              const altRes = await (cand.includes('?')
                ? axiosInstance.get(cand, { headers: { 'Cache-Control': 'no-cache' } })
                : axiosInstance.get(cand, { headers: { 'Cache-Control': 'no-cache' }, params: altParams }));
              const altList = extractList(altRes.data);
              console.log('Alt endpoint', cand, 'returned', altList.length);
              if (altList && altList.length) {
                list = altList;
                break;
              }
            } catch (altErr) {
              console.warn('Alt search failed for', cand, altErr?.response?.status, altErr?.message || altErr);
            }
          }
        }
        // if still empty, rethrow to be handled by outer catch
      }

      // If user searched but the primary endpoint returned empty, try common alternative endpoints/param names
      if ((list.length === 0) && trimmedSearch) {
        const q = encodeURIComponent(trimmedSearch);
        const candidates = [
          `/products?q=${q}`,
          `/products?search=${q}`,
          `/products/search?keyword=${q}`,
          `/products/search?query=${q}`,
        ];
        for (const cand of candidates) {
          try {
            console.log('Trying alternative search endpoint:', cand);
            const altParams = { _ts: Date.now(), q: trimmedSearch };
            const altRes = await (cand.includes('?')
              ? axiosInstance.get(cand, { headers: { 'Cache-Control': 'no-cache' } })
              : axiosInstance.get(cand, { headers: { 'Cache-Control': 'no-cache' }, params: altParams }));
            const altList = extractList(altRes.data);
            console.log('Alt endpoint', cand, 'returned', altList.length);
            if (altList && altList.length) {
              list = altList;
              break;
            }
          } catch (e) {
            console.warn('Alt search failed for', cand, e?.message || e);
          }
        }
      }

      // Fallback: if backend filter returns empty, fetch all and filter client-side
      if (list.length === 0) {
        const hasAnyFilter =
          filters.category || filters.province || filters.condition ||
          (Array.isArray(filters.priceRange) && (filters.priceRange[0] != null || filters.priceRange[1] != null));
        if (hasAnyFilter) {
          try {
            const allRes = await axiosInstance.get('/products', {
              headers: { 'Cache-Control': 'no-cache' },
              params: { _ts: Date.now() },
            });
            const allData = allRes.data;
            const all = extractList(allData);
            const DEFAULT_PRICE_RANGE = [1000, 2000000];
            const [minP, maxP] = Array.isArray(filters.priceRange) ? filters.priceRange : DEFAULT_PRICE_RANGE;
            const catId = isNumeric(filters.category) ? Number(filters.category) : null;
            const provId = isNumeric(filters.province) ? Number(filters.province) : null;
            const provFilter = filters.province; // could be slug like 'p-baghdad' or numeric id
            const parseNumber = (v) => {
              if (v == null) return NaN;
              if (typeof v === 'number') return v;
              // remove commas, currency symbols and spaces
              const s = String(v).replace(/[^0-9.-]+/g, '');
              return s === '' ? NaN : Number(s);
            };
            const minNum = parseNumber(minP);
            const maxNum = parseNumber(maxP);
            list = all.filter((p) => {
              const pCategoryId = parseNumber(p.categoryId ?? p.categoryID ?? p.category_id);
              const pCategoryName = String(p.categoryName ?? p.category ?? '').toLowerCase();
              const pProvinceId = parseNumber(p.provinceId ?? p.provinceID ?? p.province_id);
              const pCondition = String(p.condition ?? p.Condition ?? '');
              const pPriceNum = parseNumber(p.price ?? p.Price ?? p.unitPrice ?? p.amount);

              // فلترة الفئة - دعم الـ ID والـ slug والاسم
              if (filters.category) {
                const catFilter = String(filters.category).toLowerCase();

                // إذا كانت الفئة رقمية (ID)
                if (isNumeric(filters.category)) {
                  const catIdNum = Number(filters.category);
                  if (!Number.isFinite(pCategoryId) || pCategoryId !== catIdNum) {
                    return false;
                  }
                } else {
                  // إذا كانت الفئة slug أو اسم
                  const categoryMatch =
                    catFilter === p.categoryId?.toString().toLowerCase() ||
                    catFilter === pCategoryName ||
                    p.categoryId?.toString().toLowerCase().includes(catFilter) ||
                    pCategoryName.includes(catFilter);

                  if (!categoryMatch) {
                    return false;
                  }
                }
              }

              // province filtering: support numeric id OR slug/name
              if (provId != null) {
                if (Number.isFinite(pProvinceId) && pProvinceId !== provId) return false;
              } else if (provFilter) {
                const pf = String(provFilter).toLowerCase();
                const candidates = [
                  p.province, p.provinceName, p.provinceNameAr, p.province_slug,
                  p.provinceId, p.provinceID, p.province_id,
                  p.location && p.location.province, p.location && p.location.provinceId,
                  p.province && p.province.provinceId, p.province && p.province.slug, p.province && p.province.name,
                ].filter(Boolean).map(x => String(x).toLowerCase());
                const match = candidates.some(c => c === pf || c.includes(pf));
                if (!match) return false;
              }

              if (filters.condition && pCondition && pCondition !== String(filters.condition)) return false;
              if (Number.isFinite(pPriceNum)) {
                if (Number.isFinite(minNum) && pPriceNum < minNum) return false;
                if (Number.isFinite(maxNum) && pPriceNum > maxNum) return false;
              }
              return true;
            });
            console.log('Client-side filtered count:', list.length);
          } catch (fallbackErr) {
            console.warn('Client-side filter fallback failed:', fallbackErr);
          }
        }
      }
      // If no filters and still empty, try showing all products
      if (list.length === 0) {
        try {
          const allRes = await axiosInstance.get('/products', {
            headers: { 'Cache-Control': 'no-cache' },
            params: { _ts: Date.now() },
          });
          const all = extractList(allRes.data);
          if (all.length) list = all;
        } catch (_) { }
      }
      // apply strict province filter client-side if user selected a province slug/id
      if (filters.province) {
        list = list.filter(p => matchProvince(p, filters.province));
      }

      // تطبيق فلترة الفئة بشكل صارم على مستوى العميل
      if (filters.category) {
        const beforeCount = list.length;
        list = list.filter(p => {
          const catFilter = String(filters.category).toLowerCase();
          const pCategoryId = String(p.categoryId ?? p.categoryID ?? p.category_id ?? '').toLowerCase();
          const pCategoryName = String(p.categoryName ?? p.category ?? '').toLowerCase();

          // إذا كانت الفئة رقمية
          if (isNumeric(filters.category)) {
            return pCategoryId === catFilter;
          }

          // إذا كانت slug أو اسم
          return pCategoryId.includes(catFilter) || pCategoryName.includes(catFilter) || pCategoryId === catFilter;
        });
        console.log(`Filtered by category "${filters.category}": ${beforeCount} → ${list.length} products`);
      }

      // always enforce condition filter client-side (backend may ignore it)
      if (filters.condition) {
        list = list.filter(p => normalizeCondition(p) === String(filters.condition));
      }

      if (res.status === 304) {
        console.log('Received 304 Not Modified, keeping previous products.');
        setProducts(prevProducts);
      } else {
        setProducts(list);
        if (list && list.length) setPrevProducts(list);
      }
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
      }}>

      <Box
        sx={{ mb: 6 }}
      >


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
