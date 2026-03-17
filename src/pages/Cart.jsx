import { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, Paper, Divider, IconButton } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";
import PaymentModal from "../components/PaymentModal";
import EmptyState from "../components/EmptyState";
import { useNavigate } from "react-router-dom";
import { Visibility, ShoppingCart, Delete } from "@mui/icons-material";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(Array.isArray(data) ? data : []);

      // Check if user is logged in, if not clear cart
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token && !user && data.length > 0) {
        // Clear cart for guest users
        localStorage.removeItem('cart');
        setItems([]);
        console.log('Cart cleared for guest user');
      }
    } catch (_) {
      setItems([]);
    }
  };

  useEffect(() => {
    load();

    // Listen for auth changes
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        if (!e.newValue) {
          // Token or user was removed (logout)
          setItems([]);
          localStorage.removeItem('cart');
          console.log('Cart cleared on logout');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => {
    return total + (Number(item?.price) || 0);
  }, 0);

  // Generate order ID
  const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setPaymentModalOpen(true);
  };

  const handlePaymentComplete = (success) => {
    setPaymentModalOpen(false);

    if (success) {
      // Clear cart after successful payment
      clearAll();
      // Navigate to success page
      navigate(`/payment/zain-cash/success?orderId=${orderId}`);
    }
  };

  const truncateText = (text, maxLines = 4) => {
    if (!text) return '';
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + '...';
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleQuickView = (productId) => {
    navigate(`/products/${productId}`);
  };

  const removeOne = (productId) => {
    try {
      const current = JSON.parse(localStorage.getItem('cart') || '[]');
      const next = current.filter((p) => String(p?.productId) !== String(productId));
      localStorage.setItem('cart', JSON.stringify(next));
      setItems(next);
      // Trigger cart update event
      window.dispatchEvent(new Event('cart:updated'));
    } catch (_) { }
  };

  const clearAll = () => {
    localStorage.removeItem('cart');
    setItems([]);
    // Trigger cart update event
    window.dispatchEvent(new Event('cart:updated'));
  };

  return (
    <Container sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t('cart') || 'سلة المشتريات'}</Typography>
        {items.length > 0 && (
          <Button color="error" variant="outlined" onClick={clearAll}>{t('clear') || 'تفريغ السلة'}</Button>
        )}
      </Box>

      {items.length === 0 ? (
        <EmptyState
          type="cart"
          title={t('cart_empty') || 'سلتك فارغة'}
          description="أضف بعض المنتجات الرائعة إلى سلتك وابدأ رحلة التسوق"
          actionText="تسوق الآن"
          actionLink="/"
        />
      ) : (
        <>
          {/* Cart Items */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {items.map((p) => {
              const img = (p?.images?.find((i) => i?.isPrimary) || p?.images?.[0]) || {};
              // try common keys
              let src = img.imageUrl || img.url || img.image_url || '/placeholder.svg';
              try {
                const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
                const hasProtocol = /^https?:\/\//i.test(src);
                if (!hasProtocol && (src.startsWith('/uploads') || src.startsWith('uploads/'))) {
                  const path = src.startsWith('/') ? src : `/${src}`;
                  src = apiOrigin ? `${apiOrigin}${path}` : path;
                }
              } catch (e) {
                // ignore and use src as-is
              }
              return (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={p.productId}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia component="img" height="160" image={src} alt={p?.title || 'Product'} />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>{p?.title}</Typography>

                      {/* Description limited to 4 lines */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 400,
                          mb: 2,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.4,
                          minHeight: '4.8em' // Ensure space for 4 lines
                        }}
                      >
                        {p?.description || 'لا يوجد وصف'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {Number(p?.price)?.toLocaleString()} {t('currency_iqd')}
                      </Typography>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', alignItems: 'center' }}>
                        {/* زر عرض التفاصيل */}
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(p?.productId)}
                          size="small"
                          sx={{
                            flex: 1,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark',
                              bgcolor: 'primary.main',
                              color: 'white'
                            }
                          }}
                        >
                          {t('view_details') || 'عرض التفاصيل'}
                        </Button>

                        {/* زر الشراء السريع */}
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={() => handleQuickView(p?.productId)}
                          size="small"
                          sx={{
                            flex: 1,
                            bgcolor: '#FF6B35',
                            '&:hover': { bgcolor: '#E55A2B' }
                          }}
                        >
                          {t('buy_now') || 'شراء الآن'}
                        </Button>

                        {/* أيقونة الحذف الصغيرة */}
                        <IconButton
                          size="small"
                          onClick={() => removeOne(p?.productId)}
                          sx={{
                            bgcolor: 'error.light',
                            color: 'error.main',
                            '&:hover': {
                              bgcolor: 'error.main',
                              color: 'white'
                            },
                            width: 36,
                            height: 36
                          }}
                          title={t('remove') || 'إزالة'}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Checkout Section */}
          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              ملخص الطلب
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">عدد المنتجات:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {items.length} منتج
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">المبلغ الإجمالي:</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {totalAmount.toLocaleString()} {t('currency_iqd')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                fullWidth
              >
                متابعة التسوق
              </Button>
              <Button
                variant="contained"
                onClick={handleCheckout}
                fullWidth
                disabled={items.length === 0}
                sx={{
                  bgcolor: '#FF6B35',
                  '&:hover': { bgcolor: '#E55A2B' }
                }}
              >
                إتمام الدفع
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={orderId}
        amount={totalAmount}
        onPaymentComplete={handlePaymentComplete}
      />
    </Container>
  );
}

