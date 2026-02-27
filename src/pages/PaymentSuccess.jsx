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
  CircularProgress
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Home,
  Receipt,
  LocalShipping
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import ZainCashProvider from '../services/zainCashProvider';

const PaymentSuccess = () => {
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

          // Update order status in backend
          await updateOrderStatus(orderId, {
            status: 'paid',
            paymentStatus: 'completed',
            transactionId: verification.transactionId
          });
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

  const updateOrderStatus = async (orderId, statusData) => {
    try {
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
    // Since orders page doesn't exist, redirect to profile or cart
    navigate('/profile');
    // Or navigate to cart: navigate('/cart');
    // Or create an orders page and navigate there
  };

  if (verifying) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h6">
            جاري التحقق من عملية الدفع...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!paymentStatus?.success) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              فشلت عملية الدفع
            </Typography>
            <Alert severity="error" sx={{ mb: 3 }}>
              {paymentStatus?.error}
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleGoHome}>
                العودة للرئيسية
              </Button>
              <Button variant="contained" onClick={() => navigate('/checkout')}>
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
      <Paper sx={{ p: 4 }}>
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle
            sx={{
              fontSize: 80,
              color: green[500],
              mb: 2
            }}
          />
          <Typography variant="h4" gutterBottom>
            تمت عملية الدفع بنجاح!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            شكراً لك على طلبك. تم استلام الدفع بنجاح.
          </Typography>
        </Box>

        {/* Payment Details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              تفاصيل الدفع
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">رقم المعاملة:</Typography>
              <Typography fontWeight="bold">
                {paymentStatus.transactionId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">المبلغ المدفوع:</Typography>
              <Typography fontWeight="bold" color="primary.main">
                {paymentStatus.amount?.toLocaleString()} IQD
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">وقت الدفع:</Typography>
              <Typography>
                {paymentStatus.verifiedAt?.toLocaleString('ar-IQ')}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            الخطوات التالية
          </Typography>
          <Stepper orientation="vertical">
            <Step completed>
              <StepLabel>
                <Typography variant="body1">استلام الطلب</Typography>
                <Typography variant="body2" color="text.secondary">
                  سيتم تجهيز طلبك للشحن
                </Typography>
              </StepLabel>
            </Step>
            <Step completed>
              <StepLabel>
                <Typography variant="body1">الشحن والتوصيل</Typography>
                <Typography variant="body2" color="text.secondary">
                  سيتم توصيل طلبك إلى العنوان المحدد
                </Typography>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                <Typography variant="body1">استلام المنتج</Typography>
                <Typography variant="body2" color="text.secondary">
                  استلم طلبك وتأكد من جودته
                </Typography>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Home />}
            onClick={handleGoHome}
          >
            العودة للرئيسية
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<Receipt />}
            onClick={handleViewOrder}
          >
            عرض حسابي
          </Button>
        </Box>

        {/* Contact Info */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            إذا كان لديك أي استفسارات حول طلبك، يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;
