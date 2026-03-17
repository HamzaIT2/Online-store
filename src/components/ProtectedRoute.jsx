import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { t, getCurrentLang } from '../i18n';

const ProtectedRoute = ({ children }) => {
  const { darkMode } = useTheme();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkTermsAgreement = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (token && !user.termsAccepted) {
        setShowTermsModal(true);
      }
    };

    checkTermsAgreement();
  }, []);

  const handleAcceptTerms = () => {
    if (!agreeToTerms) {
      setError(t('must_agree_to_terms') || 'يجب الموافقة على الشروط والأحكام للمتابعة');
      return;
    }

    // تحديث بيانات المستخدم
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.termsAccepted = true;
    localStorage.setItem('user', JSON.stringify(user));

    setShowTermsModal(false);
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  // التحقق من وجود توكن
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // التحقق من الموافقة على الشروط
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user.termsAccepted) {
    return (
      <>
        {children}
        <Dialog
          open={showTermsModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: darkMode ? 'rgba(30, 30, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.3)',
            }
          }}
        >
          <DialogTitle sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: darkMode ? '#fff' : '#333'
          }}>
            ⚠️ {t('terms_acceptance_required')}
          </DialogTitle>

          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2, color: darkMode ? '#aaa' : '#666' }}>
              {t('terms_welcome_message')}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                    {t('agree_to_terms')}
                    <Link
                      component={RouterLink}
                      to="/terms"
                      target="_blank"
                      sx={{ mx: 1, color: '#667eea', fontWeight: 'bold' }}
                    >
                      {t('terms_and_conditions')}
                    </Link>
                    {getCurrentLang() === 'ar' ? ' و ' : ' and '}
                    <Link
                      component={RouterLink}
                      to="/privacy"
                      target="_blank"
                      sx={{ mx: 1, color: '#667eea', fontWeight: 'bold' }}
                    >
                      {t('privacy_policy')}
                    </Link>
                  </Typography>
                }
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
            <Button
              onClick={handleLogout}
              color="error"
              variant="outlined"
            >
              {t('terms_logout')}
            </Button>
            <Button
              onClick={handleAcceptTerms}
              variant="contained"
              disabled={!agreeToTerms}
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                }
              }}
            >
              {t('terms_accept_continue')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
