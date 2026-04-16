import { Card, CardContent, CardMedia, Typography, Button, Box, Snackbar, Alert, Rating, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteToggle from "./FavoriteToggle";
import { createOrGetChat } from "../api/messagesAPI";
import { t } from "../i18n";
import axiosInstance from "../api/axiosInstance";
import { useState, useEffect } from "react";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import MessageIcon from '@mui/icons-material/Message';
import CountdownTimer from "./CountdownTimer";

// Get current language
const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};

// Province fallback data with multilingual support
const PROVINCE_FALLBACKS = {
  'p-baghdad': { ar: 'بغداد', en: 'Baghdad' },
  'p-basra': { ar: 'البصرة', en: 'Basra' },
  'p-ninawa': { ar: 'نينوى', en: 'Nineveh' },
  'p-erbil': { ar: 'أربيل', en: 'Erbil' },
  'p-sulaymaniyah': { ar: 'السليمانية', en: 'Sulaymaniyah' },
  'p-dohuk': { ar: 'دهوك', en: 'Dohuk' },
  'p-karbala': { ar: 'كربلاء', en: 'Karbala' },
  'p-najaf': { ar: 'النجف', en: 'Najaf' },
  'p-babil': { ar: 'بابل', en: 'Babil' },
  'p-wasit': { ar: 'واسط', en: 'Wasit' },
  'p-dhiqar': { ar: 'ذي قار', en: 'Dhi Qar' },
  'p-maysan': { ar: 'ميسان', en: 'Maysan' },
  'p-diwaniya': { ar: 'الديوانية', en: 'Diwaniya' },
  'p-kirkuk': { ar: 'كركوك', en: 'Kirkuk' },
  'p-diyala': { ar: 'ديالى', en: 'Diyala' },
  'p-anbar': { ar: 'الأنبار', en: 'Anbar' },
  'p-salah': { ar: 'صلاح الدين', en: 'Salah ad Din' },
  'p-muthanna': { ar: 'المثنى', en: 'Muthanna' },
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [, forceUpdate] = useState({});

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render to update province name
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleDetails = () => {
    if (product?.productId) navigate(`/products/${product.productId}`);
  };

  const getSellerUserId = (p) => {
    if (!p) return undefined;
    return p?.seller?.userId || p?.seller?.id || p?.user?.userId || p?.user?.id || p?.sellerId || p?.userId || p?.ownerId;
  };

  const handleMessageSeller = async (e) => {
    e?.stopPropagation?.();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      navigate('/login');
      return;
    }
    const sellerId = getSellerUserId(product);
    const productId = product?.productId || product?.id;
    if (!sellerId || !productId) return;
    try {
      const res = await createOrGetChat({ sellerId, productId });
      const payload = res?.data ?? res;
      const chat = payload?.data ?? payload ?? {};
      const chatId = chat?.id ?? chat?.chatId;
      if (chatId) navigate(`/chat?chatId=${chatId}`, { state: { chat } }); else navigate('/chat');
    } catch (_) {
      navigate('/chat');
    }
  };

  const handleAddToCart = () => {
    try {
      const key = 'cart';
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const img = product?.images?.find((i) => i?.isPrimary) || product?.images?.[0];
      const imageUrl = img?.imageUrl || img?.url || img?.image_url || null;
      const minimal = {
        productId: product?.productId,
        title: product?.title,
        price: product?.price,
        description: product?.description,
        images: imageUrl ? [{ imageUrl }] : [],
      };
      // avoid duplicates by productId
      const exists = current.some((p) => String(p?.productId) === String(minimal?.productId));
      const next = exists ? current : [...current, minimal];
      localStorage.setItem(key, JSON.stringify(next));

      // Trigger cart update event
      window.dispatchEvent(new Event('cart:updated'));
      setSnackbarOpen(true);
    } catch (_) { }
    setTimeout(() => navigate('/cart'), 600);
  };

  const apiOrigin = (() => {
    try { return new URL(axiosInstance.defaults.baseURL).origin; } catch { return ""; }
  })();

  const resolveImageSrc = () => {
    const img = product?.images?.find((i) => i?.isPrimary) || product?.images?.[0];
    let src = img?.imageUrl || img?.url || img?.image_url;
    if (!src) return "/placeholder.svg";
    const hasProtocol = /^https?:\/\//i.test(src);
    if (hasProtocol) return src;

    // Get backend base URL
    const backendUrl = (() => {
      try {
        const baseURL = axiosInstance.defaults.baseURL;
        const origin = new URL(baseURL).origin;
        return origin;
      } catch {
        return "http://localhost:3000"; // fallback
      }
    })();

    // Normalize uploads path to use backend URL
    if (src.startsWith("/uploads") || src.startsWith("uploads/")) {
      const path = src.startsWith("/") ? src : `/${src}`;
      return `${backendUrl}${path}`;
    }

    // If it's a relative path without /uploads, assume it's from backend
    if (!src.startsWith("/")) {
      return `${backendUrl}/${src}`;
    }

    return src;
  };
  const mainImage = resolveImageSrc();

  // Responsive image sizes
  const getImageSize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      return { width: 200, height: 200 }; // Mobile
    } else if (width < 1024) {
      return { width: 250, height: 250 }; // Tablet
    } else {
      return { width: 300, height: 300 }; // Desktop
    }
  };

  const imageDimensions = getImageSize();

  const conditionKeyMap = {
    new: 'condition_new',
    like_new: 'condition_like_new',
    good: 'condition_good',
    fair: 'condition_fair',
    poor: 'condition_poor',
  };

  // Get province name with multilingual support
  const getProvinceName = () => {
    const currentLang = getCurrentLang();

    // Try to get province name from product data
    let provinceId = product?.provinceId || product?.province?.provinceId || product?.province?.id;
    let provinceName = '';

    // If we have province data with multilingual names
    if (product?.province) {
      provinceName = currentLang === 'ar' ?
        (product.province.nameAr || product.province.name || product.province.nameEn) :
        (product.province.nameEn || product.province.name || product.province.nameAr);
    }

    // If no province name but we have provinceId, use fallback
    if (!provinceName && provinceId) {
      const key = String(provinceId);
      provinceName = PROVINCE_FALLBACKS[key]?.[currentLang] || PROVINCE_FALLBACKS[key]?.ar || '';
    }

    // Final fallback: try to extract from any province field
    if (!provinceName && product?.province) {
      provinceName = currentLang === 'ar' ?
        (product.province.nameAr || product.province.name) :
        (product.province.nameEn || product.province.name);
    }

    return provinceName;
  };

  const provinceName = getProvinceName();
  const conditionLabel = t(conditionKeyMap[product?.condition] || '');

  return (
    <>
      <Card
        sx={{
          width: "100%",
          minHeight: { xs: 450, sm: 480, md: 500 }, // Minimum height for consistency
          borderRadius: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.03)" },

          display: "flex",
          flexDirection: "column",
          position: 'relative', // Needed for badge positioning
        }}
        onClick={handleDetails}
        role="button"
        tabIndex={0}
        aria-label={product?.title || 'View product details'}
      >
        {/* Sold Badge Overlay */}
        {product?.status === 'sold' && (
          <Badge
            badgeContent="مباع"
            color="error"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              '& .MuiBadge-badge': {
                fontSize: '0.8rem',
                fontWeight: 'bold',
                padding: '4px 8px',
                minWidth: '60px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: '#d32f2f',
                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.6)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                }
              }
            }}
          />
        )}

        <CardMedia
          component="img"
          sx={{
            width: '100%',
            height: { xs: 200, sm: 250, md: 300 }, // Responsive height
            objectFit: 'cover',
            borderRadius: '8px 8px 0 0',
            opacity: product?.status === 'sold' ? 0.7 : 1, // Dim image if sold
          }}
          image={mainImage}
          alt={product?.title || 'Product'}
        />

        <CardContent sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 200 // Minimum content area height
        }}>

          {product.offerExpiresAt && (
            <CountdownTimer

              targetDate={product.offerExpiresAt} />
          )}
          <Typography variant="h7" fontWeight="bold" sx={{ mb: 1 }}>
            {product?.title?.length > 35 ? product?.title?.slice(0, 35) + "..." : product?.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              minHeight: 60, // Fixed height for description area
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3, // Show exactly 3 lines
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3
            }}
          >
            {product?.description?.length > 150 ? product?.description?.slice(0, 150) + "..." : product?.description}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {provinceName} {provinceName && conditionLabel ? "-" : ""} {conditionLabel}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                {product?.price?.toLocaleString()} {t('currency_iqd')}
              </Typography>
              <Rating value={Number(product?.ratingAverage ?? product?.avgRating ?? product?.rating ?? 0)} precision={0.5} readOnly size="small" />
              {Boolean(product?.ratingCount) && (
                <Typography variant="caption" color="text.secondary">({product?.ratingCount})</Typography>
              )}
            </Box>
            {product?.productId && <FavoriteToggle productId={product.productId} size="small" />}
          </Box>

        </CardContent>

        <Box sx={{ textAlign: "center", pb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-evenly', flexWrap: 'wrap' }}>



            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => { e.stopPropagation(); handleMessageSeller(e); }}
              sx={{ minWidth: 44 }}
            >
              <MessageIcon />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}>
              <AddShoppingCartIcon />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => { e.stopPropagation(); handleDetails(); }}>
              {t('buy_now')}
            </Button>
          </Box>
        </Box>
      </Card>




      <Snackbar
        open={snackbarOpen}
        autoHideDuration={800}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('added_to_cart') || 'تمت الإضافة إلى السلة'}
        </Alert>
      </Snackbar>
    </>
  );
}

