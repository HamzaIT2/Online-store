import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Card, CardActionArea, Typography, Button, Box, CircularProgress, Chip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axiosInstance from '../api/axiosInstance'; // تأكد من مسار الـ axios

export default function PromoteModal({ open, onClose, productId }) {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. جلب الباقات عند فتح النافذة
  useEffect(() => {
    if (open) {
      setFetching(true);
      axiosInstance.get('/products/plans/all')
        .then(res => {
          setPlans(res);
          setFetching(false);
        })
        .catch(err => {
          console.error("فشل جلب الباقات", err);
          setFetching(false);
        });
    }
  }, [open]);

  // 2. دالة إرسال الترويج
  const handlePromote = async () => {
    if (!selectedPlanId) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/products/promote/${productId}`, {
        planId: selectedPlanId
      });

      // رسالة نجاح
      alert('تم تفعيل الإعلان المميز بنجاح! سيظهر الآن في الصفحة الرئيسية 🚀');
      onClose();
      window.location.reload(); // تحديث الصفحة لرؤية النتائج
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء العملية، حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" dir="rtl">
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <AutoAwesomeIcon color="warning" />
        ميز إعلانك وضاعف المشاهدات
      </DialogTitle>

      <DialogContent dividers>
        <Typography align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          اختر الباقة المناسبة ليظهر منتجك في أعلى الصفحة الرئيسية (Hero Section)
        </Typography>

        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {plans.map((plan) => (
              <Grid item xs={12} sm={4} key={plan.id}>
                <Card
                  elevation={selectedPlanId === plan.id ? 8 : 1}
                  sx={{
                    border: selectedPlanId === plan.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                    transform: selectedPlanId === plan.id ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'visible'
                  }}
                >
                  {/* شارة تم الاختيار */}
                  {selectedPlanId === plan.id && (
                    <Chip
                      label="تم الاختيار"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}
                    />
                  )}

                  <CardActionArea
                    onClick={() => setSelectedPlanId(plan.id)}
                    sx={{ p: 2, textAlign: 'center', height: '100%' }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {plan.name}
                    </Typography>

                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {Number(plan.price).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">د.ع</Typography>

                    <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        لمدة {plan.days} أيام
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button onClick={onClose} color="inherit" sx={{ mx: 1 }}>
          إلغاء
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={!selectedPlanId || loading}
          onClick={handlePromote}
          sx={{ px: 4, borderRadius: 20 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'دفع وتفعيل العرض'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}