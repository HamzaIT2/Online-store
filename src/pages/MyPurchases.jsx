import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Button, Card, CardContent, Grid, Chip } from "@mui/material";
import { getMyOrders } from "../api/ordersAPI";
import { t } from "../i18n";

export default function MyPurchases() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getMyOrders();
        setOrders(response || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setError('Failed to load your orders. Please try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown';
  };

  const handleStartShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
          My Purchases
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
          My Purchases
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 8, minHeight: '70vh' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 700 }}>
        My Purchases
      </Typography>

      {!orders || orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
            You haven't bought anything yet!
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
            Start exploring our amazing products and make your first purchase.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartShopping}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4
            }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id || order._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Product Image */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      backgroundColor: 'grey.100',
                      borderRadius: 2,
                      mb: 2,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {order.productImage ? (
                      <img
                        src={order.productImage}
                        alt={order.productName || 'Product'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <Box sx={{ color: 'grey.400', textAlign: 'center' }}>
                        <Typography variant="body2">No Image</Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Product Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      minHeight: '2.6rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {order.productName || 'Unknown Product'}
                  </Typography>

                  {/* Order Date */}
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      color: 'text.secondary'
                    }}
                  >
                    {order.orderDate ? formatDate(order.orderDate) : 'Date not available'}
                  </Typography>

                  {/* Total Price */}
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: 'primary.main'
                    }}
                  >
                    ${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                  </Typography>

                  {/* Status Badge */}
                  <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem'
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
