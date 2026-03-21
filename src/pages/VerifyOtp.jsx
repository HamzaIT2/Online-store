import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Fade,
    Slide,
    Zoom,
    InputAdornment,
    Alert
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { t, getCurrentLang } from '../i18n';
import axiosInstance from "../api/axiosInstance";
import {
    EmailOutlined,
    VerifiedUser,
    Timer,
    Refresh
} from '@mui/icons-material';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // استلام الإيميل
    const [email, setEmail] = useState(location.state?.email || '');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Track mouse movement
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // تشغيل العداد التنازلي
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const storedEmail = localStorage.getItem('pendingEmail');

        if (!storedEmail) {
            setError(t('no_email_found') || "لا يوجد بريد إلكتروني، يرجى إعادة تسجيل الدخول.");
            setLoading(false);
            return;
        }

        if (code.length < 6) {
            setError(t('enter_full_code') || "يرجى إدخال الرمز كاملاً.");
            setLoading(false);
            return;
        }

        try {
            const res = await axiosInstance.post('/auth/verify-email', {
                email: storedEmail,
                code: code
            });

            if (res.token) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', JSON.stringify(res.user));
            }

            localStorage.removeItem('pendingEmail');

            // Success message and redirect
            setTimeout(() => {
                navigate('/home');
            }, 1000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || t('invalid_code') || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const emailToUse = location.state?.email || localStorage.getItem('pendingEmail');

            if (!emailToUse) {
                setError(t('email_not_found') || "Email not found. Please login again.");
                return;
            }

            await axiosInstance.post('/auth/resend-code', {
                email: emailToUse
            });

            setTimer(60);
            setCanResend(false);

        } catch (err) {
            console.error("Resend Error:", err);
            setError(err.response?.data?.message || t('resend_failed') || 'فشل في إعادة إرسال الرمز');
        }
    };

    const currentLang = getCurrentLang();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                paddingTop: '80px',
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
            {/* Interactive Mouse Follower */}
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
                            }
                        }}
                    >
                        {/* Header Section */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Fade in timeout={1000}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: 'linear-gradient(45deg, #667eea, #764ba2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                        boxShadow: darkMode
                                            ? '0 8px 32px rgba(102, 126, 234, 0.4)'
                                            : '0 8px 32px rgba(102, 126, 234, 0.3)',
                                        animation: 'pulse 2s ease-in-out infinite',
                                    }}
                                >
                                    <VerifiedUser sx={{ fontSize: 40, color: '#fff' }} />
                                </Box>
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
                                    {currentLang === 'ar' ? 'تحقق من الإيميل' : 'Email Verification'}
                                </Typography>
                            </Zoom>

                            <Fade in timeout={1400}>
                                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666', mb: 3 }}>
                                    {currentLang === 'ar'
                                        ? 'أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني'
                                        : 'Enter the 6-digit code sent to your email'
                                    }
                                </Typography>
                            </Fade>

                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                                border: `1px solid ${darkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                                mb: 3
                            }}>
                                <Typography variant="body2" sx={{
                                    color: darkMode ? '#667eea' : '#667eea',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1
                                }}>
                                    <EmailOutlined fontSize="small" />
                                    {email || localStorage.getItem('pendingEmail')}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Error Message */}
                        {error && (
                            <Fade in timeout={300}>
                                <Alert
                                    severity="error"
                                    sx={{
                                        mb: 3,
                                        borderRadius: 2,
                                        '& .MuiAlert-message': {
                                            textAlign: 'center'
                                        }
                                    }}
                                >
                                    {error}
                                </Alert>
                            </Fade>
                        )}

                        {/* Verification Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            <Slide direction="right" in timeout={600}>
                                <TextField
                                    fullWidth
                                    label={currentLang === 'ar' ? 'رمز التحقق' : 'Verification Code'}
                                    value={code}
                                    onChange={handleChange}
                                    variant="outlined"
                                    inputProps={{
                                        maxLength: 6,
                                        style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }
                                    }}
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
                                                <VerifiedUser sx={{ color: darkMode ? '#667eea' : '#667eea' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    error={!!error}
                                />
                            </Slide>

                            <Slide direction="left" in timeout={800}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    disabled={loading || code.length < 6}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                                            transform: 'translateY(-2px)',
                                            boxShadow: darkMode
                                                ? '0 8px 25px rgba(102, 126, 234, 0.4)'
                                                : '0 8px 25px rgba(102, 126, 234, 0.3)',
                                        },
                                        '&:disabled': {
                                            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                                            color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                                        }
                                    }}
                                >
                                    {loading
                                        ? (currentLang === 'ar' ? 'جاري التحقق...' : 'Verifying...')
                                        : (currentLang === 'ar' ? 'تفعيل الحساب' : 'Activate Account')
                                    }
                                </Button>
                            </Slide>
                        </Box>

                        {/* Resend Section */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Fade in timeout={1000}>
                                <Typography variant="body2" sx={{
                                    color: darkMode ? '#aaa' : '#666',
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1
                                }}>
                                    <Timer fontSize="small" />
                                    {currentLang === 'ar' ? 'لم يصلك الرمز؟' : "Didn't receive the code?"}
                                </Typography>
                            </Fade>

                            <Slide direction="up" in timeout={1200}>
                                <Button
                                    disabled={!canResend}
                                    onClick={handleResend}
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    sx={{
                                        borderRadius: 3,
                                        borderColor: darkMode ? '#667eea' : '#667eea',
                                        color: darkMode ? '#667eea' : '#667eea',
                                        '&:hover': {
                                            borderColor: darkMode ? '#764ba2' : '#764ba2',
                                            backgroundColor: darkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)',
                                            transform: 'translateY(-2px)',
                                        },
                                        '&:disabled': {
                                            borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                            color: darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                                        }
                                    }}
                                >
                                    {canResend
                                        ? (currentLang === 'ar' ? 'إعادة إرسال الرمز' : 'Resend Code')
                                        : (currentLang === 'ar' ? `إعادة الإرسال بعد ${timer} ثانية` : `Resend in ${timer}s`)
                                    }
                                </Button>
                            </Slide>
                        </Box>
                    </Paper>
                </Slide>
            </Container>
        </Box>
    );
};

export default VerifyOtp;