import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import PasswordIcon from '@mui/icons-material/PasswordOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // جلب التوكن من الرابط
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (!token) {
      setError('رابط غير صالح أو مفقود');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/v1/auth/reset-password', {
        token: token,
        password: password
      });

      setMessage('تم تغيير كلمة المرور بنجاح! سيتم تحويلك لصفحة الدخول...');

      // التوجيه التلقائي بعد 3 ثواني
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError('فشل التغيير، قد يكون الرابط منتهي الصلاحية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          تعيين كلمة مرور جديدة
        </Typography>

        {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="كلمة المرور الجديدة"
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon sx={{ opacity: 0.6 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0.5 }} >
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end"
                    aria-label="toggle password visibility"
                    sx={{ transform: "translateY(-1px)" }}
                  >
                    {showPassword ? <VisibilityOff sx={{ opacity: 0.6 }} /> : <Visibility sx={{ opacity: 0.6 }} />}
                  </IconButton >
                </InputAdornment>
              ),
            }}

          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="تأكيد كلمة المرور"
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordIcon sx={{ opacity: 0.6 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: 0.5 }} >
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end"
                    aria-label="toggle password visibility"
                    sx={{ transform: "translateY(-1px)" }}
                  >
                    {showPassword ? <VisibilityOff sx={{ opacity: 0.6 }} /> : <Visibility sx={{ opacity: 0.6 }} />}
                  </IconButton >
                </InputAdornment>
              ),
            }}
            error={password.length > 0 && password.length < 6}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;