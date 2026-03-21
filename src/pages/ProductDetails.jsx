import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  Grid,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Divider,
  Paper
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteToggle from "../components/FavoriteToggle";
import { CartIcon } from "../components/CartIcon";
import axiosInstance from "../api/axiosInstance";
import { createOrGetChat } from "../api/messagesAPI";
import { t } from "../i18n";
import { useTheme } from "../context/ThemeContext";
import ProductPaymentDialog from "../components/ProductPaymentDialog";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Data States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [summary, setSummary] = useState({ ratingAverage: 0, ratingCount: 0 });

  // UI States for Selection
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const sizes = [38, 39, 40, 41, 42]; // Example sizes (simulating the 'ml' options)

  // Rating Modal States
  const [rateOpen, setRateOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [rateTxnId, setRateTxnId] = useState("");
  const [rateError, setRateError] = useState("");

  // Payment Dialog State
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const getSellerUserId = (p) => {
    if (!p) return undefined;
    return (
      p?.seller?.userId || p?.seller?.id || p?.user?.userId || p?.user?.id || p?.sellerId || p?.userId || p?.ownerId
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const productData = res;
        setProduct(productData);

        // Save product to localStorage for payment processing
        localStorage.setItem('lastViewedProduct', JSON.stringify({
          productId: productData.productId,
          price: productData.price,
          title: productData.title,
          sellerId: productData.sellerId || productData.userId || productData.seller?.id || productData.seller?.userId
        }));
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
      }).catch(() => {
        setSummary({ ratingAverage: 0, ratingCount: 0 });
      });
    }
  }, [product]);

  // Image Logic
  const images = Array.isArray(product?.images) ? product.images : [];
  const getSrc = (img) => {
    if (!img) return "/placeholder.svg";
    let src = typeof img === 'string' ? img : (img?.imageUrl || img?.url || img?.path || null);
    if (!src) return "/placeholder.svg";
    if (/^https?:\/\//i.test(src)) return src;
    try {
      const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
      const path = src.startsWith("/") ? src : `/${src}`;
      return `${apiOrigin}${path}`;
    } catch { return src; }
  };

  const primaryIndex = images.findIndex((i) => i?.isPrimary === true);
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const mainImage = getSrc(images[selectedIndex]);

  // Handlers
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Image Navigation
  const handleNextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };
  const handlePrevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Add to cart handler
  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.productId === (product.productId || product.id));

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId: product.productId || product.id,
          title: product.title,
          price: product.price,
          images: images.length > 0 ? images : [{ imageUrl: mainImage }],
          quantity: quantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart:updated'));
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) return <Container sx={{ textAlign: "center", mt: 6 }}><CircularProgress /></Container>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
  if (!product) return null;

  return (
    // <Box sx={{
    //   width: '100%',
    //   bgcolor: darkMode ? '#0d1b2a' : '#F9FAFB',
    //   py: 8,
    //   display: 'flex',
    //   alignItems: 'center',
    //   minHeight: '100vh'
    // }}>
    <Container sx={{
      mt: 10,
      width: '100%',
    }}>
      <Paper
        elevation={10}
        sx={{
          borderRadius: '28px',
          overflow: 'hidden',
          bgcolor: darkMode ? '#1a2f4a' : '#fff',
          boxShadow: darkMode ? '20px 20px 40px rgba(0,0,0,0.3)' : '20px 20px 40px rgba(0,0,0,0.05)',
          p: 10
        }}
      >
        <Grid container spacing={4}>
          {/* Left Side: Image */}
          <Grid
            item
            xs={12}
            md={6}

          >
            <Box
              sx={{
                height: { xs: 350, md: 350 },
                borderRadius: '20px',
                bgcolor: darkMode ? '#0d1b2a' : '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <CardMedia
                component="img"
                image={mainImage}
                alt={product.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Image Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={handlePrevImage}
                    sx={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={handleNextImage}
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </>
              )}

              {/* Thumbnails Overlay */}
              {images.length > 1 && (
                <Box sx={{ position: 'absolute', bottom: 16, display: 'flex', gap: 1 }}>
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      sx={{
                        p: 1,
                        cursor: 'pointer',


                        width: 10, height: 10, borderRadius: '50%',
                        bgcolor: selectedIndex === idx ? '#FFD700' : 'rgba(255,255,255,0.7)',

                        transition: '0.3s'
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Side: Details */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

            {/* Brand / Category */}
            <Typography variant="overline" sx={{
              color: darkMode ? '#aaa' : 'text.secondary',
              letterSpacing: 1,
              fontSize: '0.9rem'
            }}>
              {t('elctronic')}

            </Typography>

            {/* Title */}
            <Typography variant="h5" fontWeight="700" sx={{
              mb: 1,
              color: darkMode ? '#fff' : '#111',
              lineHeight: 1.3
            }}>
              {product.title}
            </Typography>

            {/* Rating */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => {
              const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
              if (!token) { navigate('/login'); return; }
              setRateOpen(true);
            }}>
              <Rating
                value={Number(summary.ratingAverage)}
                precision={0.5}
                readOnly
                size="small"
                sx={{ color: '#FFD700' }}
              />
              <Typography variant="caption" color="text.secondary" fontWeight="500">
                {summary.ratingAverage.toFixed(1)} ({summary.ratingCount})
              </Typography>
            </Stack>

            {/* Price */}
            <Typography variant="h6" fontWeight="bold" sx={{
              mb: 2,
              color: darkMode ? '#fff' : '#111'
            }}>
              {product.price?.toLocaleString()} <Typography component="span" variant="body1" color={darkMode ? '#aaa' : 'text.secondary'}>{t('currency_iqd')}</Typography>
            </Typography>

            {/* Description */}
            <Typography variant="body2" color={darkMode ? '#ccc' : 'text.secondary'} paragraph sx={{ mb: 2, lineHeight: 1.6, fontSize: '0.95rem' }}>
              {product.description || t('no_description')}
            </Typography>

            <Divider sx={{ mb: 2, borderColor: darkMode ? '#34495e' : '#f0f0f0' }} />

            {/* Options Row: Qty Only */}
            <Box sx={{ mb: 3 }}>
              {/* Quantity Stepper */}
              <Box>
                <Typography variant="caption" sx={{
                  color: darkMode ? '#aaa' : '#888',
                  mb: 0.5,
                  display: 'block',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}>
                  {t('quantity') || 'QTY'}
                </Typography>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: darkMode ? '#34495e' : '#F9FAFB',
                  borderRadius: '16px',
                  px: 0.5,
                  border: `1px solid ${darkMode ? '#455a73' : '#E5E7EB'}`,
                  width: 'fit-content'
                }}>
                  <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} sx={{ p: 0.5 }}>
                    <RemoveIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                  <Typography sx={{ mx: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>{quantity}</Typography>
                  <IconButton size="small" onClick={() => handleQuantityChange(1)} sx={{ p: 0.5 }}>
                    <AddIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* Favorite Button (Styled as grey circle) */}
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: darkMode ? '#34495e' : '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.2s',
                flexShrink: 0,
                '&:hover': { bgcolor: darkMode ? '#455a73' : '#E5E7EB' }
              }}>
                <FavoriteToggle productId={product.productId || product.id} />
              </Box>

              {/* Main Action Button  */}
              <Button
                fullWidth
                variant="contained"
                onClick={async () => {
                  try {
                    const sellerId = getSellerUserId(product);
                    if (!sellerId) { navigate('/chats'); return; }
                    const res = await createOrGetChat({ sellerId, productId: product?.productId || product?.id });
                    const payload = res?.data ?? res;
                    const chat = payload?.data ?? payload ?? {};
                    const chatId = chat?.id || chat?.chatId;
                    if (chatId) navigate(`/chats?chatId=${chatId}`); else navigate('/chats');
                  } catch (_) { navigate('/chats'); }
                }}
                sx={{
                  bgcolor: darkMode ? '#34495e' : '#FFD700',
                  color: darkMode ? '#fff' : '#000',
                  fontWeight: 'bold',
                  borderRadius: '24px',
                  height: 48,
                  fontSize: '1rem',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: darkMode ? '#455a73' : '#FFC400', boxShadow: 'none' }
                }}
              >
                {t('contact_seller')}
              </Button>

              {/* Cart Button */}
              <Box
                onClick={handleAddToCart}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: darkMode ? '#34495e' : '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  transition: '0.1s',
                  cursor: 'pointer',
                  flexShrink: 0,
                  '&:hover': { bgcolor: darkMode ? '#455a73' : '#FFC400' }
                }}
              >
                <CartIcon />
              </Box>

              {/* Buy Now Button */}
              <Button
                variant="contained"
                onClick={() => setPaymentDialogOpen(true)}
                sx={{
                  bgcolor: '#FF6B35',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderRadius: '24px',
                  height: 48,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  '&:hover': {
                    bgcolor: '#E55A2B',
                    boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)'
                  }
                }}
              >
                {t('buy_now') || 'شراء الآن'}
              </Button>
            </Stack>

          </Grid>
        </Grid>
      </Paper>

      {/* Rating Dialog (Hidden Logic - kept for functionality) */}
      <Dialog
        open={rateOpen}
        onClose={() => setRateOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? '#1a2f4a' : '#fff',
            color: darkMode ? '#fff' : '#000'
          }
        }}
      >
        <DialogTitle sx={{ color: darkMode ? '#fff' : '#000' }}>{t('rate_seller')}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Rating value={pendingRating} onChange={(_, v) => setPendingRating(Math.round(v || 0))} />
          <TextField
            fullWidth
            margin="dense"
            label={t('transaction_id')}
            value={rateTxnId}
            onChange={(e) => setRateTxnId(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
              '& .MuiOutlinedInput-root': {
                borderColor: darkMode ? '#34495e' : '#ccc',
                '& fieldset': { borderColor: darkMode ? '#34495e' : '#ccc' },
                '&:hover fieldset': { borderColor: darkMode ? '#555' : '#aaa' }
              },
              '& .MuiInputBase-input::placeholder': { color: darkMode ? '#888' : '#999', opacity: 1 }
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label={t('comment_optional')}
            multiline
            rows={2}
            value={rateComment}
            onChange={(e) => setRateComment(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
              '& .MuiOutlinedInput-root': {
                borderColor: darkMode ? '#34495e' : '#ccc',
                '& fieldset': { borderColor: darkMode ? '#34495e' : '#ccc' },
                '&:hover fieldset': { borderColor: darkMode ? '#555' : '#aaa' }
              }
            }}
          />
          {rateError && <Typography color="error" variant="caption">{rateError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRateOpen(false)} sx={{ color: darkMode ? '#aaa' : '#666' }}>{t('cancel')}</Button>
          <Button
            variant="contained"
            onClick={async () => {
              /* Same rating logic as before */
              try {
                const token = localStorage.getItem('token');
                const sellerId = getSellerUserId(product);
                if (!token || !sellerId) return;
                await axiosInstance.post('/reviews', {
                  transactionId: Number(rateTxnId), reviewedUserId: Number(sellerId), rating: Number(pendingRating), comment: rateComment
                }, { headers: { Authorization: `Bearer ${token}` } });
                setRateOpen(false);
              } catch (e) { setRateError(t('error')); }
            }}
            sx={{
              bgcolor: darkMode ? '#34495e' : '#FFD700',
              color: darkMode ? '#fff' : '#000',
              '&:hover': { bgcolor: darkMode ? '#455a73' : '#FFC400' }
            }}
          >{t('submit')}</Button>
        </DialogActions>
      </Dialog>

      {/* Product Payment Dialog */}
      <ProductPaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        product={product}
        onPaymentComplete={(success) => {
          setPaymentDialogOpen(false);
          if (success) {
            // Handle successful payment
            navigate('/profile'); // or any other page
          }
        }}
      />

    </Container>
    //</Box>
  );
}