import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Paper,
  Avatar,
  Fade,
  Slide,
  Zoom,
  Backdrop,
  Grid,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import LoginIcon from '@mui/icons-material/Login';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { t } from "../i18n";
import PasswordIcon from '@mui/icons-material/PasswordOutlined';
import { useSignIn } from "@clerk/clerk-react";
import axiosInstance from "../api/axiosInstance";
import { useTheme } from "../context/ThemeContext";
import {
  LockOutlined,
  EmailOutlined,
  RocketLaunch,
  Star,
  HowToReg,
  ArrowForward,
  Security,
  Speed
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, isLoaded } = useSignIn();
  const { darkMode } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSocialLogin = async (strategy) => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("OAuth Error:", err);
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("fill_all_fields") || "Please fill all fields");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });

      // --- حالة النجاح (الحساب مفعل) ---
      console.log("✅ Login Successful:", res.data);

      const userData = res.data.user || res.data.data?.user || res.data;
      const token = res.data.token || res.data.accessToken;

      // التحقق من الموافقة على الشروط والأحكام
      if (!userData.termsAccepted) {
        userData.termsAccepted = false; // تأكد من وجود الحقل
      }

      localStorage.setItem("token", token);
      const finalUserId = userData.id || userData._id || userData.userId
      localStorage.setItem("userId", finalUserId);
      localStorage.setItem("userType", userData?.type || "buyer");
      localStorage.setItem("userName", userData?.name);
      localStorage.setItem("user", JSON.stringify(userData))
      window.dispatchEvent(new Event("storage"));
      navigate("/");

    } catch (err) {
      // --- حالة الفشل (Catch Block) ---
      console.log("❌ Login Failed. Error Details below:");

      // طباعة تفاصيل الخطأ القادم من السيرفر لمعرفة ماذا يصلنا بالضبط
      if (err.response) {
        console.log("🔹 Status Code:", err.response.status);
        console.log("🔹 Server Data:", err.response.data);
        console.log("🔹 Server Message:", err.response.data.message);
      }

      // استخراج الرسالة بدقة
      const serverMsg = err.response?.data?.message;

      // 🛑 الشرط: فحص دقيق للرسالة كما رأيناها في الباك اند
      if (serverMsg === 'PENDING_VERIFICATION') {

        console.log("⚠️ Account needs verification. Redirecting to /verify-code now...");

        localStorage.setItem('pendingEmail', email); // حفظ الإيميل
        navigate('/verify-code'); // توجيه لصفحة الكود
        return; // إنهاء الدالة هنا
      }

      // محاولة أخرى: ربما الرسالة بأحرف صغيرة؟
      if (serverMsg && serverMsg.toString().toLowerCase().includes('pending_verification')) {
        console.log("⚠️ Account needs verification (lowercase match). Redirecting...");
        localStorage.setItem('pendingEmail', email);
        navigate('/verify-code');
        return;
      }

      // إذا لم يكن خطأ تفعيل، نعرض رسالة الخطأ العادية
      const displayMsg = err.response?.data?.message || err.message || "Login failed";
      setError(t("login_failed") || displayMsg);
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
        paddingTop: '80px', // إضافة مساحة معتدلة للناف بار
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
                    bgcolor: darkMode
                      ? 'linear-gradient(45deg, #667eea, #764ba2)'
                      : 'linear-gradient(45deg, #667eea, #764ba2)',
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
                  <RocketLaunch sx={{ fontSize: 40 }} />
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
                  {t('login_title')}
                </Typography>
              </Zoom>

              <Fade in timeout={1400}>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666', mb: 3 }}>
                  أهلاً بعودتك! سجل دخولك لتبدأ رحلتك
                </Typography>
              </Fade>
            </Box>

            <Box component="form" onSubmit={handleLogin}>
              {/* Email Field */}
              <Slide direction="right" in timeout={600}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    id="email"
                    type="email"
                    required
                    fullWidth
                    placeholder={t('login_email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    sx={{
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
                </Box>
              </Slide>

              {/* Password Field */}
              <Slide direction="left" in timeout={800}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    required
                    fullWidth
                    variant="outlined"
                    placeholder={t('login_password')}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={password.length > 0 && password.length < 6}
                    sx={{
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
                          <LockOutlined sx={{ color: darkMode ? '#667eea' : '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((v) => !v)}
                            edge="end"
                            aria-label="toggle password visibility"
                            sx={{ color: darkMode ? '#667eea' : '#667eea' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Slide>

              {/* Error Message */}
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

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'left', mb: 3 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                  {t('new_reg4')}
                  <Link
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#667eea',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {t('new_reg3')}
                  </Link>
                </Typography>
              </Box>

              {/* Login Button */}
              <Zoom in timeout={1000}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForward />}
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
                  {t('login_submit')}
                </Button>
              </Zoom>

              {/* Divider */}
              <Box sx={{ my: 4, position: 'relative' }}>
                <Divider>
                  <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666', px: 2 }}>
                    أو
                  </Typography>
                </Divider>
              </Box>

              {/* Social Login Buttons */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Slide direction="up" in timeout={1100}>
                    <Button
                      type="button"
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSocialLogin('oauth_google')}
                      startIcon={<GoogleIcon />}
                      sx={{
                        py: 1.2,
                        borderRadius: 3,
                        borderColor: darkMode ? '#444' : '#e0e0e0',
                        color: darkMode ? '#fff' : '#666',
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.1)'
                            : '#f8f9fa',
                          borderColor: '#667eea',
                          transform: 'translateY(-2px)',
                          boxShadow: darkMode
                            ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                            : '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      {t('sign_in_with_google')}
                    </Button>
                  </Slide>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Slide direction="up" in timeout={1200}>
                    <Button
                      type="button"
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSocialLogin('oauth_facebook')}
                      startIcon={<FacebookIcon />}
                      sx={{
                        py: 1.2,
                        borderRadius: 3,
                        borderColor: darkMode ? '#444' : '#e0e0e0',
                        color: darkMode ? '#fff' : '#666',
                        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: darkMode
                            ? 'rgba(255, 255, 255, 0.1)'
                            : '#f8f9fa',
                          borderColor: '#667eea',
                          transform: 'translateY(-2px)',
                          boxShadow: darkMode
                            ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                            : '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      {t('sign_in_with_facebook')}
                    </Button>
                  </Slide>
                </Grid>
              </Grid>

              {/* Register Link */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                  {t('new_reg')}
                  <Link
                    component={RouterLink}
                    to="/register"
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
                    {t('new_reg1')}
                  </Link>
                  <HowToReg sx={{ fontSize: 16, verticalAlign: 'middle', color: '#667eea' }} />
                </Typography>
              </Box>

              {/* Security Badge */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Fade in timeout={1500}>
                  <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: darkMode
                      ? 'rgba(102, 126, 234, 0.2)'
                      : 'rgba(102, 126, 234, 0.1)',
                    borderRadius: 2
                  }}>
                    <Security sx={{ fontSize: 16, color: '#667eea' }} />
                    <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 500 }}>
                      اتصال آمن ومشفر
                    </Typography>
                  </Box>
                </Fade>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}
