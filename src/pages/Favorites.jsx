import { useEffect, useState } from "react";
import { Container, Typography, Grid, CircularProgress } from "@mui/material";
import { getMyFavorites } from "../api/favoritesAPI";
import ProductCard from "../components/ProductCard";
import { t } from "../i18n";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyFavorites();
        const data = res.data || [];
        const products = Array.isArray(data)
          ? data.map((f) => f.product || f).filter(Boolean)
          : [];
        setItems(products);
      } catch (e) {
        setError('');
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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'right' }}>{t('favorites')}</Typography>
      {(!items || !items.length) ? (
        <Typography align="center">{t('favorites_empty')}</Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.productId}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

