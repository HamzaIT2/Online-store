import { useEffect, useState } from "react";
import {
  Container, Typography, CircularProgress, Grid, Card, CardContent,
  CardActions, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Tooltip, Box
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CampaignIcon from '@mui/icons-material/Campaign'; // 👈 استيراد الأيقونة
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import EmptyState from "../components/EmptyState";
import { t } from "../i18n";
import { useNavigate } from 'react-router-dom';
import PromoteModal from "./PromoteModal";
import MakeOfferDialog from "@/components/MakeOfferDialog";

export default function MyProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  // States for Delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // States for Promote (VIP) 👇
  const [promoteItem, setPromoteItem] = useState(null);

  const navigate = useNavigate();


  const handleOpenOffer = (p) => {
    console.log("المنتج المختار:", p); // للتأكد في الكونسول
    setSelectedProduct(p); // ✅ نخزن هذا المنتج تحديداً
    setShowOfferDialog(true);
  }





  useEffect(() => {
    const load = async () => {
      try {
        const me = await axiosInstance.get('/users/profile');
        const userId = me?.userId;
        if (!userId) throw new Error('no-user');
        const res = await axiosInstance.get(`/products/user/${userId}`);
        const data = res || {};
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'right' }}>{t('my_products')}</Typography>
      <ProductSkeleton count={8} />
    </Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        <Button variant="outlined" onClick={() => window.location.reload()}>
          إعادة المحاولة
        </Button>
      </Box>
    </Container>
  );

  return (
    <Container sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, textAlign: 'right' }}>{t('my_products')}</Typography>

      {!items || items.length === 0 ? (
        <EmptyState
          type="products"
          title="لا توجد منتجات لك"
          description="ابدأ بإضافة منتجاتك الأولى واعرضها للآلاف من المشترين المحتملين"
          actionText="إضافة منتج"
          actionLink="/add-product"
        />
      ) : (
        <Grid container spacing={3}>
          {items.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.productId || p.id || p._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <ProductCard product={p} />
                </CardContent>

                {/* 👇 أزرار التحكم بالمنتج */}
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <div>
                    <Tooltip title="تعديل">
                      <IconButton onClick={() => navigate(`/edit-product/${p.productId || p.id || p._id}`)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="حذف">
                      <IconButton onClick={() => { setToDelete(p); setConfirmOpen(true); }}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>

                  {/* 👇 زر الترويج هنا مكانه الصحيح */}
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    startIcon={<CampaignIcon />}
                    onClick={() => setPromoteItem(p)} // تحديد المنتج المراد ترويجه
                    sx={{ borderRadius: 4 }}
                  >
                    VIP ترويج
                  </Button>
                  <Button onClick={() => handleOpenOffer(p)}>
                    إنشاء عرض
                  </Button>

                  <MakeOfferDialog
                    open={showOfferDialog}
                    onClose={() => {
                      setShowOfferDialog(false);
                      setSelectedProduct(null); // 
                    }}
                    product={selectedProduct} // 
                    onSuccess={() => {
                      window.location.reload(); // 
                      alert("!");
                    }}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog: Delete Confirmation */}
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
          }}>
            {deleting ? <CircularProgress size={20} /> : (t('delete') || 'Delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Promote Modal (VIP) */}
      {promoteItem && (
        <PromoteModal
          open={Boolean(promoteItem)}
          onClose={() => setPromoteItem(null)}
          productId={promoteItem.productId || promoteItem.id || promoteItem._id}
        />
      )}

    </Container>
  );
}

