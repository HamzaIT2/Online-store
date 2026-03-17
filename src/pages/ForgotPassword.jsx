import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Paper,
  Fade,
  Slide,
  Zoom,
  InputAdornment,
  Avatar
} from '@mui/material';
import { useTheme } from "../context/ThemeContext";
import {
  EmailOutlined,
  LockOutlined,
  ArrowForward,
  Star,
  MailLock
} from '@mui/icons-material';

const ForgotPassword = () => {
  const { darkMode } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // تأكد من البورت (3000 أو 4000 حسب الباك إند)
      await axios.post('http://localhost:3000/api/v1/auth/forgot-password', { email });
      setMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.');
    } catch (err) {
      setError('حدث خطأ، ربما البريد الإلكتروني غير مسجل لدينا.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Make background transparent like other pages
        backgroundColor: 'transparent',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.05) 0%, transparent 50%)`
            : `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(102, 126, 234, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(240, 147, 251, 0.15) 0%, transparent 50%)`,
          animation: 'pulse 4s ease-in-out infinite',
          transition: 'background 0.3s ease',
        },
        '@keyframes pulse': {
          '0%, 100%': { opacity: darkMode ? 0.1 : 0.2 },
          '50%': { opacity: darkMode ? 0.2 : 0.3 }
        }
      }}
    >
      {/* Interactive Mouse Follower - More subtle */}
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          transform: `translate(${mousePosition.x - 150}px, ${mousePosition.y - 150}px)`,
          transition: 'transform 0.1s ease-out',
          zIndex: 1,
        }}
      />

      {/* Mouse Trail Effect - More subtle */}
      <Box
        sx={{
          position: 'absolute',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(240, 147, 251, 0.03) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(240, 147, 251, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          transform: `translate(${mousePosition.x - 75}px, ${mousePosition.y - 75}px)`,
          transition: 'transform 0.2s ease-out',
          zIndex: 0,
        }}
      />

      {/* Floating Particles - More subtle */}
      <Box sx={{ position: 'absolute', top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }}>
        <Star sx={{ fontSize: 30, color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '20%', right: '15%', animation: 'float 8s ease-in-out infinite 1s' }}>
        <Star sx={{ fontSize: 25, color: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '20%', left: '15%', animation: 'float 7s ease-in-out infinite 0.5s' }}>
        <Star sx={{ fontSize: 28, color: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.18)' }} />
      </Box>

      {/* Additional Floating Elements */}
      <Box sx={{ position: 'absolute', top: '30%', right: '10%', animation: 'float 9s ease-in-out infinite 2s' }}>
        <Star sx={{ fontSize: 20, color: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '30%', right: '20%', animation: 'float 5s ease-in-out infinite 1.5s' }}>
        <Star sx={{ fontSize: 24, color: darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.15)' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '60%', left: '8%', animation: 'float 8s ease-in-out infinite 0.8s' }}>
        <Star sx={{ fontSize: 22, color: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.16)' }} />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Slide direction="down" in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              background: darkMode
                ? 'rgba(30, 30, 46, 0.95)'
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: darkMode
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: darkMode
                ? '0 20px 60px rgba(0, 0, 0, 0.5)'
                : '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: darkMode
                  ? 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)'
                  : 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
                animation: 'gradient 3s ease infinite',
              },
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' }
              },
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-20px)' }
              }
            }}
          >
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Fade in timeout={1000}>
                <Avatar
                  sx={{
                    bgcolor: 'linear-gradient(45deg, #667eea, #764ba2)',
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    boxShadow: darkMode
                      ? '0 8px 32px rgba(102, 126, 234, 0.4)'
                      : '0 8px 32px rgba(102, 126, 234, 0.3)',
                    animation: 'pulse 2s ease-in-out infinite',
                  }}
                >
                  <MailLock sx={{ fontSize: 40 }} />
                </Avatar>
              </Fade>

              <Zoom in timeout={1200}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    background: darkMode
                      ? 'linear-gradient(45deg, #667eea, #764ba2)'
                      : 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  نسيت كلمة المرور؟
                </Typography>
              </Zoom>

              <Fade in timeout={1400}>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666', mb: 3 }}>
                  أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
                </Typography>
              </Fade>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Email Field */}
              <Slide direction="right" in timeout={600}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="البريد الإلكتروني"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: darkMode
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(255, 255, 255, 0.8)',
                      color: darkMode ? '#fff' : '#333',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: darkMode
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                        boxShadow: darkMode
                          ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                          : '0 4px 20px rgba(102, 126, 234, 0.2)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: darkMode
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'rgba(255, 255, 255, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: darkMode
                          ? '0 4px 20px rgba(102, 126, 234, 0.4)'
                          : '0 4px 20px rgba(102, 126, 234, 0.3)',
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: darkMode ? '#667eea' : '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Slide>

              {/* Success/Alert Messages */}
              {message && (
                <Fade in timeout={300}>
                  <Box sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: darkMode
                      ? 'rgba(76, 175, 80, 0.2)'
                      : 'rgba(76, 175, 80, 0.1)',
                    borderRadius: 2,
                    border: darkMode
                      ? '1px solid rgba(76, 175, 80, 0.4)'
                      : '1px solid rgba(76, 175, 80, 0.3)'
                  }}>
                    <Typography color="success" variant="body2" sx={{ textAlign: 'center' }}>
                      {message}
                    </Typography>
                  </Box>
                </Fade>
              )}

              {error && (
                <Fade in timeout={300}>
                  <Box sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: darkMode
                      ? 'rgba(244, 67, 54, 0.2)'
                      : 'rgba(244, 67, 54, 0.1)',
                    borderRadius: 2,
                    border: darkMode
                      ? '1px solid rgba(244, 67, 54, 0.4)'
                      : '1px solid rgba(244, 67, 54, 0.3)'
                  }}>
                    <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
                      {error}
                    </Typography>
                  </Box>
                </Fade>
              )}

              {/* Submit Button */}
              <Zoom in timeout={1000}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForward />}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    boxShadow: darkMode
                      ? '0 4px 20px rgba(102, 126, 234, 0.4)'
                      : '0 4px 20px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                      transform: 'translateY(-2px)',
                      boxShadow: darkMode
                        ? '0 6px 30px rgba(102, 126, 234, 0.5)'
                        : '0 6px 30px rgba(102, 126, 234, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                    }
                  }}
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال الرابط'}
                </Button>
              </Zoom>

              {/* Back to Login Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                  تذكرت كلمة المرور؟
                  <RouterLink
                    to="/login"
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#667eea',
                      textDecoration: 'none',
                      mx: 1,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    العودة لتسجيل الدخول
                  </RouterLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default ForgotPassword;