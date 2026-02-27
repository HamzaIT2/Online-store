import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Grid, Paper, CircularProgress, InputAdornment } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

export default function EditProduct() {
  const { id } = useParams(); // جلب رقم المنتج من الرابط
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    oldPrice: "", // ✅ هنا مسموح
    condition: "",
    categoryId: ""
  });

  // 1. جلب بيانات المنتج الحالية
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        const p = response.data;
        
        setFormData({
            title: p.title,
            description: p.description,
            price: p.price,
            oldPrice: p.oldPrice || "", // إذا كان فارغاً نجعله نصاً فارغاً
            condition: p.condition || "new",
            categoryId: p.categoryId
        });
      } catch (error) {
        console.error("Error loading product:", error);
        alert("لم يتم العثور على المنتج");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. تحديث المنتج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
        // نرسل البيانات كـ JSON لأننا لا نرفع صوراً جديدة هنا (يمكنك إضافتها لاحقاً)
        await axiosInstance.patch(`/products/${id}`, {
            title: formData.title,
            description: formData.description,
            price: Number(formData.price),
            oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null, // ✅ إرسال السعر القديم
            condition: formData.condition,
            categoryId: Number(formData.categoryId)
        });

      navigate(`/products/${id}`); // العودة لصفحة المنتج
    } catch (error) {
      console.error("Error updating product:", error);
      alert("فشل التحديث");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <Container sx={{textAlign:'center', mt: 10}}><CircularProgress /></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
          {t("edit_product") || "تعديل المنتج وعمل خصم"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t("product_title")}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            {/* السعر الحالي (الجديد بعد الخصم) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("current_price") || "السعر الحالي (الجديد)"}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{ endAdornment: <InputAdornment position="start">IQD</InputAdornment> }}
                color="success"
                focused
              />
            </Grid>

            {/* ✅ السعر القديم (لعمل العرض) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t("old_price") || "السعر السابق (قبل الخصم)"}
                name="oldPrice"
                type="number"
                value={formData.oldPrice}
                onChange={handleChange}
                helperText="ضع السعر السابق هنا ليظهر المنتج كـ (عرض خاص)"
                color="warning"
                InputProps={{ endAdornment: <InputAdornment position="start">IQD</InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t("description")}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={{ py: 1.5 }}
              >
                {submitting ? <CircularProgress size={24} /> : (t("save_changes") || "حفظ التعديلات والعرض")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}