import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, CircularProgress, Card, CardMedia, CardContent, Button, Grid } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import FavoriteToggle from "../components/FavoriteToggle";
import { t } from "../i18n";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(t('error_loading_product'));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );

  if (!product) return null;

  const mainImage =
    product?.images?.find((img) => img.isPrimary)?.imageUrl ||
    product?.images?.[0]?.imageUrl ||
    "/placeholder.svg";

  const conditionKeyMap = {
    new: 'condition_new',
    like_new: 'condition_like_new',
    good: 'condition_good',
    fair: 'condition_fair',
    poor: 'condition_poor',
  };

  return (
    <Container sx={{ mt: 5, direction: "rtl" }}>
      <Card sx={{ p: 2, boxShadow: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <CardMedia
              component="img"
              image={mainImage}
              alt={product.title}
              sx={{
                width: "100%",
                height: 350,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
          </Grid>

          <Grid item xs={12} md={7}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                {product.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {product.price?.toLocaleString()} {t('currency_iqd')}
                </Typography>
                {product.productId && <FavoriteToggle productId={product.productId} />}
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {product.description || t('no_description')}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('category')}: {product.category?.nameAr || product.category?.name || t('unknown')}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {t('province')}: {product.province?.nameAr || product.province?.name || t('unknown')}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('condition')}: {t(conditionKeyMap[product.condition] || '') || t('unknown')}
              </Typography>

              <Box sx={{ mt: 3, p: 2, borderTop: "1px solid #ccc" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {t('seller_info')}:
                </Typography>
                <Typography>{t('seller_name')}: {product.seller?.fullName}</Typography>
                <Typography>{t('seller_phone')}: {product.seller?.phoneNumber}</Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button variant="contained" color="error">
                  {t('contact_seller')}
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

