import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Home,
  Receipt,
  LocalShipping,
  ShoppingBag,
  LocalShipping as Truck,
  Inventory,
  Headphones,
  Timeline,
  Payment,
  Refresh
} from '@mui/icons-material';
import { green, purple, orange, blue } from '@mui/material/colors';
import ZainCashProvider from '../services/zainCashProvider';
import axiosInstance from '../api/axiosInstance';

const PaymentSuccess = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const zainCashProvider = new ZainCashProvider();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('token');
        const orderId = searchParams.get('orderId');

        if (!transactionId) {
          setPaymentStatus({
            success: false,
            error: 'لم يتم العثور على معاملة الدفع'
          });
          setVerifying(false);
          return;
        }

        setOrderId(orderId);

        // Verify payment with Zain Cash
        const verification = await zainCashProvider.verifyPayment(transactionId);

        if (verification.success) {
          setPaymentStatus({
            success: true,
            transactionId: verification.transactionId,
            amount: verification.amount,
            verifiedAt: verification.verifiedAt
          });

          // For demo orders, try to purchase a product directly
          if (orderId === 'demo_order') {
            await purchaseProductDirectly();
          } else {
            // Update order status in backend
            await updateOrderStatus(orderId, {
              status: 'paid',
              paymentStatus: 'completed',
              transactionId: verification.transactionId
            });
          }
        } else {
          setPaymentStatus({
            success: false,
            error: 'فشل التحقق من الدفع'
          });
        }
      } catch (error) {
        setPaymentStatus({
          success: false,
          error: error.message
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const purchaseProductDirectly = async () => {
    // Prevent multiple simultaneous requests
    if (window.isPurchasing) {
      console.log('Purchase already in progress...');
      return;
    }

    try {
      window.isPurchasing = true;

      // Get the last viewed product from localStorage
      const lastViewedProduct = localStorage.getItem('lastViewedProduct');
      if (!lastViewedProduct) {
        console.log('No product found for purchase');
        return;
      }

      const product = JSON.parse(lastViewedProduct);
      console.log('Product data from localStorage:', product);

      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No authentication token found');
        alert('يجب تسجيل الدخول أولاً');
        return;
      }

      // Get current user info to ensure we have the buyer ID
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User info from localStorage:', userInfo);

      const buyerId = userInfo.id ||
        userInfo.userId ||
        userInfo.sub ||
        userInfo._id ||
        localStorage.getItem('userId');

      console.log('Extracted buyerId:', buyerId);
      console.log('Available user fields:', Object.keys(userInfo));

      if (!buyerId) {
        console.error('No buyer ID found in user info');
        alert('بيانات المستخدم غير مكتملة، يرجى تسجيل الدخول مرة أخرى');
        return;
      }

      // Validate product data
      if (!product.productId || !product.price) {
        console.error('Invalid product data:', product);
        alert('بيانات المنتج غير مكتملة');
        return;
      }

      // Convert amount to number
      const amount = parseFloat(product.price.toString());
      if (isNaN(amount) || amount <= 0) {
        console.error('Invalid amount:', product.price);
        alert('سعر المنتج غير صالح');
        return;
      }

      console.log('Purchase attempt:', {
        productId: product.productId,
        amount: amount,
        buyerId: buyerId,
        sellerId: product.sellerId,
        token: token ? 'exists' : 'missing'
      });

      // Check if user is trying to buy their own product
      if (product.sellerId && product.sellerId === buyerId) {
        console.error('Self-purchase attempt detected');
        alert('لا يمكنك شراء منتجك الخاص!');
        return;
      }

      // Create transaction using the new backend endpoint
      const response = await axiosInstance.post('/transactions', {
        productId: product.productId,
        amount: amount,
        buyerId: buyerId // Explicitly send buyerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Product purchased successfully:', response.data);

      // Show success message
      alert('تم شراء المنتج بنجاح! سيتم تحديث حالة المنتج قريباً.');

      // Clear the stored product
      localStorage.removeItem('lastViewedProduct');

    } catch (error) {
      console.error('Failed to purchase product:', error);

      // Extract detailed error message
      let errorMessage = 'فشل في شراء المنتج';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);

        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          `خطأ ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error request:', error.request);
        errorMessage = 'لا يوجد استجابة من السيرفر';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message:', error.message);
        errorMessage = error.message;
      }

      alert(`فشل في شراء المنتج: ${errorMessage}`);
    } finally {
      // Reset purchase flag
      window.isPurchasing = false;
    }
  };

  const updateOrderStatus = async (orderId, statusData) => {
    try {
      // Skip demo orders - they don't exist in backend
      if (orderId === 'demo_order') {
        console.log('Skipping demo order status update');
        return;
      }

      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(statusData)
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewOrder = () => {
    navigate('/profile');
  };

  if (verifying) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <CardContent>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <CircularProgress
                size={80}
                sx={{
                  color: '#fff',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round'
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Payment sx={{ fontSize: 32, color: 'rgba(255, 255, 255, 0.3)' }} />
              </Box>
            </Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mt: 3 }}>
              جاري التحقق من عملية الدفع...
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mt: 1 }}>
              يرجى الانتظار بينما نتحقق من دفعتك
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!paymentStatus?.success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card
          sx={{
            textAlign: 'center',
            py: 6,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            boxShadow: '0 20px 60px rgba(255, 107, 107, 0.3)',
            borderRadius: 4,
            overflow: 'hidden'
          }}
        >
          <CardContent>
            <Avatar sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              width: 100,
              height: 100,
              mx: 'auto',
              mb: 3
            }}>
              <Error sx={{ fontSize: 50, color: '#fff' }} />
            </Avatar>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
              فشلت عملية الدفع
            </Typography>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff'
              }}
            >
              {paymentStatus?.error}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={handleGoHome}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#fff',
                  px: 3,
                  '&:hover': {
                    borderColor: '#fff',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                العودة للرئيسية
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/checkout')}
                sx={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  px: 3,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                إعادة المحاولة
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      {/* Success Header */}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
          boxShadow: '0 20px 60px rgba(76, 175, 80, 0.3)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #81c784, #4caf50, #45a049)',
        }} />
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{
            background: 'rgba(255, 255, 255, 0.2)',
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 3,
            animation: 'pulse 2s infinite'
          }}>
            <CheckCircle sx={{ fontSize: 50, color: '#fff' }} />
          </Avatar>
          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
            تمت عملية الدفع بنجاح! 🎉
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 2 }}>
            شكراً لك على طلبك. تم استلام الدفع بنجاح.
          </Typography>
          <Chip
            label="مؤكدة"
            color="success"
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          />
        </CardContent>
      </Card>

      {/* Payment Details Card */}
      <Card sx={{
        mb: 4,
        background: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Receipt sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              تفاصيل الدفع
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              background: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="body1" color="text.secondary">رقم المعاملة:</Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                {paymentStatus.transactionId}
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              background: alpha(green[500], 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(green[500], 0.1)}`
            }}>
              <Typography variant="body1" color="text.secondary">المبلغ المدفوع:</Typography>
              <Typography variant="h6" fontWeight="bold" color={green[500]}>
                {paymentStatus.amount?.toLocaleString()} IQD
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              background: alpha(blue[500], 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(blue[500], 0.1)}`
            }}>
              <Typography variant="body1" color="text.secondary">وقت الدفع:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {paymentStatus.verifiedAt?.toLocaleString('ar-IQ')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Timeline Steps */}
      <Card sx={{
        mb: 4,
        background: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Timeline sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              مراحل تنفيذ الطلب
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              p: 2,
              background: alpha(green[500], 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(green[500], 0.1)}`
            }}>
              <CheckCircle sx={{ color: green[500], fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: green[500] }}>
                  استلام الطلب
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  تم تجهيز طلبك للشحن
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              p: 2,
              background: alpha(purple[500], 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(purple[500], 0.1)}`
            }}>
              <LocalShipping sx={{ color: purple[500], fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: purple[500] }}>
                  الشحن والتوصيل
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  سيتم توصيل طلبك إلى العنوان المحدد
                </Typography>
              </Box>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              p: 2,
              background: alpha(orange[500], 0.05),
              borderRadius: 2,
              border: `1px solid ${alpha(orange[500], 0.1)}`
            }}>
              <Inventory sx={{ color: orange[500], fontSize: 24 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: orange[500] }}>
                  استلام المنتج
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  استلم طلبك وتأكد من جودته
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card sx={{
        mb: 4,
        background: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 4px 20px rgba(255, 255, 255, 0.1)'
                    : '0 4px 20px rgba(0, 0, 0, 0.2)',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              العودة للرئيسية
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Receipt />}
              onClick={handleViewOrder}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 3,
                fontSize: '1rem',
                background: 'linear-gradient(45deg, #4caf50, #45a049)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)'
                }
              }}
            >
              عرض حسابي
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Contact Support Card */}
      <Card sx={{
        background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Headphones sx={{ color: '#fff', fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold' }}>
              تحتاج مساعدة؟
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
            إذا كان لديك أي استفسارات حول طلبك، فريق الدعم جاهز لمساعدتك
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.5)',
                color: '#fff',
                '&:hover': {
                  borderColor: '#fff',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              تتبع الطلب
            </Button>
            <Button
              variant="contained"
              startIcon={<Headphones />}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)'
                }
              }}
            >
              تواصل مع الدعم
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
