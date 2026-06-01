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
import LocationOnIcon from '@mui/icons-material/LocationOn';
// Get current language
const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};


const PROVINCE_FALLBACKS = {
  '73': { ar: 'بغداد', en: 'Baghdad' },
  '74': { ar: 'البصرة', en: 'Basra' },
  '75': { ar: 'النجف', en: 'Najaf' },
  '76': { ar: 'كربلاء', en: 'Karbala' },
  '77': { ar: 'أربيل', en: 'Erbil' },
  '78': { ar: 'السليمانية', en: 'Sulaymaniyah' },
  '79': { ar: 'دهوك', en: 'Duhok' },
  '80': { ar: 'نينوى', en: 'Nineveh' },
  '81': { ar: 'كركوك', en: 'Kirkuk' },
  '82': { ar: 'ديالى', en: 'Diyala' },
  '83': { ar: 'الأنبار', en: 'Anbar' },
  '84': { ar: 'بابل', en: 'Babil' },
  '85': { ar: 'واسط', en: 'Wasit' },
  '86': { ar: 'ميسان', en: 'Maysan' },
  '87': { ar: 'ذي قار', en: 'Dhi Qar' },
  '88': { ar: 'المثنى', en: 'Al-Muthanna' },
  '89': { ar: 'القادسية', en: 'Al-Qadisiyah' },
  '90': { ar: 'صلاح الدين', en: 'Salah ad Din' },
};
const CITY_FALLBACKS = {
  '206': { ar: 'بغداد', en: 'Baghdad' },
  '207': { ar: 'الكاظمية', en: 'Kadhimiya' },
  '208': { ar: 'مدينة الصدر', en: 'Sadr City' },
  '209': { ar: 'البصرة', en: 'Basra' },
  '210': { ar: 'الزبير', en: 'Al-Zubair' },
  '211': { ar: 'أم قصر', en: 'Umm Qasr' },
  '212': { ar: 'النجف', en: 'Najaf' },
  '213': { ar: 'الكوفة', en: 'Kufa' },
  '214': { ar: 'كربلاء', en: 'Karbala' },
  '215': { ar: 'الهندية', en: 'Al-Hindiya' },
  '216': { ar: 'أربيل', en: 'Erbil' },
  '217': { ar: 'شقلاوة', en: 'Shaqlawa' },
  '218': { ar: 'سوران', en: 'Soran' },
  '219': { ar: 'السليمانية', en: 'Sulaymaniyah' },
  '220': { ar: 'جمجمال', en: 'Chamchamal' },
  '221': { ar: 'رانية', en: 'Rania' },
  '222': { ar: 'دهوك', en: 'Duhok' },
  '223': { ar: 'زاخو', en: 'Zakho' },
  '224': { ar: 'عامدية', en: 'Amedi' },
  '225': { ar: 'الموصل', en: 'Mosul' },
  '226': { ar: 'تلعفر', en: 'Tal Afar' },
  '227': { ar: 'سنجار', en: 'Sinjar' },
  '228': { ar: 'كركوك', en: 'Kirkuk' },
  '229': { ar: 'داقوق', en: 'Daquq' },
  '230': { ar: 'الحويجة', en: 'Hawija' },
  '231': { ar: 'بعقوبة', en: 'Baqubah' },
  '232': { ar: 'خالص', en: 'Khalis' },
  '233': { ar: 'المقدادية', en: 'Muqdadiyah' },
  '234': { ar: 'الرمادي', en: 'Ramadi' },
  '235': { ar: 'الفلوجة', en: 'Fallujah' },
  '236': { ar: 'حديثة', en: 'Haditha' },
  '237': { ar: 'الحلة', en: 'Hilla' },
  '238': { ar: 'المحاويل', en: 'Mahawil' },
  '239': { ar: 'الكوت', en: 'Kut' },
  '240': { ar: 'الحي', en: 'Al-Hayy' },
  '241': { ar: 'العزيزية', en: 'Al-Aziziyah' },
  '242': { ar: 'العمارة', en: 'Amarah' },
  '243': { ar: 'علي الغربي', en: 'Ali Al-Gharbi' },
  '244': { ar: 'مجر الكبير', en: 'Majar Al-Kabir' },
  '245': { ar: 'الناصرية', en: 'Nasiriyah' },
  '246': { ar: 'الرفاعي', en: 'Al-Rifai' },
  '247': { ar: 'الشطرة', en: 'Al-Shatra' },
  '248': { ar: 'السماوة', en: 'Samawah' },
  '249': { ar: 'الرميثة', en: 'Al-Rumaitha' },
  '250': { ar: 'الخضر', en: 'Al-Khidir' },
  '251': { ar: 'الديوانية', en: 'Diwaniyah' },
  '252': { ar: 'حمزة', en: 'Hamza' },
  '253': { ar: 'عفك', en: 'Afak' },
  '254': { ar: 'سامراء', en: 'Samarra' },
  '255': { ar: 'تكريت', en: 'Tikrit' },
  '256': { ar: 'بيجي', en: 'Baiji' },
  '257': { ar: 'الشرقاط', en: 'Al-Shirqat' },
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
  // const getProvinceName = () => {
  //   const currentLang = getCurrentLang();

  //   // Try to get province name from product data
  //   let provinceId = product?.provinceId || product?.province?.provinceId || product?.province?.id;
  //   let provinceName = '';

  //   // If we have province data with multilingual names
  //   if (product?.province) {
  //     provinceName = currentLang === 'ar' ?
  //       (product.province.nameAr || product.province.name || product.province.nameEn) :
  //       (product.province.nameEn || product.province.name || product.province.nameAr);
  //   }

  //   // If no province name but we have provinceId, use fallback
  //   if (!provinceName && provinceId) {
  //     const key = String(provinceId);
  //     provinceName = PROVINCE_FALLBACKS[key]?.[currentLang] || PROVINCE_FALLBACKS[key]?.ar || '';
  //   }

  //   // Final fallback: try to extract from any province field
  //   if (!provinceName && product?.province) {
  //     provinceName = currentLang === 'ar' ?
  //       (product.province.nameAr || product.province.name) :
  //       (product.province.nameEn || product.province.name);
  //   }

  //   return provinceName;
  // };
  const getLocationInfo = () => {
    const currentLang = getCurrentLang();

    // استخراج المعرفات
    const provId = product?.provinceId || product?.province_id;
    const ctyId = product?.cityId || product?.city_id;
    const addressDetails = product?.address || product?.address_details;

    // 1. استخراج المحافظة
    let provinceName = '';
    if (product?.province) {
      provinceName = currentLang === 'ar' ?
        (product.province.nameAr || product.province.name_ar || product.province.name) :
        (product.province.nameEn || product.province.name_en || product.province.name);
    } else if (provId) {
      provinceName = PROVINCE_FALLBACKS[String(provId)]?.[currentLang] || PROVINCE_FALLBACKS[String(provId)]?.ar;
    }

    // 2. استخراج المدينة (من الكائن أو من القاموس الجديد)
    let cityName = '';
    if (product?.city) {
      cityName = currentLang === 'ar' ?
        (product.city.nameAr || product.city.name_ar || product.city.name) :
        (product.city.nameEn || product.city.name_en || product.city.name);
    } else if (ctyId) {
      cityName = CITY_FALLBACKS[String(ctyId)]?.[currentLang] || CITY_FALLBACKS[String(ctyId)]?.ar;
    }

    
    let finalLocation = [];
    if (provinceName) finalLocation.push(provinceName);

    
    if (cityName && cityName !== provinceName) {
      finalLocation.push(cityName);
    }

    if (addressDetails) finalLocation.push(addressDetails);

    return finalLocation.length > 0 ? finalLocation.join(' - ') : null;
  };

  const locationText = getLocationInfo();
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
          loading="lazy"
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

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1, gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              {locationText || t('unknown_location') || 'موقع غير محدد'}
              {conditionLabel ? ` • ${conditionLabel}` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" color="text.primary" fontWeight="bold">
                {product?.price?.toLocaleString()} {t('currency_iqd')}
              </Typography>
              <Typography variant="caption" color="text.primary">{t('seller_rating')}</Typography>
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
              color=""
              onClick={(e) => { e.stopPropagation(); handleMessageSeller(e); }}
              sx={{ minWidth: 44 }}
            >
              <MessageIcon />
            </Button>
            <Button
              variant="outlined"
              color=""
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

