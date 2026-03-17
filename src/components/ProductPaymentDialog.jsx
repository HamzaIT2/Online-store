import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  alpha,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Close,
  Payment,
  Phone,
  CheckCircle,
  ArrowBack,
  ShoppingBag,
  Shield,
  FlashOn,
  Speed,
  Lock,
  VerifiedUser,
  TrendingUp
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import ZainCashProvider from '../services/zainCashProvider';

const ProductPaymentDialog = ({ open, onClose, product, onPaymentComplete }) => {
  const { darkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Delivery information state
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    notes: ''
  });

  const zainCash = new ZainCashProvider();

  const steps = [
    t('payment_method') || 'طريقة الدفع',
    t('phone_number') || 'رقم الهاتف',
    t('verification_code') || 'رمز التحقق',
    t('payment_confirmation') || 'تأكيد الدفع'
  ];

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'cash') {
      // For cash on delivery, go to delivery info step
      setCurrentStep(1);
    } else {
      // For Zain Cash, go to phone step
      setCurrentStep(1);
    }
  };

  const handlePaymentComplete = () => {
    // For cash on delivery, go to success step
    setCurrentStep(2);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value.replace(/\D/g, ''));
  };

  const validateVerificationCode = () => {
    if (!verificationCode || verificationCode.length < 4) {
      setError('رمز التحقق يجب أن يكون 4 أرقام على الأقل');
      return false;
    }
    setError('');
    return true;
  };

  const handleDeliveryInfoChange = (field) => (e) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateDeliveryInfo = () => {
    const { fullName, phone, address, province, city } = deliveryInfo;

    if (!fullName.trim()) {
      setError('الاسم الكامل مطلوب');
      return false;
    }

    if (!phone.trim() || phone.length !== 11) {
      setError('رقم الهاتف يجب أن يكون 11 رقم');
      return false;
    }

    if (!address.trim()) {
      setError('العنوان مطلوب');
      return false;
    }

    if (!province) {
      setError('المحافظة مطلوبة');
      return false;
    }

    if (!city.trim()) {
      setError('المدينة مطلوبة');
      return false;
    }

    setError('');
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // This should not be called anymore since we use handlePaymentMethodSelect
      return;
    } else if (currentStep === 1) {
      if (paymentMethod === 'cash') {
        // Validate delivery info for cash on delivery
        if (!validateDeliveryInfo()) {
          return;
        }
        // Go to success step
        handlePaymentComplete();
        return;
      } else {
        // For Zain Cash, validate phone number
        if (!phoneNumber || phoneNumber.length !== 11) {
          setError(t('invalid_phone_number') || 'رقم الهاتف يجب أن يكون 11 رقم');
          return;
        }
        // Create payment and go to verification step
        await createPayment();
        setCurrentStep(2); // Go to verification code step
        return;
      }
    } else if (currentStep === 2) {
      if (paymentMethod === 'zaincash') {
        // Validate verification code
        if (!validateVerificationCode()) {
          return;
        }
        // Verify the code and complete payment
        await verifyPayment();
        return;
      }
    } else if (currentStep === 3) {
      // On success step, complete the order
      if (onPaymentComplete) {
        onPaymentComplete(true, {
          paymentMethod: paymentMethod,
          deliveryInfo: deliveryInfo,
          product: product
        });
      }
      onClose();
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const verifyPayment = async () => {
    setLoading(true);
    try {
      // Here you would verify the code with Zain Cash API
      // For now, we'll simulate the verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful verification
      setCurrentStep(3); // Go to success step
      setError('');
    } catch (err) {
      setError('رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const orderId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const amount = Number(product?.price || 0);

      const intent = await zainCash.createPayment({
        amount,
        orderId,
        phoneNumber,
        description: t('payment_for_product') + ': ' + (product?.title || product?.name || 'Product')
      });

      setPaymentIntent(intent);
      setCurrentStep(2);

      setTimeout(async () => {
        await zainCash.redirectToPayment(intent, phoneNumber);
      }, 2000);

    } catch (err) {
      setError(err.message || t('payment_error') || 'فشل في إنشاء عملية الدفع');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onPaymentComplete) {
      onPaymentComplete(false);
    }
    onClose();
    setCurrentStep(0);
    setPhoneNumber('');
    setVerificationCode('');
    setError('');
    setPaymentIntent(null);
    setPaymentMethod('');
    setDeliveryInfo({
      fullName: '',
      phone: '',
      address: '',
      province: '',
      city: '',
      notes: ''
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#0f172a' : '#fff',
          color: darkMode ? '#fff' : '#000',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: darkMode
            ? '0 25px 50px rgba(0, 0, 0, 0.3)'
            : '0 25px 50px rgba(0, 0, 0, 0.1)',
          border: darkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.05)',
          fontFamily: '"Cairo", "Helvetica Neue", Arial, sans-serif'
        }
      }}
    >
      {/* Header with Gradient */}
      <Box sx={{
        background: darkMode
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
        borderBottom: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative'
      }}>
        {/* Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #667eea)',
        }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              width: 40,
              height: 40,
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
            }}>
              <ShoppingBag sx={{ color: '#fff', fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 2px 4px rgba(0, 0, 0.1)',
                fontSize: '1.1rem'
              }}>
                {t('buy_now') || 'شراء الآن'}
              </Typography>
              <Typography variant="caption" sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.85rem'
              }}>
                عملية شراء آمنة وسريعة
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={handleClose}
            sx={{
              color: '#fff',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'rotate(90deg)'
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Product Summary Card */}
      <Box sx={{
        p: 2,
        background: darkMode ? '#1e293b' : '#f8f9fa',
        borderBottom: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <Card sx={{
          background: darkMode ? '#0f172a' : '#fff',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: darkMode
            ? '0 6px 24px rgba(0, 0, 0, 0.2)'
            : '0 6px 24px rgba(0, 0, 0, 0.08)',
          border: darkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(103, 126, 234, 0.15)'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '12px',
                  background: darkMode ? '#1e293b' : '#f1f3f4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: darkMode
                    ? '2px solid rgba(255, 107, 107, 0.2)'
                    : '2px solid rgba(255, 107, 107, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    opacity: 0.1
                  }} />
                  <Payment sx={{
                    fontSize: 24,
                    color: '#FF6B35',
                    position: 'relative',
                    zIndex: 1
                  }} />
                </Box>
              </Grid>
              <Grid item xs>
                <Box>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: darkMode ? '#fff' : '#333',
                    fontSize: '1rem'
                  }}>
                    {product?.title || product?.name || 'Product'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Typography variant="h5" sx={{
                      fontWeight: 800,
                      color: '#FF6B35',
                      fontSize: '1.4rem'
                    }}>
                      {formatPrice(product?.price)}
                    </Typography>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      color: darkMode ? '#fff' : '#666',
                      fontSize: '0.9rem'
                    }}>
                      {t('currency_iqd') || 'IQD'}
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Shield sx={{ fontSize: 14 }} />}
                      label="دفع آمن"
                      size="small"
                      sx={{
                        background: darkMode ? 'rgba(76, 175, 80, 0.15)' : 'rgba(76, 175, 80, 0.08)',
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                    <Chip
                      icon={<FlashOn sx={{ fontSize: 14 }} />}
                      label="سريع"
                      size="small"
                      sx={{
                        background: darkMode ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.08)',
                        color: '#FF9800',
                        fontWeight: 'bold',
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                    <Chip
                      icon={<Speed sx={{ fontSize: 14 }} />}
                      label="فوري"
                      size="small"
                      sx={{
                        background: darkMode ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.08)',
                        color: '#2196F3',
                        fontWeight: 'bold',
                        fontSize: '0.65rem',
                        height: 24
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <DialogContent sx={{ p: 0, background: darkMode ? '#0f172a' : '#fff' }}>
        {/* Enhanced Stepper */}
        <Box sx={{ p: 3, pb: 1 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: darkMode ? '#aaa' : '#666',
                      fontWeight: 600,
                      '&.Mui-active': {
                        color: '#FF6B35',
                        fontWeight: 700
                      },
                      '&.Mui-completed': {
                        color: '#4CAF50',
                        fontWeight: 600
                      }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ mx: 3, mb: 2 }} />

        {/* Step Content */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                background: darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                border: darkMode
                  ? '1px solid rgba(244, 67, 54, 0.2)'
                  : '1px solid rgba(244, 67, 54, 0.1)',
                borderRadius: '12px'
              }}
            >
              {error}
            </Alert>
          )}

          {currentStep === 0 && (
            <Box>
              <Typography variant="h6" sx={{
                mb: 3,
                fontWeight: 600,
                color: darkMode ? '#fff' : '#333'
              }}>
                اختر طريقة الدفع المناسبة لك
              </Typography>

              {/* Zain Cash Option */}
              <Paper
                onClick={() => handlePaymentMethodSelect('zaincash')}
                sx={{
                  p: 3,
                  border: `2px solid ${darkMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(255, 107, 107, 0.2)'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: darkMode ? '#1e293b' : '#fff',
                  mb: 2,
                  '&:hover': {
                    borderColor: '#FF6B35',
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: darkMode
                      ? '0 12px 40px rgba(255, 107, 107, 0.3)'
                      : '0 12px 40px rgba(255, 107, 107, 0.2)',
                    background: darkMode ? '#0f172a' : '#fff'
                  }
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(255, 107, 107, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: '-2px',
                        left: '-2px',
                        right: '-2px',
                        bottom: '-2px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'rotate(45deg)',
                        transformOrigin: 'center'
                      }} />
                      <Payment sx={{ fontSize: 32, color: '#fff', position: 'relative', zIndex: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box>
                      <Typography variant="h5" sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: darkMode ? '#fff' : '#333'
                      }}>
                        Zain Cash
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                        mb: 3
                      }}>
                        الدفع الآمن والسريع عبر تطبيق Zain Cash
                      </Typography>

                      {/* Features */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{
                            fontSize: 18,
                            color: '#4CAF50',
                            mr: 1
                          }} />
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#fff' : '#333'
                          }}>
                            موثوق تماماً
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FlashOn sx={{
                            fontSize: 18,
                            color: '#FF9800',
                            mr: 1
                          }} />
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#fff' : '#333'
                          }}>
                            فوري فوري
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{
                            fontSize: 18,
                            color: '#2196F3',
                            mr: 1
                          }} />
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#fff' : '#333'
                          }}>
                            الأكثر استخداماً
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" sx={{
                        fontSize: '0.8rem',
                        color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                        mt: 2,
                        fontStyle: 'italic'
                      }}>
                        الطريقة المفضلة لدفع في العراق
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }}>
                      <CheckCircle sx={{ fontSize: 24, color: '#fff' }} />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Cash on Delivery Option */}
              <Paper
                onClick={() => handlePaymentMethodSelect('cash')}
                sx={{
                  p: 3,
                  border: `2px solid ${darkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'}`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: darkMode ? '#1e293b' : '#fff',
                  '&:hover': {
                    borderColor: '#4CAF50',
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: darkMode
                      ? '0 12px 40px rgba(76, 175, 80, 0.3)'
                      : '0 12px 40px rgba(76, 175, 80, 0.2)',
                    background: darkMode ? '#0f172a' : '#fff'
                  }
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '12px',
                      background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: '-2px',
                        left: '-2px',
                        right: '-2px',
                        bottom: '-2px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'rotate(45deg)',
                        transformOrigin: 'center'
                      }} />
                      <Payment sx={{ fontSize: 32, color: '#fff', position: 'relative', zIndex: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Box>
                      <Typography variant="h5" sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: darkMode ? '#fff' : '#333'
                      }}>
                        الدفع عند الاستلام
                      </Typography>
                      <Typography variant="body2" sx={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                        mb: 3
                      }}>
                        الدفع النقدي عند استلام المنتج مباشرة
                      </Typography>

                      {/* Features */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle sx={{
                            fontSize: 18,
                            color: '#4CAF50',
                            mr: 1
                          }} />
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#fff' : '#333'
                          }}>
                            آمن ومباشر
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FlashOn sx={{
                            fontSize: 18,
                            color: '#FF9800',
                            mr: 1
                          }} />
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#fff' : '#333'
                          }}>
                            بدون رسوم
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrendingUp sx={{
                            fontSize: 18,
                            color: '#2196F3',
                            mr: 1
                          }} />
                          <Typography variant="body2" sx={{
                            fontSize: '0.9rem',
                            color: darkMode ? '#fff' : '#333'
                          }}>
                            سهل ومريح
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" sx={{
                        fontSize: '0.8rem',
                        color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                        mt: 2,
                        fontStyle: 'italic'
                      }}>
                        الطريقة التقليدية الموثوقة
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }}>
                      <CheckCircle sx={{ fontSize: 24, color: '#fff' }} />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}

          {currentStep === 1 && paymentMethod === 'cash' && (
            <Box>
              <Typography variant="h6" sx={{
                mb: 3,
                fontWeight: 600,
                color: darkMode ? '#fff' : '#333'
              }}>
                أدخل معلومات الاستلام
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    background: darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                    border: darkMode
                      ? '1px solid rgba(244, 67, 54, 0.2)'
                      : '1px solid rgba(244, 67, 54, 0.1)',
                    borderRadius: '12px'
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'grid', gap: 2 }}>
                {/* Full Name */}
                <TextField
                  fullWidth
                  label="الاسم الكامل"
                  value={deliveryInfo.fullName}
                  onChange={handleDeliveryInfoChange('fullName')}
                  placeholder="أدخل اسمك الكامل"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
                      }
                    }
                  }}
                />

                {/* Phone Number */}
                <TextField
                  fullWidth
                  label="رقم الهاتف"
                  value={deliveryInfo.phone}
                  onChange={handleDeliveryInfoChange('phone')}
                  placeholder="07912345678"
                  inputProps={{
                    maxLength: 11,
                    pattern: '[0-9]*'
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
                      }
                    }
                  }}
                />

                {/* Address */}
                <TextField
                  fullWidth
                  label="العنوان بالتفصيل"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryInfoChange('address')}
                  placeholder="أدخل عنوانك الكامل مع رقم المنزل والشارع"
                  multiline
                  rows={2}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
                      }
                    }
                  }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {/* Province */}
                  <FormControl fullWidth>
                    <InputLabel id="province-label" sx={{
                      color: darkMode ? '#fff' : '#666',
                      mb: 1,
                      fontWeight: 500
                    }}>
                      المحافظة
                    </InputLabel>
                    <Select
                      labelId="province-label"
                      fullWidth
                      value={deliveryInfo.province}
                      onChange={handleDeliveryInfoChange('province')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            borderWidth: '2px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: '2px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
                          }
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>اختر المحافظة</em>
                      </MenuItem>
                      <MenuItem value="بغداد">بغداد</MenuItem>
                      <MenuItem value="البصرة">البصرة</MenuItem>
                      <MenuItem value="أربيل">أربيل</MenuItem>
                      <MenuItem value="النجف">النجف</MenuItem>
                      <MenuItem value="السليمانية">السليمانية</MenuItem>
                      <MenuItem value="دهوك">دهوك</MenuItem>
                      <MenuItem value="كربلاء">كربلاء</MenuItem>
                      <MenuItem value="نينوى">نينوى</MenuItem>
                      <MenuItem value="الأنبار">الأنبار</MenuItem>
                      <MenuItem value="ديالى">ديالى</MenuItem>
                      <MenuItem value="واسط">واسط</MenuItem>
                      <MenuItem value="ميسان">ميسان</MenuItem>
                      <MenuItem value="ذي قار">ذي قار</MenuItem>
                      <MenuItem value="بابل">بابل</MenuItem>
                      <MenuItem value="صلاح الدين">صلاح الدين</MenuItem>
                      <MenuItem value="المثنى">المثنى</MenuItem>
                      <MenuItem value="الديوانية">الديوانية</MenuItem>
                    </Select>
                  </FormControl>

                  {/* City */}
                  <FormControl fullWidth>
                    <InputLabel id="city-label" sx={{
                      color: darkMode ? '#fff' : '#666',
                      mb: 1,
                      fontWeight: 500
                    }}>
                      المدينة
                    </InputLabel>
                    <Select
                      labelId="city-label"
                      fullWidth
                      value={deliveryInfo.city}
                      onChange={handleDeliveryInfoChange('city')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                            borderWidth: '2px'
                          },
                          '&:hover fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: '2px'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4CAF50',
                            borderWidth: '2px',
                            boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
                          }
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>اختر المدينة</em>
                      </MenuItem>
                      {deliveryInfo.province === 'بغداد' && [
                        <MenuItem key="baghdad" value="بغداد">بغداد</MenuItem>,
                        <MenuItem key="sadr" value="الصدرية">الصدرية</MenuItem>,
                        <MenuItem key="kadhim" value="الكاظمية">الكاظمية</MenuItem>,
                        <MenuItem key="mansour" value="المنصور">المنصور</MenuItem>,
                        <MenuItem key="adhamiya" value="الاعظمية">الاعظمية</MenuItem>
                      ]}
                      {deliveryInfo.province === 'البصرة' && [
                        <MenuItem key="basra" value="البصرة">البصرة</MenuItem>,
                        <MenuItem key="faw" value="الفاو">الفاو</MenuItem>,
                        <MenuItem key="abukhasib" value="أبو الخصيب">أبو الخصيب</MenuItem>,
                        <MenuItem key="makan" value="المقنع">المقنع</MenuItem>,
                        <MenuItem key="qurna" value="القرنة">القرنة</MenuItem>
                      ]}
                      {deliveryInfo.province === 'أربيل' && [
                        <MenuItem key="erbil" value="أربيل">أربيل</MenuItem>,
                        <MenuItem key="shaqlawa" value="شقلاوة">شقلاوة</MenuItem>,
                        <MenuItem key="rawanduz" value="رواندوز">رواندوز</MenuItem>,
                        <MenuItem key="khalifan" value="خليفان">خليفان</MenuItem>,
                        <MenuItem key="soran" value="سوران">سوران</MenuItem>
                      ]}
                      {deliveryInfo.province === 'النجف' && [
                        <MenuItem key="najaf" value="النجف">النجف</MenuItem>,
                        <MenuItem key="kufa" value="الكوفة">الكوفة</MenuItem>,
                        <MenuItem key="hira" value="الحيرة">الحيرة</MenuItem>,
                        <MenuItem key="mushkhab" value="المشخاب">المشخاب</MenuItem>,
                        <MenuItem key="hindia" value="الهندية">الهندية</MenuItem>
                      ]}
                      {deliveryInfo.province === 'السليمانية' && [
                        <MenuItem key="sulaymaniyah" value="السليمانية">السليمانية</MenuItem>,
                        <MenuItem key="halabja" value="حلبجة">حلبجة</MenuItem>,
                        <MenuItem key="jamjamal" value="جمجمال">جمجمال</MenuItem>,
                        <MenuItem key="dokan" value="دوكان">دوكان</MenuItem>,
                        <MenuItem key="raniya" value="رانية">رانية</MenuItem>
                      ]}
                      {deliveryInfo.province === 'دهوك' && [
                        <MenuItem key="duhok" value="دهوك">دهوك</MenuItem>,
                        <MenuItem key="zakho" value="زاخو">زاخو</MenuItem>,
                        <MenuItem key="amadia" value="العمادية">العمادية</MenuItem>,
                        <MenuItem key="semil" value="سميل">سميل</MenuItem>,
                        <MenuItem key="aqra" value="عقره">عقره</MenuItem>
                      ]}
                      {deliveryInfo.province === 'كربلاء' && [
                        <MenuItem key="karbala" value="كربلاء">كربلاء</MenuItem>,
                        <MenuItem key="hindia" value="الهندية">الهندية</MenuItem>,
                        <MenuItem key="husseiniya" value="الحسينية">الحسينية</MenuItem>,
                        <MenuItem key="abbasiya" value="العباسية">العباسية</MenuItem>,
                        <MenuItem key="tawreej" value="طويريج">طويريج</MenuItem>
                      ]}
                      {deliveryInfo.province === 'الموصل' && [
                        <MenuItem key="mosul" value="الموصل">الموصل</MenuItem>,
                        <MenuItem key="talafar" value="تلعفر">تلعفر</MenuItem>,
                        <MenuItem key="badush" value="بادوش">بادوش</MenuItem>,
                        <MenuItem key="hamdaniya" value="الحمدانية">الحمدانية</MenuItem>,
                        <MenuItem key="baaj" value="البعاج">البعاج</MenuItem>,
                        <MenuItem key="shirqat" value="الشرقاط">الشرقاط</MenuItem>
                      ]}
                      {deliveryInfo.province === 'نينوى' && [
                        <MenuItem key="mosul" value="الموصل">الموصل</MenuItem>,
                        <MenuItem key="talafar" value="تلعفر">تلعفر</MenuItem>,
                        <MenuItem key="badush" value="بادوش">بادوش</MenuItem>,
                        <MenuItem key="hamdaniya" value="الحمدانية">الحمدانية</MenuItem>,
                        <MenuItem key="baaj" value="البعاج">البعاج</MenuItem>,
                        <MenuItem key="shirqat" value="الشرقاط">الشرقاط</MenuItem>
                      ]}
                      {deliveryInfo.province === 'الأنبار' && [
                        <MenuItem key="ramadi" value="الرمادي">الرمادي</MenuItem>,
                        <MenuItem key="falluja" value="الفلوجة">الفلوجة</MenuItem>,
                        <MenuItem key="haditha" value="حديثة">حديثة</MenuItem>,
                        <MenuItem key="hit" value="هيت">هيت</MenuItem>,
                        <MenuItem key="qaim" value="القائم">القائم</MenuItem>
                      ]}
                      {deliveryInfo.province === 'ديالى' && [
                        <MenuItem key="baquba" value="بعقوبة">بعقوبة</MenuItem>,
                        <MenuItem key="khanqin" value="خانقين">خانقين</MenuItem>,
                        <MenuItem key="baladruz" value="بلدروز">بلدروز</MenuItem>,
                        <MenuItem key="mandili" value="مندلي">مندلي</MenuItem>,
                        <MenuItem key="jalawla" value="جلولاء">جلولاء</MenuItem>
                      ]}
                      {deliveryInfo.province === 'واسط' && [
                        <MenuItem key="kut" value="الكوت">الكوت</MenuItem>,
                        <MenuItem key="aziziya" value="العزيزية">العزيزية</MenuItem>,
                        <MenuItem key="nasrat" value="نصرت">نصرت</MenuItem>,
                        <MenuItem key="hay" value="الحي">الحي</MenuItem>,
                        <MenuItem key="suwayra" value="الصويرة">الصويرة</MenuItem>
                      ]}
                      {deliveryInfo.province === 'ميسان' && [
                        <MenuItem key="amara" value="العمارة">العمارة</MenuItem>,
                        <MenuItem key="mujar" value="المجر الكبير">المجر الكبير</MenuItem>,
                        <MenuItem key="ali" value="علي الغربي">علي الغربي</MenuItem>,
                        <MenuItem key="qala" value="قلعة صالح">قلعة صالح</MenuItem>,
                        <MenuItem key="maymun" value="الميمونة">الميمونة</MenuItem>
                      ]}
                      {deliveryInfo.province === 'ذي قار' && [
                        <MenuItem key="nasiriya" value="الناصرية">الناصرية</MenuItem>,
                        <MenuItem key="rafi" value="الرفاعي">الرفاعي</MenuItem>,
                        <MenuItem key="suq" value="سوق الشيوخ">سوق الشيوخ</MenuItem>,
                        <MenuItem key="shatra" value="الشطرة">الشطرة</MenuItem>,
                        <MenuItem key="jbaysh" value="الجبايش">الجبايش</MenuItem>
                      ]}
                      {deliveryInfo.province === 'بابل' && [
                        <MenuItem key="hilla" value="الحلة">الحلة</MenuItem>,
                        <MenuItem key="mahmudiya" value="المحمودية">المحمودية</MenuItem>,
                        <MenuItem key="musayb" value="المسيب">المسيب</MenuItem>,
                        <MenuItem key="jurf" value="جرف الصخر">جرف الصخر</MenuItem>,
                        <MenuItem key="hit" value="هيت">هيت</MenuItem>
                      ]}
                      {deliveryInfo.province === 'صلاح الدين' && [
                        <MenuItem key="tikrit" value="تكريت">تكريت</MenuItem>,
                        <MenuItem key="samara" value="سامراء">سامراء</MenuItem>,
                        <MenuItem key="balad" value="بلد">بلد</MenuItem>,
                        <MenuItem key="dur" value="الدور">الدور</MenuItem>,
                        <MenuItem key="beiji" value="بيجي">بيجي</MenuItem>,
                        <MenuItem key="shirqat" value="الشرقاط">الشرقاط</MenuItem>
                      ]}
                      {deliveryInfo.province === 'المثنى' && [
                        <MenuItem key="samawa" value="السماوة">السماوة</MenuItem>,
                        <MenuItem key="ritha" value="الرميثة">الرميثة</MenuItem>,
                        <MenuItem key="shatra" value="الشطرة">الشطرة</MenuItem>,
                        <MenuItem key="gharraf" value="الغراف">الغراف</MenuItem>,
                        <MenuItem key="rafi" value="الرفاعي">الرفاعي</MenuItem>
                      ]}
                      {deliveryInfo.province === 'الديوانية' && [
                        <MenuItem key="diwaniya" value="الديوانية">الديوانية</MenuItem>,
                        <MenuItem key="shamiya" value="الشامية">الشامية</MenuItem>,
                        <MenuItem key="hamza" value="حمزة">حمزة</MenuItem>,
                        <MenuItem key="gharraf" value="الغراف">الغراف</MenuItem>,
                        <MenuItem key="aziziya" value="العزيزية">العزيزية</MenuItem>
                      ]}
                    </Select>
                  </FormControl>
                </Box>

                {/* Notes */}
                <TextField
                  fullWidth
                  label="ملاحظات إضافية (اختياري)"
                  value={deliveryInfo.notes}
                  onChange={handleDeliveryInfoChange('notes')}
                  placeholder="أي ملاحظات إضافية لتسهيل الطلب"
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4CAF50',
                        borderWidth: '2px',
                        boxShadow: '0 0 0 3px rgba(76, 175, 80, 0.1)'
                      }
                    }
                  }}
                />
              </Box>

              <Alert
                severity="info"
                sx={{
                  mt: 3,
                  background: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                  border: darkMode
                    ? '1px solid rgba(33, 150, 243, 0.2)'
                    : '1px solid rgba(33, 150, 243, 0.1)',
                  borderRadius: '12px'
                }}
              >
                <Typography variant="body2">
                  سيتم التواصل معك لتأكيد الطلب قبل التوصيل. يرجى إدخال معلومات صحيحة.
                </Typography>
              </Alert>
            </Box>
          )}

          {currentStep === 1 && paymentMethod === 'zaincash' && (
            <Box>
              <Typography variant="h6" sx={{
                mb: 3,
                fontWeight: 600,
                color: darkMode ? '#fff' : '#333'
              }}>
                أدخل رقم هاتفك المسجل في Zain Cash
              </Typography>

              <TextField
                fullWidth
                label={t('phone_number') || 'رقم الهاتف'}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="07912345678"
                inputProps={{
                  maxLength: 11,
                  pattern: '[0-9]*'
                }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mr: 1,
                      p: 1,
                      background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
                      borderRadius: '8px'
                    }}>
                      <Phone sx={{ color: '#fff', fontSize: 18 }} />
                      <Lock sx={{ color: '#fff', fontSize: 14 }} />
                    </Box>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF6B35',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                      borderWidth: '2px',
                      boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.1)'
                    }
                  }
                }}
              />

              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  background: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                  border: darkMode
                    ? '1px solid rgba(33, 150, 243, 0.2)'
                    : '1px solid rgba(33, 150, 243, 0.1)',
                  borderRadius: '12px'
                }}
              >
                <Typography variant="body2">
                  سيتم إرسال رابط الدفع إلى هذا الرقم. الرجاء التأكد من صحة الرقم.
                </Typography>
              </Alert>
            </Box>
          )}

          {currentStep === 2 && paymentMethod === 'zaincash' && (
            <Box>
              <Typography variant="h6" sx={{
                mb: 3,
                fontWeight: 600,
                color: darkMode ? '#fff' : '#333'
              }}>
                أدخل رمز التحقق من Zain Cash
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    background: darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                    border: darkMode
                      ? '1px solid rgba(244, 67, 54, 0.2)'
                      : '1px solid rgba(244, 67, 54, 0.1)',
                    borderRadius: '12px'
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="رمز التحقق"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="أدخل الرمز المكون من 6 أرقام"
                inputProps={{
                  maxLength: 6,
                  pattern: '[0-9]*'
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                      borderWidth: '2px'
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF6B35',
                      borderWidth: '2px'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF6B35',
                      borderWidth: '2px',
                      boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)'
                    }
                  }
                }}
              />

              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  background: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                  border: darkMode
                    ? '1px solid rgba(33, 150, 243, 0.2)'
                    : '1px solid rgba(33, 150, 243, 0.1)',
                  borderRadius: '12px'
                }}
              >
                <Typography variant="body2">
                  تم إرسال رمز التحقق إلى رقم هاتفك. يرجى إدخال الرمز لإكمال عملية الدفع.
                </Typography>
              </Alert>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3
              }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                  لم تستلم الرمز؟
                </Typography>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: '#FF6B35',
                    fontWeight: 600,
                    ml: 1
                  }}
                >
                  إعادة إرسال
                </Button>
              </Box>
            </Box>
          )}

          {currentStep === 3 && paymentMethod === 'zaincash' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #FF6B35, #FF8C42)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)'
              }}>
                <CheckCircle sx={{ fontSize: 48, color: '#fff' }} />
              </Box>

              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: darkMode ? '#fff' : '#333',
                mb: 2
              }}>
                تمت العملية بنجاح
              </Typography>

              <Typography variant="body1" sx={{
                color: darkMode ? '#b0b0b0' : '#666',
                mb: 3,
                fontSize: '1.1rem'
              }}>
                تم تأكيد عملية الدفع بنجاح عبر Zain Cash
              </Typography>

              <Box sx={{
                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '16px',
                p: 3,
                mb: 3,
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: darkMode ? '#fff' : '#333',
                  mb: 2
                }}>
                  تفاصيل الدفع
                </Typography>

                <Box sx={{ display: 'grid', gap: 1, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>رقم الهاتف:</strong> {phoneNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>طريقة الدفع:</strong> Zain Cash
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>المبلغ:</strong> {formatPrice(product?.price)} د.ع
                  </Typography>
                  {paymentIntent?.id && (
                    <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                      <strong>رقم المعاملة:</strong> {paymentIntent.id}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Alert
                severity="success"
                sx={{
                  mb: 3,
                  background: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                  border: darkMode
                    ? '1px solid rgba(76, 175, 80, 0.2)'
                    : '1px solid rgba(76, 175, 80, 0.1)',
                  borderRadius: '12px'
                }}
              >
                <Typography variant="body2">
                  تم خصم المبلغ من حسابك بنجاح. شكراً لاستخدامك Zain Cash
                </Typography>
              </Alert>
            </Box>
          )}

          {currentStep === 2 && paymentMethod === 'cash' && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)'
              }}>
                <CheckCircle sx={{ fontSize: 48, color: '#fff' }} />
              </Box>

              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: darkMode ? '#fff' : '#333',
                mb: 2
              }}>
                تمت العملية بنجاح
              </Typography>

              <Typography variant="body1" sx={{
                color: darkMode ? '#b0b0b0' : '#666',
                mb: 3,
                fontSize: '1.1rem'
              }}>
                سيتم توصيل طلبك إلى العنوان المحدد
              </Typography>

              <Box sx={{
                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderRadius: '16px',
                p: 3,
                mb: 3,
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 600,
                  color: darkMode ? '#fff' : '#333',
                  mb: 2
                }}>
                  تفاصيل الاستلام
                </Typography>

                <Box sx={{ display: 'grid', gap: 1, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>الاسم:</strong> {deliveryInfo.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>الهاتف:</strong> {deliveryInfo.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>العنوان:</strong> {deliveryInfo.address}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>المحافظة:</strong> {deliveryInfo.province}
                  </Typography>
                  <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                    <strong>المدينة:</strong> {deliveryInfo.city}
                  </Typography>
                  {deliveryInfo.notes && (
                    <Typography variant="body2" sx={{ color: darkMode ? '#b0b0b0' : '#666' }}>
                      <strong>ملاحظات:</strong> {deliveryInfo.notes}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  background: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                  border: darkMode
                    ? '1px solid rgba(33, 150, 243, 0.2)'
                    : '1px solid rgba(33, 150, 243, 0.1)',
                  borderRadius: '12px'
                }}
              >
                <Typography variant="body2">
                  سيتم التواصل معك خلال 24 ساعة لتأكيد تفاصيل التوصيل
                </Typography>
              </Alert>
            </Box>
          )}

          {currentStep === 2 && paymentMethod === 'zaincash' && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{
                position: 'relative',
                display: 'inline-block',
                mb: 3
              }}>
                <CircularProgress size={60} sx={{ color: '#FF6B35' }} />
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
                  <Payment sx={{ fontSize: 24, color: 'rgba(255, 107, 107, 0.3)' }} />
                </Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {paymentMethod === 'cash' ? 'جاري تأكيد طلب الدفع عند الاستلام...' : 'جاري إنشاء عملية الدفع...'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paymentMethod === 'cash'
                  ? 'سيتم تأكيد طلبك والبدء في تجهيز المنتج للشحن'
                  : 'سيتم توجيهك إلى تطبيق Zain Cash خلال ثوانٍ'
                }
              </Typography>
              {paymentIntent && (
                <Typography variant="caption" sx={{
                  mt: 2,
                  display: 'block',
                  p: 2,
                  background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  fontFamily: 'monospace'
                }}>
                  {paymentMethod === 'cash'
                    ? `رقم الطلب: ${paymentIntent.transactionId || 'ORD-' + Date.now()}`
                    : `${t('transaction_id') || 'رقم المعاملة'}: ${paymentIntent.transactionId}`
                  }
                </Typography>
              )}
              {loading && <CircularProgress sx={{ mt: 2 }} />}
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Enhanced Footer Actions */}
      <DialogActions sx={{
        p: 3,
        background: darkMode ? '#1e293b' : '#f8f9fa',
        borderTop: darkMode
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.05)',
        gap: 2
      }}>
        {currentStep > 0 && currentStep < 2 && (
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{
              color: darkMode ? '#aaa' : '#666',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            {t('back') || 'رجوع'}
          </Button>
        )}

        {/* Back button for payment method selection */}
        {currentStep === 0 && (
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: darkMode ? '#aaa' : '#666',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              '&:hover': {
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            {t('cancel') || 'إلغاء'}
          </Button>
        )}

        <Box sx={{ flex: 1 }} />

        {currentStep < 2 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #FF6B35, #FF8E53)',
              color: '#fff',
              px: 4,
              py: 2,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8E53, #FF6B35)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 30px rgba(255, 107, 107, 0.4)'
              },
              '&:disabled': {
                background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : currentStep === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{t('next') || 'التالي'}</span>
                <Chip
                  label="آمن"
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '0.6rem',
                    height: 20
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>{t('pay_now') || 'ادفع الآن'}</span>
                <Chip
                  label="سريع"
                  size="small"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '0.6rem',
                    height: 20
                  }}
                />
              </Box>
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductPaymentDialog;
