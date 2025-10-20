import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteToggle from "./FavoriteToggle";
import { t } from "../i18n";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleDetails = () => {
    if (product?.productId) navigate(`/products/${product.productId}`);
  };

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

  const provinceName = product?.province?.nameAr || product?.province?.name || "";
  const conditionLabel = t(conditionKeyMap[product?.condition] || '');

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.03)" },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia component="img" height="200" image={mainImage} alt={product?.title || 'Product'} />

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {product?.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {provinceName} {provinceName && conditionLabel ? "-" : ""} {conditionLabel}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {product?.price?.toLocaleString()} {t('currency_iqd')}
          </Typography>
          {product?.productId && <FavoriteToggle productId={product.productId} size="small" />}
        </Box>
      </CardContent>

      <Box sx={{ textAlign: "center", pb: 2 }}>
        <Button variant="contained" color="error" onClick={handleDetails}>
          {t('view_details')}
        </Button>
      </Box>
    </Card>
  );
}

