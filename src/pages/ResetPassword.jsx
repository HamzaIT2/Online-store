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
import { useTranslation } from 'react-i18next';
const ResetPassword = () => {
  const { t } = useTranslation();
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
      setError(t('reset_password_passwords_not_match'));
      return;
    }

    if (!token) {
      setError(t('reset_password_invalid_link'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/v1/auth/reset-password', {
        token: token,
        password: password
      });

      setMessage(t('reset_password_success'));

      // التوجيه التلقائي بعد 3 ثواني
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(t('reset_password_failed'));
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
          {t('reset_password_title')}
        </Typography>

        {message && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('reset_password_new_password')}
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
            label={t('reset_password_confirm_password')}
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
            {loading ? t('reset_password_loading') : t('reset_password_change')}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;