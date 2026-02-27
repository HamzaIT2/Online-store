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
  IconButton
} from '@mui/material';
import {
  Close,
  Payment,
  Phone,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import ZainCashProvider from '../services/zainCashProvider';

const ProductPaymentDialog = ({ open, onClose, product, onPaymentComplete }) => {
  const { darkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const zainCash = new ZainCashProvider();

  const steps = [
    t('payment_method') || 'طريقة الدفع',
    t('phone_number') || 'رقم الهاتف',
    t('payment_confirmation') || 'تأكيد الدفع'
  ];

  const handleNext = async () => {
    if (currentStep === 0) {
      // Move to phone number step
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Validate phone number and create payment
      if (!phoneNumber || phoneNumber.length < 11) {
        setError(t('invalid_phone_number') || 'رقم الهاتف غير صحيح');
        return;
      }
      await createPayment();
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setError('');
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

      // Auto-redirect after 2 seconds
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
    // Reset state
    setCurrentStep(0);
    setPhoneNumber('');
    setError('');
    setPaymentIntent(null);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkMode ? '#1a2f4a' : '#fff',
          color: darkMode ? '#fff' : '#000',
          borderRadius: '16px',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 3,
        bgcolor: darkMode ? '#0d1b2a' : '#f8f9fa',
        borderBottom: `1px solid ${darkMode ? '#34495e' : '#e9ecef'}`
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t('buy_now') || 'شراء الآن'}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: darkMode ? '#fff' : '#000' }}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Product Summary */}
      <Box sx={{ p: 3, bgcolor: darkMode ? '#1e3a5f' : '#f1f3f4' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: darkMode ? '#34495e' : '#e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Payment sx={{ fontSize: 30, color: '#FF6B35' }} />
            </Box>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {product?.title || product?.name || 'Product'}
            </Typography>
            <Typography variant="h5" color="#FF6B35" sx={{ fontWeight: 700 }}>
              {formatPrice(product?.price)} {t('currency_iqd') || 'IQD'}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {/* Stepper */}
        <Box sx={{ p: 3, pb: 1 }}>
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: darkMode ? '#aaa' : '#666',
                      '&.Mui-active': { color: '#FF6B35' },
                      '&.Mui-completed': { color: '#4CAF50' }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ mx: 3 }} />

        {/* Step Content */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {currentStep === 0 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {t('select_payment_method') || 'اختر طريقة الدفع المناسبة لك'}
              </Typography>

              <Paper
                onClick={handleNext}
                sx={{
                  p: 3,
                  border: `2px solid ${darkMode ? '#34495e' : '#e9ecef'}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.2)'
                  }
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: '#FF6B35',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Payment sx={{ fontSize: 25, color: '#fff' }} />
                    </Box>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Zain Cash
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('zain_cash_description') || 'دفع آمن وسهل عبر تطبيق Zain Cash'}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CheckCircle sx={{ color: '#4CAF50', fontSize: 24 }} />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}

          {currentStep === 1 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {t('enter_phone_number') || 'أدخل رقم هاتفك المسجل في Zain Cash'}
              </Typography>

              <TextField
                fullWidth
                label={t('phone_number') || 'رقم الهاتف'}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0791234567"
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: '#FF6B35' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '& fieldset': { borderColor: darkMode ? '#34495e' : '#e9ecef' },
                    '&:hover fieldset': { borderColor: '#FF6B35' },
                    '&.Mui-focused fieldset': { borderColor: '#FF6B35' }
                  }
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('phone_note') || 'سيتم إرسال رابط الدفع إلى هذا الرقم'}
              </Typography>
            </Box>
          )}

          {currentStep === 2 && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircle sx={{ fontSize: 60, color: '#4CAF50', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('payment_created') || 'تم إنشاء عملية الدفع بنجاح'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('redirecting_to_payment') || 'سيتم توجيهك إلى تطبيق Zain Cash خلال ثانيتين...'}
              </Typography>
              {paymentIntent && (
                <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                  {t('transaction_id') || 'رقم المعاملة'}: {paymentIntent.transactionId}
                </Typography>
              )}
              {loading && <CircularProgress sx={{ mt: 2 }} />}
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{
        p: 3,
        bgcolor: darkMode ? '#0d1b2a' : '#f8f9fa',
        borderTop: `1px solid ${darkMode ? '#34495e' : '#e9ecef'}`
      }}>
        {currentStep > 0 && currentStep < 2 && (
          <Button
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{ color: darkMode ? '#aaa' : '#666' }}
          >
            {t('back') || 'رجوع'}
          </Button>
        )}

        <Box sx={{ flex: 1 }} />

        {currentStep < 2 && (
          <Button
            onClick={handleNext}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#FF6B35',
              '&:hover': { bgcolor: '#E55A2B' },
              minWidth: 120
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : currentStep === 0 ? (
              t('next') || 'التالي'
            ) : (
              t('pay_now') || 'ادفع الآن'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductPaymentDialog;
