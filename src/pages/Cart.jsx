import { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

export default function Cart() {
  const [items, setItems] = useState([]);

  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem('cart') || '[]');
      setItems(Array.isArray(data) ? data : []);
    } catch (_) {
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);

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
    <Container sx={{ mt: 4, direction: 'rtl' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t('cart') || 'سلة المشتريات'}</Typography>
        {items.length > 0 && (
          <Button color="error" variant="outlined" onClick={clearAll}>{t('clear') || 'تفريغ السلة'}</Button>
        )}
      </Box>

      {items.length === 0 ? (
        <Typography color="text.secondary">{t('cart_empty') || 'لم يتم إضافة منتجات إلى السلة بعد.'}</Typography>
      ) : (
        <Grid container spacing={2}>
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
                <Card>
                  <CardMedia component="img" height="160" image={src} alt={p?.title || 'Product'} />
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{p?.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {Number(p?.price)?.toLocaleString()} {t('currency_iqd')}
                    </Typography>
                    <Button color="error" variant="outlined" onClick={() => removeOne(p?.productId)}>
                      {t('remove') || 'إزالة'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

