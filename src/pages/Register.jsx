import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Avatar,
  IconButton,
  Tooltip,
  Autocomplete,
  InputAdornment,
  Paper,
  Fade,
  Slide,
  Zoom,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { t } from "../i18n";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from "../context/ThemeContext";
import {
  LockOutlined,
  EmailOutlined,
  Person,
  Phone,
  LocationCity,
  HowToReg,
  RocketLaunch,
  Star,
  Security,
  ArrowForward
} from '@mui/icons-material';

// Get current language
const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};

// Multilingual fallback data for provinces and cities
const PROVINCE_FALLBACKS = [
  { provinceId: 'p-baghdad', nameAr: 'بغداد', nameEn: 'Baghdad' },
  { provinceId: 'p-basra', nameAr: 'البصرة', nameEn: 'Basra' },
  { provinceId: 'p-ninawa', nameAr: 'نينوى', nameEn: 'Nineveh' },
  { provinceId: 'p-erbil', nameAr: 'أربيل', nameEn: 'Erbil' },
];

const CITY_FALLBACKS = {
  'p-baghdad': {
    ar: ['بغداد', 'الكرخ', 'الرصافة'],
    en: ['Baghdad', 'Karkh', 'Rusafa']
  },
  'بغداد': {
    ar: ['بغداد', 'الكرخ', 'الرصافة'],
    en: ['Baghdad', 'Karkh', 'Rusafa']
  },
  'p-basra': {
    ar: ['البصرة', 'القرنة', 'الفاو'],
    en: ['Basra', 'Al-Qurna', 'Al-Faw']
  },
  'البصرة': {
    ar: ['البصرة', 'القرنة', 'الفاو'],
    en: ['Basra', 'Al-Qurna', 'Al-Faw']
  },
  'p-ninawa': {
    ar: ['الموصل', 'تلكيف', 'بعشيقة'],
    en: ['Mosul', 'Tallkayf', 'Bashiqa']
  },
  'نينوى': {
    ar: ['الموصل', 'تلكيف', 'بعشيقة'],
    en: ['Mosul', 'Tallkayf', 'Bashiqa']
  },
  'p-erbil': {
    ar: ['أربيل', 'شقلاوة', 'صلاح الدين'],
    en: ['Erbil', 'Shaqlawa', 'Salah ad Din']
  },
  'أربيل': {
    ar: ['أربيل', 'شقلاوة', 'صلاح الدين'],
    en: ['Erbil', 'Shaqlawa', 'Salah ad Din']
  },
};
export default function Register() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    avatar: "",
    userType: "both",
    province: "",
    city: "",
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityInput, setCityInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear general error when user makes changes
    if (error) {
      setError('');
    }
  };

  // load provinces list
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const res = await axiosInstance.get('/provinces');
        const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        setProvinces(list);
      } catch (error) {


        setProvinces(PROVINCE_FALLBACKS);
      }
    };
    loadProvinces();
  }, []);
  const loadCities = async () => {

    setCities([]);
    setCityInput('');


    if (!formData.province) return;

    try {
      const res = await axiosInstance.get(`/provinces/${formData.province}/cities`);

      // 3. التأكد من البيانات القادمة (أحياناً تكون داخل data أو مصفوفة مباشرة)
      const list = Array.isArray(res) ? res : (res.data || []);

      setCities(list);

    } catch (error) {

      const currentLang = getCurrentLang();
      const key = String(formData.province);
      const fb = CITY_FALLBACKS[key] || CITY_FALLBACKS[key.replace(/^p-/, '')] || [];
      const citiesList = fb[currentLang] || fb.ar || [];
      setCities(citiesList.map((n, i) => ({
        id: i + 1,
        nameAr: currentLang === 'ar' ? n : (fb.en?.[i] || n),
        nameEn: currentLang === 'en' ? n : (fb.ar?.[i] || n)
      })));
    }
  };


  useEffect(() => {
    loadCities();
  }, [formData.province]);


  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setAvatarFile(f || null);

    setFormData((prev) => ({ ...prev, avatar: f ? f.name : '' }));
  };


  useEffect(() => {
    if (!avatarFile) { setAvatarPreview(null); return; }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => { URL.revokeObjectURL(url); setAvatarPreview(null); };
  }, [avatarFile]);

  const handleRemoveAvatar = () => {
    if (avatarPreview) {
      try { URL.revokeObjectURL(avatarPreview); } catch (_) { }
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData((prev) => ({ ...prev, avatar: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const errors = {};
    const trim = (v) => (typeof v === 'string' ? v.trim() : v);
    if (!trim(formData.username) || trim(formData.username).length < 3) errors.username = t('username_min_3') || 'Username must be at least 3 characters';
    if (!trim(formData.fullName) || trim(formData.fullName).length < 2) errors.fullName = t('fullname_min_2') || 'Full name must be at least 2 characters';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trim(formData.email || ''))) errors.email = t('invalid_email') || 'Invalid email address';

    const phoneRegex = /^07\d{9}$/;
    if (!phoneRegex.test(trim(formData.phone || ''))) errors.phone = 'رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07';
    if (!formData.password || String(formData.password).length < 6) errors.password = t('password_min_6') || 'Password must be at least 6 characters';

    if (!agreeToTerms) {
      setError(t('must_agree_to_terms') || 'يجب الموافقة على الشروط والأحكام للمتابعة');
      setLoading(false);
      return;
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError(t('please_fix_errors') || 'Please fix the errors above');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: String(trim(formData.username || '')),
        fullName: String(trim(formData.fullName || '')),
        email: String(trim(formData.email || '')),
        phone: String(trim(formData.phone || '')),
        password: String(formData.password || ''),
        userType: formData.userType || 'both',
        province_id: Number(formData.province),
        city_id: formData.city ? Number(formData.city) : 1
      };

      const response = await axiosInstance.post('/auth/register', payload);
      localStorage.setItem('pendingEmail', formData.email);

      let userData = response?.data?.user || response?.data?.data || response?.data;

      if (avatarFile && userData && (userData.userId || userData.id)) {
        const userId = userData.userId || userData.id;
        const fd = new FormData();
        fd.append('avatar', avatarFile);

        try {
          const avatarRes = await axiosInstance.post(`/users/${userId}/avatar`, fd);
          if (avatarRes?.data?.avatar) {
            userData.profileImage = avatarRes.data.avatar;
            userData.avatar = avatarRes.data.avatar;
          }
        } catch (e) {



          await new Promise((resolve) => {
            const dbRequest = indexedDB.open("AvatarDB", 1);
            dbRequest.onupgradeneeded = (event) => {
              const db = event.target.result;
              if (!db.objectStoreNames.contains("images")) {
                db.createObjectStore("images");
              }
            };
            dbRequest.onsuccess = (event) => {
              const db = event.target.result;
              try {
                const transaction = db.transaction("images", "readwrite");
                const store = transaction.objectStore("images");
                const putRequest = store.put(avatarFile, "pendingAvatar");

                putRequest.onsuccess = () => {

                  resolve();
                };
                putRequest.onerror = () => resolve();
              } catch { resolve(); }
            };
            dbRequest.onerror = () => resolve();
          });
        }
      }

      if (userData) {
        try {
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userType', 'both');
        } catch (e) { }
      }

      setError("");
      setSuccess(t('register_title'));
      navigate('/verify-code', { state: { email: formData.email } });

    } catch (err) {
      setSuccess("");
      console.error('Register error:', err);
      const resp = err?.response;
      if (resp) {
        const srv = resp.data || {};
        let errorMessage = srv.message || srv.error || t('register_error');
        if (Array.isArray(srv.message)) errorMessage = srv.message.join(' - ');
        setError(errorMessage);
      } else {
        setError(err?.message || t('register_error'));
      }
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


      <Box sx={{ position: 'absolute', top: '10%', left: '10%', animation: 'float 6s ease-in-out infinite' }}>
        <Star sx={{ fontSize: 30, color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '20%', right: '15%', animation: 'float 8s ease-in-out infinite 1s' }}>
        <Star sx={{ fontSize: 25, color: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.15)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '20%', left: '15%', animation: 'float 7s ease-in-out infinite 0.5s' }}>
        <Star sx={{ fontSize: 28, color: darkMode ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.18)' }} />
      </Box>


      <Box sx={{ position: 'absolute', top: '30%', right: '10%', animation: 'float 9s ease-in-out infinite 2s' }}>
        <Star sx={{ fontSize: 20, color: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.12)' }} />
      </Box>
      <Box sx={{ position: 'absolute', bottom: '30%', right: '20%', animation: 'float 5s ease-in-out infinite 1.5s' }}>
        <Star sx={{ fontSize: 24, color: darkMode ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.15)' }} />
      </Box>
      <Box sx={{ position: 'absolute', top: '60%', left: '8%', animation: 'float 8s ease-in-out infinite 0.8s' }}>
        <Star sx={{ fontSize: 22, color: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.16)' }} />
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 0 }}>
        <Slide direction="down" in timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              p: 6,
              borderRadius: 9,
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
                  {t('register_title')}
                </Typography>
              </Zoom>

              <Fade in timeout={1400}>
                <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666', mb: 3 }}>
                  {t('register_subtitle')}
                </Typography>
              </Fade>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <Slide direction="right" in timeout={600}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, gap: 2 }}>
                  <Tooltip title={t('register_avatar') || 'صورة البروفايل'}>
                    <IconButton
                      onClick={() => document.getElementById('register-avatar-input')?.click()}
                      sx={{
                        p: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: darkMode
                            ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                            : '0 4px 20px rgba(102, 126, 234, 0.2)',
                        }
                      }}
                    >
                      <Avatar
                        src={avatarPreview || undefined}
                        sx={{
                          width: 80,
                          height: 80,
                          border: darkMode ? '2px solid rgba(102, 126, 234, 0.3)' : '2px solid rgba(102, 126, 234, 0.2)'
                        }}
                      >
                        {String(formData.fullName || formData.username || 'U').charAt(0)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: darkMode ? '#f5f5f5' : '#666', mb: 1 }}>
                      {t('register_avatar') || 'اختر صورة البروفايل'}
                    </Typography>
                    <input
                      id="register-avatar-input"
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                    {avatarPreview && (
                      <Button
                        size="small"
                        color="secondary"
                        onClick={handleRemoveAvatar}
                        sx={{
                          fontSize: '0.75rem',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        {t('remove') || 'إلغاء'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Slide>

              {/* Username Field */}
              <Slide direction="left" in timeout={700}>
                <TextField
                  maxLength={5}
                  required
                  id="username"
                  type="text"
                  fullWidth
                  label={t('register_username')}
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2,
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
                        <Person sx={{ color: darkMode ? '#fbfcff' : '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username || ''}
                />
              </Slide>

              {/* Full Name Field */}
              <Slide direction="right" in timeout={800}>
                <TextField
                  fullWidth
                  label={t('register_full_name')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2,
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
                  error={!!fieldErrors.fullName}
                  helperText={fieldErrors.fullName || ''}
                />
              </Slide>

              {/* Email Field */}
              <Slide direction="left" in timeout={900}>
                <TextField
                  fullWidth
                  label={t('register_email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2,
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
                        <EmailOutlined sx={{ color: darkMode ? '#f7f7f7' : '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email || ''}
                />
              </Slide>

              {/* Phone Field */}
              <Slide direction="right" in timeout={1000}>
                <TextField
                  fullWidth
                  label={t('register_phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ maxLength: 11 }}
                  placeholder="07xxxxxxxxx"
                  sx={{
                    mb: 2,
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
                        <Phone sx={{ color: darkMode ? '#ececec' : '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!fieldErrors.phone}
                  helperText={fieldErrors.phone || ''}
                />
              </Slide>

              {/* Password Field */}
              <Slide direction="left" in timeout={1100}>
                <TextField
                  fullWidth
                  label={t('register_password')}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    mb: 2,
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
                        <LockOutlined sx={{ color: darkMode ? '#e7e7e7' : '#667eea' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label="toggle password visibility"
                          sx={{ color: darkMode ? '#dbdbdb' : '#667eea' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password || ''}
                />
              </Slide>

              {/* Province Field */}
              <Slide direction="right" in timeout={1200}>
                <TextField
                  select
                  fullWidth
                  label={t('province')}
                  name="province"
                  value={formData.province}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, province: e.target.value, city: '' }));
                  }}
                  variant="outlined"
                  sx={{
                    mb: 2,
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
                        <LocationCity sx={{ color: darkMode ? '#ffffff' : '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="">{t('all_provinces')}</MenuItem>
                  {provinces.map((p) => (
                    <MenuItem key={p.provinceId || p.id || p.slug} value={p.provinceId || p.id || p.slug}>
                      {getCurrentLang() === 'ar' ? (p.nameAr || p.name) : (p.nameEn || p.name || p.nameAr)}
                    </MenuItem>
                  ))}
                </TextField>
              </Slide>

              {/* City Field */}
              <Slide direction="left" in timeout={1300}>
                <TextField
                  select
                  fullWidth
                  label={t('city')}
                  value={formData.city || ''}
                  onChange={(e) => {

                    setFormData((prev) => ({ ...prev, city: e.target.value }));
                  }}
                  variant="outlined"
                  disabled={!formData.province}
                  helperText={!formData.province ? t('select_province_first') : cities.length === 0 ? t('no_cities_available') : ""}
                  sx={{
                    mb: 2,
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
                        <LocationCity sx={{ color: darkMode ? '#e2e2e2' : '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="" disabled>
                    {formData.province ? t('select_city') : t('select_province_first')}
                  </MenuItem>
                  {cities.map((city, index) => {
                    const cityName = getCurrentLang() === 'ar'
                      ? (city?.nameAr || city?.name || String(city))
                      : (city?.nameEn || city?.name || city?.nameAr || String(city));
                    return (
                      <MenuItem key={`${cityName}-${index}`} value={cityName}>
                        {cityName}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Slide>

              {/* Error/Success Messages */}
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

              {success && (
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
                      {success}
                    </Typography>
                  </Box>
                </Fade>
              )}

              {/* Register Button */}
              <Zoom in timeout={1400}>
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
                  {loading ? 'جاري التسجيل...' : t('register_title')}
                </Button>
              </Zoom>

              {/* Terms and Conditions Checkbox */}
              <Slide direction="up" in timeout={1400}>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        color="primary"
                        sx={{
                          '&.Mui-checked': {
                            color: '#667eea',
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: darkMode ? '#aaa' : '#666' }}>
                        {t('agree_to_terms')}
                        <RouterLink
                          to="/terms"
                          target="_blank"
                          sx={{
                            mx: 1,
                            color: '#dadbdd',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: '#667eea',
                              textDecorationColor: '#667eea',
                            }
                          }}
                        >
                          {t('terms_and_conditions')}
                        </RouterLink>
                        {getCurrentLang() === 'ar' ? 'و' : 'and'}
                        <RouterLink
                          to="/privacy"
                          target="_blank"
                          sx={{
                            mx: 1,
                            color: '#eaeaeb',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                              textDecoration: 'underline',
                              color: '#667eea',
                              textDecorationColor: '#667eea',
                            }
                          }}
                        >
                          {t('privacy_policy')}
                        </RouterLink>
                      </Typography>
                    }
                  />
                </Box>
              </Slide>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: darkMode ? '#ffffff' : '#666' }}>
                  {t('already_have_account')}
                  <RouterLink
                    to="/login"
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#e9eaf0',
                      textDecoration: 'none',
                      mx: 1,
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#e9e9e9',
                        textDecorationColor: '#667eea',
                      }
                    }}
                  >
                    {t('login')}
                  </RouterLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}