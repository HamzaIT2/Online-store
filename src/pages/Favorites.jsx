import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, CircularProgress, Divider, Box } from "@mui/material";
import { Card, CardContent, CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../api/axiosInstance';
import { getMyFavorites } from "../api/favoritesAPI";
import ProductCard from "../components/ProductCard";
import { t } from "../i18n";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const [loadingMyAds, setLoadingMyAds] = useState(false);
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
        const data = res && (res.data ?? res) ? (res.data ?? res) : [];
        let products = [];
        if (Array.isArray(data)) {
          products = data.map((f) => f.product || f).filter(Boolean);
        } else if (Array.isArray(data.items)) {
          products = data.items.map((f) => f.product || f).filter(Boolean);
        } else if (Array.isArray(data.data)) {
          products = data.data.map((f) => f.product || f).filter(Boolean);
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
    <Container sx={{ textAlign: 'center', mt: 6 }}><CircularProgress /></Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Typography color="error" align="center">{error}</Typography>
    </Container>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'right' }}>{t('my_ads') || 'My Ads'}</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProduct}>{t('add_product') || 'أضف إعلان'}</Button>
        </Box>
        {loadingMyAds ? (
          <CircularProgress size={20} />
        ) : (!myAds || !myAds.length) ? (
          <Typography color="text.secondary">{t('no_my_ads') || 'لا توجد إعلانات'}</Typography>
        ) : (
          <Grid container spacing={3}>
            {myAds.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={(p.id || p._id || p.productId)}>
                <Card>
                  <CardContent>
                    <ProductCard product={p} />
                  </CardContent>
                  <CardActions>
                    <IconButton aria-label="edit" onClick={() => handleEdit(p)}><EditIcon /></IconButton>
                    <IconButton aria-label="delete" onClick={() => handleDeleteClick(p)}><DeleteIcon /></IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'right' }}>{t('favorites') || 'المفضلات'}</Typography>
        {(!items || !items.length) ? (
          <Typography align="center">{t('favorites_empty') || 'لا توجد عناصر مفضلة'}</Typography>
        ) : (
          <Grid container spacing={3}>
            {items.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p.productId}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

