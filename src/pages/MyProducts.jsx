import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Grid, Card, CardContent, CardActions, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import { t } from "../i18n";
import { useNavigate } from 'react-router-dom';

export default function MyProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axiosInstance.get('/users/profile');
        const userId = me.data?.userId;
        if (!userId) throw new Error('no-user');
        const res = await axiosInstance.get(`/products/user/${userId}`);
        console.log('MyProducts API response:', res);
        // Accept multiple shapes
        const data = res.data || {};
        const list = Array.isArray(data) ? data : (data.products || data.items || data.data || []);
        setItems(list);
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
          <Grid item xs={12} sm={6} md={4} key={p.productId || p.id || p._id}>
            <Card>
              <CardContent>
                <ProductCard product={p} />
              </CardContent>
              <CardActions>
                <IconButton aria-label="edit" onClick={() => navigate(`/edit-product/${p.productId || p.id || p._id}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => { setToDelete(p); setConfirmOpen(true); }}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t('confirm_delete') || 'Confirm delete'}</DialogTitle>
        <DialogContent>
          <Typography>{t('confirm_delete_text') || 'Are you sure you want to delete this product?'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>{t('cancel') || 'Cancel'}</Button>
          <Button color="error" onClick={async () => {
            if (!toDelete) return;
            setDeleting(true);
            try {
              const id = toDelete.productId || toDelete.id || toDelete._id;
              await axiosInstance.delete(`/products/${id}`);
              setItems((prev) => prev.filter(item => (item.productId || item.id || item._id) !== id));
              setToDelete(null);
              setConfirmOpen(false);
            } catch (e) {
              console.error('Delete product failed', e);
            } finally {
              setDeleting(false);
            }
          }}>{t('delete') || 'Delete'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

