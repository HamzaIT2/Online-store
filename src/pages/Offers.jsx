import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, Chip, Button, Skeleton } from '@mui/material';
import { LocalOffer, ShoppingCart, AccessTime } from '@mui/icons-material';
import { t } from '../i18n';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';

export default function Offers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)

        const response = await axiosInstance.get('/products');



        let allProducts = Array.isArray(response?.data) ? response.data : [];




        const pagination = response.data.pagination || response.data.meta || {};


        if (pagination.totalPages > 1) {
          const allPagesProducts = await Promise.all(
            Array.from({ length: pagination.totalPages }, (_, index) => {
              return axiosInstance.get('/products', {
                params: { page: index + 1 },
              });
            })
          );


          allProducts = allPagesProducts.flatMap((page) => page.data);
        }


        const activeOffers = allProducts.filter((p, index) => {


          const currentPrice = Number(p.price);
          const oldPrice = Number(p.oldPrice);

          const hasDiscount = p.oldPrice && oldPrice > currentPrice;

          const isNotExpired = p.offerExpiresAt
            ? new Date(p.offerExpiresAt) > new Date()
            : true;
          const finalResult = hasDiscount && isNotExpired;


          return finalResult;
        })






        setProducts(activeOffers);
      } catch (err) {
        console.error("Failed to fetch offers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 8 }}>

      {/* البانر العلوي */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          borderRadius: 4,
          p: 4,
          mb: 6,
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)'
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <LocalOffer fontSize="large" /> {t('flash_sale') || "عروض لفترة محدودة"}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {t('flash_sale_description')}
        </Typography>
      </Box>

      {/* شبكة المنتجات */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
              <Skeleton width="60%" sx={{ mt: 1 }} />
            </Grid>
          ))
        ) : products.length > 0 ? (
          products.map((product) => {
            // حساب نسبة الخصم
            const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

            return (
              <Grid item xs={12} sm={6} md={3} key={product.id || product.productId}>
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/products/${product.id || product.productId}`)}
                >
                  {/* شارة نسبة الخصم */}
                  <Chip
                    label={`-${discount}%`}
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold', zIndex: 1 }}
                  />

                  {/* العداد التنازلي فوق الصورة (اختياري) */}
                  {product.offerExpiresAt && (
                    <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                      <CountdownTimer targetDate={product.offerExpiresAt} />
                    </Box>
                  )}

                  <CardMedia
                    component="img"
                    height="220"
                    // معالجة رابط الصورة
                    image={product.images && product.images.length > 0
                      ? (product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:3000${product.images[0].url.startsWith('/') ? '' : '/'}${product.images[0].url}`)
                      : '/placeholder.jpg'}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />

                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {product.title}
                    </Typography>

                    {/* الأسعار */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Typography variant="h6" color="error.main" fontWeight="bold">
                        {Number(product.price).toLocaleString()} د.ع
                      </Typography>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                        {Number(product.oldPrice).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* تنبيه إذا قارب الوقت على الانتهاء */}
                    {product.offerExpiresAt && new Date(product.offerExpiresAt) < new Date(Date.now() + 86400000) && (
                      <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} /> {t('flash_sale_expires_soon')}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, borderRadius: 2 }}
                      startIcon={<ShoppingCart />}
                    >
                      {t('buy_now')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              {t('no_offers')}
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
}
