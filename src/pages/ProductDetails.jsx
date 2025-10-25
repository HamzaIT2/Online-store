import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Container, Typography, CircularProgress, Card, CardMedia, CardContent, Button, Grid, Rating, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { createOrGetChat } from "../api/messagesAPI";
import FavoriteToggle from "../components/FavoriteToggle";
import { t } from "../i18n";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [summary, setSummary] = useState({ ratingAverage: 0, ratingCount: 0 });
  const [rateOpen, setRateOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [rateTxnId, setRateTxnId] = useState("");
  const [rateError, setRateError] = useState("");
  
  const getSellerUserId = (p) => {
    if (!p) return undefined;
    return (
      p?.seller?.userId ||
      p?.seller?.id ||
      p?.user?.userId ||
      p?.user?.id ||
      p?.sellerId ||
      p?.userId ||
      p?.ownerId
    );
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(t('error_loading_product'));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const ur = Number(product.userRating ?? product.myRating ?? 0);
    setUserRating(isNaN(ur) ? 0 : ur);
    const sellerId = getSellerUserId(product);
    if (sellerId) {
      axiosInstance.get(`/reviews/user/${sellerId}/summary`).then((res) => {
        const s = res?.data || {};
        setSummary({ ratingAverage: Number(s.ratingAverage || 0), ratingCount: Number(s.ratingCount || 0) });
      }).catch((e) => {
        // If no summary found (404), default to zeros silently
        setSummary({ ratingAverage: 0, ratingCount: 0 });
      });
    }
  }, [product]);

  

  // Normalize image source (accept both string and object image entries)
  const images = Array.isArray(product?.images) ? product.images : [];
  const getSrc = (img) => {
    if (!img) return "/placeholder.svg";
    let src = null;
    if (typeof img === 'string') src = img;
    else src = img?.imageUrl || img?.url || img?.image_url || img?.path || img?.filename || null;
    if (!src) return "/placeholder.svg";
    const hasProtocol = /^https?:\/\//i.test(src);
    if (hasProtocol) return src;
    try {
      const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
      if (src.startsWith("/uploads") || src.startsWith("uploads/")) {
        const path = src.startsWith("/") ? src : `/${src}`;
        return apiOrigin ? `${apiOrigin}${path}` : path;
      }
    } catch (e) {
      // ignore and return src as-is
    }
    return src;
  };

  const primaryIndex = images.findIndex((i) => i?.isPrimary === true);
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  useEffect(() => {
    const idx = Array.isArray(product?.images) ? images.findIndex((i) => i?.isPrimary === true) : -1;
    setSelectedIndex(idx >= 0 ? idx : 0);
  }, [product]);
  const mainImage = getSrc(images[selectedIndex]);

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );

  if (!product) return null;

  const conditionKeyMap = {
    new: 'condition_new',
    like_new: 'condition_like_new',
    good: 'condition_good',
    fair: 'condition_fair',
    poor: 'condition_poor',
  };

  return (
    <Container sx={{ mt: 5, direction: "rtl" }}>
      <Card sx={{ p: 2, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={mainImage}
              alt={product.title}
              sx={{
                width: "100%",
                height: 350,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            {images && images.length > 1 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                {images.map((img, idx) => {
                  const src = getSrc(img);
                  const selected = idx === selectedIndex;
                  return (
                    <Box key={idx} sx={{ border: selected ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 1, cursor: 'pointer' }} onClick={() => setSelectedIndex(idx)}>
                      <img src={src} alt={`${product.title} ${idx + 1}`} style={{ width: 92, height: 64, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {product.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {product.price?.toLocaleString()} {t('currency_iqd')}
                  </Typography>
                  <Rating
                    value={Number(Math.round(userRating || summary.ratingAverage || 0))}
                    precision={1}
                    size="small"
                    onChange={(_, newValue) => {
                      if (!newValue) return;
                      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                      if (!token) { navigate('/login'); return; }
                      setPendingRating(Math.round(newValue));
                      setRateError("");
                      setRateOpen(true);
                    }}
                  />
                  {Boolean(summary.ratingCount) && (
                    <Typography variant="body2" color="text.secondary">({summary.ratingCount})</Typography>
                  )}
                </Box>
                {product.productId && <FavoriteToggle productId={product.productId} />}
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {product.description || t('no_description')}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('category')}: {product.category?.nameAr || product.category?.name || t('unknown')}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('province')}: {product.province?.nameAr || product.province?.name || t('unknown')}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('condition')}: {t(conditionKeyMap[product.condition] || '') || t('unknown')}
              </Typography>

              <Box sx={{ mt: 3, p: 2, borderTop: "1px solid #ccc" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('seller_info')}:
                </Typography>
                <Typography>{t('seller_name')}: {product.seller?.fullName}</Typography>
                <Typography>{t('seller_phone')}: {product.seller?.phoneNumber}</Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={async () => {
                    try {
                      const sellerId = product?.sellerId || product?.userId || product?.ownerId || product?.seller?.id || product?.user?.id;
                      if (!sellerId) { navigate('/chats'); return; }
                      const res = await createOrGetChat({ sellerId, productId: product?.productId || product?.id });
                      const payload = res?.data ?? res;
                      const chat = payload?.data ?? payload ?? {};
                      const chatId = chat?.id || chat?.chatId || payload?.id || payload?.chatId;
                      if (chatId) navigate(`/chats?chatId=${chatId}`); else navigate('/chats');
                    } catch (_) {
                      navigate('/chats');
                    }
                  }}
                >
                  {t('contact_seller')}
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>

      <Dialog open={rateOpen} onClose={() => setRateOpen(false)}>
        <DialogTitle>{t('rate_seller') || 'قيّم البائع'}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2">{t('your_rating') || 'تقييمك'}:</Typography>
            <Rating value={pendingRating} precision={1} onChange={(_, v) => setPendingRating(Math.round(v || 0))} />
          </Box>
          <TextField
            fullWidth
            label={t('transaction_id') || 'رقم العملية'}
            value={rateTxnId}
            onChange={(e) => setRateTxnId(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display:'block', mb: 1 }}>
            {t('hint_transaction_id') || 'أدخل رقم العملية المكتملة بينك وبين هذا البائع.'} {t('seller_id') || 'معرّف البائع'}: {String(getSellerUserId(product) || '')}
          </Typography>
          <TextField
            fullWidth
            label={t('comment_optional') || 'تعليق (اختياري)'}
            value={rateComment}
            onChange={(e) => setRateComment(e.target.value)}
            multiline
            minRows={2}
          />
          {rateError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>{rateError}</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRateOpen(false)}>{t('cancel') || 'إلغاء'}</Button>
          <Button variant="contained" onClick={async () => {
            try {
              const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
              if (!token) { navigate('/login'); return; }
              const sellerId = getSellerUserId(product);
              if (!sellerId) { setRateError(t('unknown_seller') || 'لا يوجد بائع'); return; }
              if (!rateTxnId || Number(rateTxnId) <= 0) { setRateError(t('enter_valid_transaction') || 'أدخل رقم عملية صالح'); return; }
              if (!pendingRating || pendingRating < 1 || pendingRating > 5) { setRateError(t('enter_valid_rating') || 'أدخل تقييم بين 1 و 5'); return; }
              const body = {
                transactionId: Number(rateTxnId),
                reviewedUserId: Number(sellerId),
                rating: Number(pendingRating),
                comment: rateComment || undefined,
              };
              await axiosInstance.post('/reviews', body, { headers: { Authorization: `Bearer ${token}` } });
              setUserRating(pendingRating);
              // refresh summary
              const sum = await axiosInstance.get(`/reviews/user/${sellerId}/summary`);
              const s = sum?.data || {};
              setSummary({ ratingAverage: Number(s.ratingAverage || pendingRating || 0), ratingCount: Number(s.ratingCount || (summary.ratingCount + 1) || 1) });
              setRateOpen(false);
              setRateComment("");
              setRateTxnId("");
              setRateError("");
            } catch (e) {
              const status = e?.response?.status;
              const raw = e?.response?.data;
              const msg = (typeof raw?.message === 'string' ? raw.message : Array.isArray(raw?.message) ? raw.message.join(' | ') : (raw?.error || e?.message));
              if (status === 404) setRateError(t('transaction_not_found') || 'لم يتم العثور على العملية');
              else if (status === 400) setRateError(typeof msg === 'string' ? msg : (t('bad_request') || 'طلب غير صالح'));
              else setRateError(t('unknown_error') || 'حدث خطأ غير متوقع');
            }
          }}>
            {t('submit') || 'إرسال'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

