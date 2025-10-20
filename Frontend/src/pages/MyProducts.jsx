import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Grid } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { t } from "../i18n";

export default function MyProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axiosInstance.get('/users/profile');
        const userId = me.data?.userId;
        if (!userId) throw new Error('no-user');
        const res = await axiosInstance.get(`/products/user/${userId}`);
        setItems(res.data?.products || []);
      } catch (e) {
        setError("");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <Container sx={{ textAlign: 'center', mt: 6 }}><CircularProgress /></Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Typography color="error" align="center">{error}</Typography>
    </Container>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'right' }}>{t('my_products')}</Typography>
      <Grid container spacing={3}>
        {items.map((p) => (
          <Grid item xs={12} sm={6} md={4} key={p.productId}>
            <ProductCard product={p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

