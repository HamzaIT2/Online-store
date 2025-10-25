import { Card, CardContent, CardMedia, Typography, Button, Box, Snackbar, Alert, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteToggle from "./FavoriteToggle";
import { t } from "../i18n";
import axiosInstance from "../api/axiosInstance";
import { useState } from "react";
import { createOrGetChat } from "../api/messagesAPI";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleDetails = () => {
    if (product?.productId) navigate(`/products/${product.productId}`);
  };

  const handleContactSeller = async (e) => {
    e.stopPropagation();
    try {
      const sellerId = product?.sellerId || product?.userId || product?.ownerId || product?.seller?.id || product?.user?.id;
      if (!sellerId) { navigate('/chats'); return; }
      const res = await createOrGetChat({ sellerId, productId: product?.productId });
      const payload = res?.data ?? res;
      const chat = payload?.data ?? payload ?? {};
      const chatId = chat?.id || chat?.chatId || payload?.id || payload?.chatId;
      if (chatId) navigate(`/chats?chatId=${chatId}`); else navigate('/chats');
    } catch (_) {
      navigate('/chats');
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
        images: imageUrl ? [{ imageUrl }] : [],
      };
      // avoid duplicates by productId
      const exists = current.some((p) => String(p?.productId) === String(minimal?.productId));
      const next = exists ? current : [...current, minimal];
      localStorage.setItem(key, JSON.stringify(next));
      console.log('Added to cart:', minimal);
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
    // Normalize uploads path to backend origin
    if (src.startsWith("/uploads") || src.startsWith("uploads/")) {
      const path = src.startsWith("/") ? src : `/${src}`;
      return apiOrigin ? `${apiOrigin}${path}` : path;
    }
    return src;
  };
  const mainImage = resolveImageSrc();

  const conditionKeyMap = {
    new: 'condition_new',
    like_new: 'condition_like_new',
    good: 'condition_good',
    fair: 'condition_fair',
    poor: 'condition_poor',
  };

  const provinceName = product?.province?.nameAr || product?.province?.name || "";
  const conditionLabel = t(conditionKeyMap[product?.condition] || '');

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.3s",
          "&:hover": { transform: "scale(1.03)" },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={handleDetails}
        role="button"
        tabIndex={0}
        aria-label={product?.title || 'View product details'}
      >
        <CardMedia component="img" height="200" image={mainImage} alt={product?.title || 'Product'} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            {product?.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {provinceName} {provinceName && conditionLabel ? "-" : ""} {conditionLabel}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}>{t('add_to_cart') || 'Add to Cart'}</Button>
            <Button variant="contained" color="error" onClick={(e) => { e.stopPropagation(); handleDetails(); }}>{t('view_details')}</Button>
            <Button variant="outlined" color="primary" onClick={handleContactSeller}>{t('contact_seller') || 'تواصل مع البائع'}</Button>
          </Box>
        </Box>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={800} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ width: '100%' }}>
          {t('added_to_cart') || 'تمت الإضافة إلى السلة'}
        </Alert>
      </Snackbar>
    </>
  );
}

