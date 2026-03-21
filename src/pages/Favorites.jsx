import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, CircularProgress, Divider, Box, Button } from "@mui/material";
import axiosInstance from '../api/axiosInstance';
import { getMyFavorites } from "../api/favoritesAPI";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import EmptyState from "../components/EmptyState";
import { t } from "../i18n";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [myAds, setMyAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      if (!token) {
        setItems([]);
        setLoading(false);
        setError(t('please_login_to_view_favorites') || 'Please login to view favorites');
        return;
      }
      try {
        const res = await getMyFavorites();
        // Handle paginated response: { data: productsArray, total: number }
        const data = res?.data || [];
        let products = [];
        if (Array.isArray(data)) {
          products = data.map((f) => f.product || f).filter(Boolean);
        } else if (Array.isArray(res)) {
          // Fallback for direct array response
          products = res.map((f) => f.product || f).filter(Boolean);
        }
        setItems(products);
        // load my ads
        // My Ads handled in separate /my-products page
      } catch (e) {
        console.error('Failed to load favorites:', e);
        setError(t('error_loading_favorites') || 'Failed to load favorites');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    // load my ads too
    // My Ads handled in separate /my-products page
    const onUpdated = () => { load(); };
    window.addEventListener('favorites:updated', onUpdated);
    return () => { window.removeEventListener('favorites:updated', onUpdated); };
  }, []);

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product.id || product._id}`);
  };

  const handleDeleteClick = (product) => {
    setToDelete(product);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setConfirmOpen(false);
    setDeleting(true);
    try {
      const id = toDelete.id || toDelete._id || toDelete.productId;
      await axiosInstance.delete(`/products/${id}`);
      // refresh my ads
      setMyAds((prev) => prev.filter(p => (p.id || p._id) !== id));
      window.dispatchEvent(new CustomEvent('product:deleted', { detail: { id } }));
    } catch (e) {
      console.error('delete error', e);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const handleDeleteCancel = () => { setConfirmOpen(false); setToDelete(null); };

  if (loading) return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'right' }}>{t('favorites')}</Typography>
      <ProductSkeleton count={8} />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Typography color="error" align="center">{error}</Typography>
    </Container>
  );

  return (
    <Container sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, textAlign: 'right' }}>{t('favorites')}</Typography>

      {loading ? (
        <ProductSkeleton count={8} />
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </Button>
        </Box>
      ) : !items || items.length === 0 ? (
        <EmptyState
          type="favorites"
          title={t('favorites_empty') || 'لا توجد عناصر مفضلة'}
          description="ابدأ بإضافة المنتجات التي تعجبك إلى المفضلة لتسهيل الوصول إليها لاحقاً"
          actionText="تسوق الآن"
          actionLink="/"
        />
      ) : (
        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {items.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.productId}>
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

