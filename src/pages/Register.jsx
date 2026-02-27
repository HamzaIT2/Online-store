import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Avatar, IconButton, Tooltip, Autocomplete, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser, loginUser } from "../api/authAPI";
import { t } from "../i18n";
import axiosInstance from "../api/axiosInstance";
import Divider from "@mui/material/Divider";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // load provinces list
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const res = await axiosInstance.get('/provinces');
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
        setProvinces(list);
      } catch (error) {
        console.log('Error provinces', error);
        // Use fallback data with multilingual support
        setProvinces(PROVINCE_FALLBACKS);
      }
    };
    loadProvinces();
  }, []);
  useEffect(() => {
    const loadCities = async () => {
      // 1. تنظيف القائمة القديمة
      setCities([]);
      setCityInput('');

      // 2. إذا لم يختر المستخدم محافظة، لا تفعل شيئاً
      if (!formData.province) return;

      try {
        console.log("Fetching cities for province:", formData.province);

        // ✅ التصحيح هنا: نستخدم الرابط الذي طابقناه مع الباك إند مباشرة
        // /provinces/ + رقم المحافظة + /cities
        const res = await axiosInstance.get(`/provinces/${formData.province}/cities`);

        // 3. التأكد من البيانات القادمة (أحياناً تكون داخل data أو مصفوفة مباشرة)
        const list = Array.isArray(res.data) ? res.data : (res.data.data || []);

        setCities(list);

      } catch (error) {
        console.error("فشل تحميل المدن، جاري استخدام القائمة الاحتياطية", error);

        // Use fallback data with multilingual support
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

    loadCities();
  }, [formData.province]); // load cities when province changes

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Trigger re-render to update displayed content
      setFormData(prev => ({ ...prev }));
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);


  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setAvatarFile(f || null);
    // keep avatar text field for backward compatibility (stores filename)
    setFormData((prev) => ({ ...prev, avatar: f ? f.name : '' }));
  };

  // create preview URL when file changes
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
    // client-side validation
    const errors = {};
    const trim = (v) => (typeof v === 'string' ? v.trim() : v);
    if (!trim(formData.username) || trim(formData.username).length < 3) errors.username = t('username_min_3') || 'Username must be at least 3 characters';
    if (!trim(formData.fullName) || trim(formData.fullName).length < 2) errors.fullName = t('fullname_min_2') || 'Full name must be at least 2 characters';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trim(formData.email || ''))) errors.email = t('invalid_email') || 'Invalid email address';
    if (!trim(formData.phone) || trim(formData.phone).length < 10) errors.phone = t('phone_min_10') || 'Phone must be at least 10 characters';
    if (!formData.password || String(formData.password).length < 6) errors.password = t('password_min_6') || 'Password must be at least 6 characters';
    // province/city not required strictly, but validate basic types if provided
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError(t('please_fix_errors') || 'Please fix the errors above');
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
      console.log('Register payload (prepared):', payload, 'avatarFile?', !!avatarFile);
      
      const response = await axios.post('http://localhost:3000/api/v1/auth/register', payload);

      console.log('نجاح التسجيل:', response.data);

      navigate('/verify-code', { state: { email: formData.email } });
      // Always create user with JSON payload first (more compatible)
      const createRes = await registerUser(payload);
      // If server returned a token, store it (some APIs return token on register)
      let returnedToken = createRes?.data?.token || createRes?.data?.accessToken || createRes?.data?.authToken;
      if (returnedToken) {
        try { localStorage.setItem('token', returnedToken); } catch (e) { /* ignore */ }
      }

      // If an avatar file is selected, upload it in a second request to common endpoints
      if (avatarFile) {
        const userId = createRes?.data?.user?.id || createRes?.data?.id || createRes?.data?.userId || createRes?.data?._id;
        const urlCandidates = [];
        if (userId) {
          urlCandidates.push(`/users/avatar/${userId}`);
          urlCandidates.push(`/users/${userId}/image`);
          urlCandidates.push(`/images/upload/user/${userId}`);
          urlCandidates.push(`/images/upload/${userId}`);
        }
        urlCandidates.push('/users/avatar');
        urlCandidates.push('/users/upload-avatar');
        urlCandidates.push('/users/avatar/upload');

        const fd = new FormData();
        fd.append('avatar', avatarFile);
        // try each candidate until one succeeds
        let uploaded = false;
        for (const candidate of urlCandidates) {
          try {
            console.log('Trying avatar upload to', candidate);
            const opts = {};
            // include token if we have it in localStorage
            const token = localStorage.getItem('token');
            if (token) opts.headers = { Authorization: `Bearer ${token}` };
            await axiosInstance.post(candidate, fd, opts);
            uploaded = true;
            console.log('Avatar uploaded to', candidate);
            break;
          } catch (e) {
            console.warn('Avatar upload failed for', candidate, e?.response?.status || e.message || e);
          }
        }
        if (!uploaded) {
          console.warn('Avatar upload failed for all candidate endpoints');
          // don't fail the whole registration; show a warning to user
          setError((prev) => (prev ? prev + ' | ' : '') + (t('avatar_upload_failed') || 'Avatar upload failed; please upload later'));
        }
      }
      setError("");
      setSuccess(t('register_title'));
      try { localStorage.setItem('userType', 'both'); } catch { }
      // If no token yet, try automatic login using provided credentials
      let tokenNow = returnedToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (!tokenNow) {
        try {
          // Try email/password first
          const lr1 = await loginUser({ email: String(formData.email || ''), password: String(formData.password || '') });
          returnedToken = lr1?.data?.token || lr1?.data?.accessToken || lr1?.data?.authToken;
          if (returnedToken) {
            try { localStorage.setItem('token', returnedToken); } catch { }
            tokenNow = returnedToken;
          }
        } catch { }
      }
      if (!tokenNow) {
        try {
          // Fallback: try username/password
          const lr2 = await loginUser({ username: String(formData.username || ''), password: String(formData.password || '') });
          returnedToken = lr2?.data?.token || lr2?.data?.accessToken || lr2?.data?.authToken;
          if (returnedToken) {
            try { localStorage.setItem('token', returnedToken); } catch { }
            tokenNow = returnedToken;
          }
        } catch { }
      }
      // If authenticated, send user straight to add-product so both buyer/seller can create a listing immediately
      setTimeout(() => (window.location.href = tokenNow ? "/add-product" : "/login"), 800);
    } catch (err) {
      setSuccess("");
      // Log detailed error for debugging
      console.error('Register error:', err);
      const resp = err?.response;
      if (resp) {
        console.error('Register response data:', resp.data, 'status:', resp.status, 'headers:', resp.headers);
        // Try to extract friendly message(s)
        const srv = resp.data || {};
        if (Array.isArray(srv.message)) {
          // join array of messages into readable text
          const joined = srv.message.map((m) => (typeof m === 'string' ? m : (m?.msg || JSON.stringify(m)))).join(' | ');
          setError(joined);
        } else {
          const serverMessage = srv.message || srv.error || resp.statusText || srv;
          try { setError(typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage)); } catch { setError(String(serverMessage)); }
        }
      } else {
        setError(err?.message || t('error_loading_product'));
      }
      
      // Enhanced error handling for better user experience
      const serverErrors = err.response?.data?.message;
      if (Array.isArray(serverErrors)) {
        const errorMessages = serverErrors.map(err => {
          if (typeof err === 'string') return err;
          if (typeof err === 'object') return err.message || err.msg || JSON.stringify(err);
          return String(err);
        });
        setError(errorMessages.join(' - ')); // سيظهر لك مثلاً: "email must be an email - password is too short"
      } else {
        setError(serverErrors?.message || 'حدث خطأ أثناء التسجيل');
      }
      console.error('تفاصيل الخطأ:', err.response?.data);
    } finally {
      setLoading(false);
    }
    
  };

  return (
  <Container maxWidth="xs" sx={{ mt: 10, boxShadow: 20, border: 1, borderRadius: 8, p: 2 }}>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
      {t('register_title')}
    </Typography>

    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, direction: 'rtl' }}>
        <Tooltip title={t('register_avatar') || 'صورة البروفايل'}>
          <IconButton onClick={() => document.getElementById('register-avatar-input')?.click()} sx={{ p: 0 }}>
            <Avatar src={avatarPreview || undefined} sx={{ width: 84, height: 84 }}>
              {String(formData.fullName || formData.username || 'U').charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {t('register_avatar') || 'اختر صورة البروفايل'}
          </Typography>
          <input id="register-avatar-input" hidden accept="image/*" type="file" onChange={handleFileChange} />
          {avatarPreview && (
            <Button size="small" color="secondary" onClick={handleRemoveAvatar} sx={{ mt: 1 }}>{t('remove') || 'إلغاء'}</Button>
          )}
        </Box>
      </Box>


      <Divider sx={{ my: 1, fontSize: 16 }}>Aldawaar</Divider>


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
        sx={{ mb: 2, borderRadius: 2, border: 1 }}
        error={!!fieldErrors.username}
        helperText={fieldErrors.username || ''}
      />

      <TextField fullWidth
        label={t('register_full_name')}
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        sx={{ mb: 2, borderRadius: 2, border: 1 }}
        error={!!fieldErrors.fullName}
        helperText={fieldErrors.fullName || ''}

      />

      <TextField
        fullWidth
        label={t('register_email')}
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 2, borderRadius: 2, border: 1 }}
        error={!!fieldErrors.email}
        helperText={fieldErrors.email || ''}

      />
      <TextField
        fullWidth
        label={t('register_phone')}
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        sx={{ mb: 2, borderRadius: 2, border: 1 }}
        error={!!fieldErrors.phone}
        helperText={fieldErrors.phone || ''}

      />
      <TextField
        fullWidth
        label={t('register_password')}
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 2, borderRadius: 2, border: 1 }}
        error={!!fieldErrors.password}
        helperText={fieldErrors.password || ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" aria-label="toggle password visibility">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        fullWidth
        label={t('province')}
        name="province"
        value={formData.province}
        onChange={(e) => {
          setFormData((prev) => ({ ...prev, province: e.target.value, city: '' }));
        }}
        sx={{ mb: 2, borderRadius: 2, border: 1 }}
      >
        <MenuItem value="">{t('all_provinces')}</MenuItem>
        {provinces.map((p) => (
          <MenuItem key={p.provinceId || p.id || p.slug} value={p.provinceId || p.id || p.slug}>
            {getCurrentLang() === 'ar' ? (p.nameAr || p.name) : (p.nameEn || p.name || p.nameAr)}
          </MenuItem>
        ))}
      </TextField>

      <Autocomplete
        disableClearable={false}
        options={(cities || []).map((c) => getCurrentLang() === 'ar' ? (c?.nameAr || c?.name || String(c)) : (c?.nameEn || c?.name || c?.nameAr || String(c)))}
        value={formData.city || ''}
        onChange={(_, newValue) => {
          const v = typeof newValue === 'string' ? newValue : '';
          setFormData((prev) => ({ ...prev, city: v }));
        }}
        renderInput={(params) => (
          <TextField {...params} fullWidth label={t('city')} sx={{ mb: 2, borderRadius: 2, border: 1 }} disabled={!formData.province} />
        )}
      />


      {/* userType is fixed to both; no UI selection */}

      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}

      <Button type="submit" variant="contained" fullWidth>
        {t('register_title')}
      </Button>
    </Box>
  </Container>
);
}