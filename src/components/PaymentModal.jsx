import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Phone,
  Payment,
  CheckCircle,
  Error,
  Smartphone
} from '@mui/icons-material';
import ZainCashProvider from '../services/zainCashProvider';

const PaymentModal = ({ 
  open, 
  onClose, 
  orderId, 
  amount, 
  onPaymentComplete 
}) => {
  const [step, setStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);

  const zainCashProvider = new ZainCashProvider();

  const steps = [
    'اختر طريقة الدفع',
    'أدخل رقم الهاتف',
    'إتمام الدفع'
  ];

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      await handleZainCashPayment();
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleZainCashPayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('يرجى إدخال رقم هاتف صحيح (10 أرقام)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const intent = await zainCashProvider.createPayment({
        amount: amount,
        orderId: orderId,
        phoneNumber: phoneNumber,
        description: `دفع للطلب #${orderId}`
      });

      setPaymentIntent(intent);
      setStep(2);

      // Redirect to Zain Cash
      await zainCashProvider.redirectToPayment(intent, phoneNumber);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(0);
    setPhoneNumber('');
    setError('');
    setPaymentIntent(null);
    onClose();
  };

  const handlePaymentSuccess = () => {
    onPaymentComplete(true);
    handleClose();
  };

  const handlePaymentFailure = () => {
    setError('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
    setStep(1);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 },
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24
      }}>
        
        {/* Header */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="h2">
            إتمام الدفع
          </Typography>
          <Typography variant="body2" color="text.secondary">
            طلب رقم: #{orderId}
          </Typography>
        </Box>

        {/* Amount Display */}
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h3" fontWeight="bold">
            {amount.toLocaleString()} IQD
          </Typography>
          <Typography variant="body2">
            المبلغ الإجمالي
          </Typography>
        </Box>

        {/* Stepper */}
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {step === 0 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                اختر طريقة الدفع المناسبة لك
              </Typography>
              
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: 2,
                  borderColor: 'primary.main',
                  '&:hover': { bgcolor: 'grey.50' }
                }}
                onClick={handleNext}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 50, 
                    height: 50, 
                    borderRadius: '50%',
                    bgcolor: '#FF6B35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Smartphone />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">Zain Cash</Typography>
                    <Typography variant="body2" color="text.secondary">
                      الدفع عبر محفظة زين كاش
                    </Typography>
                  </Box>
                  <Chip label="الأكثر شيوعاً" color="primary" size="small" />
                </CardContent>
              </Card>
            </Box>
          )}

          {step === 1 && (
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                أدخل رقم هاتف زين كاش الخاص بك
              </Typography>
              
              <TextField
                fullWidth
                label="رقم الهاتف"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="0791234567"
                inputProps={{
                  maxLength: 10,
                  pattern: '[0-9]*'
                }}
                InputProps={{
                  startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 3 }}
              />

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  سيتم توجيهك إلى تطبيق زين كاش لإتمام عملية الدفع
                </Typography>
              </Alert>
            </Box>
          )}

          {step === 2 && paymentIntent && (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1">
                جاري توجيهك إلى تطبيق زين كاش...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                رقم المعاملة: {paymentIntent.transactionId}
              </Typography>
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  إذا لم يتم توجيهك تلقائياً، يرجى فتح تطبيق زين كاش يدوياً
                </Typography>
              </Alert>
            </Box>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
          {step > 0 && step < 2 && (
            <Button variant="outlined" onClick={handleBack} fullWidth>
              السابق
            </Button>
          )}
          
          <Button 
            variant="outlined" 
            onClick={handleClose}
            fullWidth={step === 0}
          >
            {step === 0 ? 'إلغاء' : 'إغلاق'}
          </Button>

          {step < 2 && (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={20} /> : 'التالي'}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
