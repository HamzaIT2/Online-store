import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography, Box, MenuItem, Avatar, IconButton, Tooltip, Autocomplete, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { registerUser, loginUser } from "../api/authAPI";
import { t } from "../i18n";
import axiosInstance from "../api/axiosInstance";

export default function Register() {
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
  const CITY_FALLBACKS = {
    'p-baghdad': ['بغداد','الكرخ','الرصافة'],
    'بغداد': ['بغداد','الكرخ','الرصافة'],
    'p-basra': ['البصرة','القرنة','الفاو'],
    'البصرة': ['البصرة','القرنة','الفاو'],
    'p-ninawa': ['الموصل','تلكيف','بعشيقة'],
    'نينوى': ['الموصل','تلكيف','بعشيقة'],
    'p-erbil': ['أربيل','شقلاوة','صلاح الدين'],
    'أربيل': ['أربيل','شقلاوة','صلاح الدين'],
  };

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
      } catch (_) {
        setProvinces([
          { provinceId: 'p-baghdad', nameAr: 'بغداد' },
          { provinceId: 'p-basra', nameAr: 'البصرة' },
          { provinceId: 'p-ninawa', nameAr: 'نينوى' },
          { provinceId: 'p-erbil', nameAr: 'أربيل' },
        ]);
      }
    };
    loadProvinces();
  }, []);

  // load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      setCities([]);
      setCityInput('');
      if (!formData.province) return;
      try {
        // Try multiple param name variants commonly used by backends
        const paramVariants = [
          { province: formData.province },
          { provinceId: formData.province },
          { prov: formData.province },
          { pid: formData.province },
        ];
        let list = [];
        for (const pv of paramVariants) {
          try {
            const res = await axiosInstance.get('/cities', { params: pv });
            const arr = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.data) ? res.data.data : []);
            if (Array.isArray(arr) && arr.length) { list = arr; break; }
          } catch (e) { /* try next */ }
        }
        if (Array.isArray(list) && list.length) {
          setCities(list);
        } else {
          // Try alternative common endpoint pattern: /provinces/:id/cities
          try {
            const alt = await axiosInstance.get(`/provinces/${encodeURIComponent(formData.province)}/cities`);
            const altList = Array.isArray(alt?.data) ? alt.data : (Array.isArray(alt?.data?.data) ? alt.data.data : []);
            if (Array.isArray(altList) && altList.length) {
              setCities(altList);
            } else {
              const key = String(formData.province);
              const fb = CITY_FALLBACKS[key] || CITY_FALLBACKS[key.replace(/^p-/, '')] || [];
              setCities(fb.map((n, i) => ({ id: i+1, nameAr: n })));
            }
          } catch {
            const key = String(formData.province);
            const fb = CITY_FALLBACKS[key] || CITY_FALLBACKS[key.replace(/^p-/, '')] || [];
            setCities(fb.map((n, i) => ({ id: i+1, nameAr: n })));
          }
        }
      } catch (_) {
        const key = String(formData.province);
        const fb = CITY_FALLBACKS[key] || CITY_FALLBACKS[key.replace(/^p-/, '')] || [];
        setCities(fb.map((n, i) => ({ id: i+1, nameAr: n })));
      }
    };
    loadCities();
  }, [formData.province]);

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
        userType: 'both',
      };
      console.log('Register payload (prepared):', payload, 'avatarFile?', !!avatarFile);

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
          urlCandidates.push(`/users/${userId}/avatar`);
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
            try { localStorage.setItem('token', returnedToken); } catch {}
            tokenNow = returnedToken;
          }
        } catch {}
      }
      if (!tokenNow) {
        try {
          // Fallback: try username/password
          const lr2 = await loginUser({ username: String(formData.username || ''), password: String(formData.password || '') });
          returnedToken = lr2?.data?.token || lr2?.data?.accessToken || lr2?.data?.authToken;
          if (returnedToken) {
            try { localStorage.setItem('token', returnedToken); } catch {}
            tokenNow = returnedToken;
          }
        } catch {}
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
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, direction: "rtl" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        {t('register_title')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
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
        <TextField fullWidth label={t('register_username')} name="username" value={formData.username} onChange={handleChange} sx={{ mb: 2 }} error={!!fieldErrors.username} helperText={fieldErrors.username || ''} />
        <TextField fullWidth label={t('register_full_name')} name="fullName" value={formData.fullName} onChange={handleChange} sx={{ mb: 2 }} error={!!fieldErrors.fullName} helperText={fieldErrors.fullName || ''} />
        <TextField fullWidth label={t('register_email')} name="email" type="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} error={!!fieldErrors.email} helperText={fieldErrors.email || ''} />
        <TextField fullWidth label={t('register_phone')} name="phone" value={formData.phone} onChange={handleChange} sx={{ mb: 2 }} error={!!fieldErrors.phone} helperText={fieldErrors.phone || ''} />
        <TextField
          fullWidth
          label={t('register_password')}
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
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
          sx={{ mb: 2 }}
        >
          <MenuItem value="">{t('all_provinces')}</MenuItem>
          {provinces.map((p) => (
            <MenuItem key={p.provinceId || p.id || p.slug || p.nameAr || p.name} value={p.provinceId || p.id || p.slug || p.nameAr || p.name}>
              {p.nameAr || p.name}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          disableClearable={false}
          options={(cities || []).map((c) => c?.nameAr || c?.name || String(c))}
          value={formData.city || ''}
          onChange={(_, newValue) => {
            const v = typeof newValue === 'string' ? newValue : '';
            setFormData((prev) => ({ ...prev, city: v }));
          }}
          renderInput={(params) => (
            <TextField {...params} fullWidth label={t('city')} sx={{ mb: 2 }} disabled={!formData.province} />
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

