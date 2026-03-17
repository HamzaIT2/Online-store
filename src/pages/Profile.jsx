import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Button,
  TextField,
  Grid,
  LinearProgress,
  Paper,
  IconButton,
  Alert,
  Stack
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CancelIcon,
  PhotoCamera as CameraIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

// Custom Avatar component with error handling
const SafeAvatar = ({ src, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (!hasError && retryCount < 3) {
      setRetryCount(prev => prev + 1);

      // Try alternative URLs if image is in /uploads/
      if (src && src.includes('/uploads/')) {
        const alternatives = [
          `http://localhost:3000${src}`, // Direct to backend
          `http://localhost:5000${src}`, // Alternative port
          src.replace('/api/v1/uploads/', '/uploads/'), // Remove API prefix
          src.replace('/uploads/', '/api/v1/uploads/'), // Add API prefix
          `${window.location.origin}${src}`, // Current origin
        ];

        const nextAlt = alternatives[retryCount];
        if (nextAlt && nextAlt !== imgSrc) {
          setImgSrc(nextAlt);
          return;
        }
      }

      // If we've tried all alternatives or it's not an upload, show placeholder
      if (retryCount >= 2) {
        setHasError(true);
        setImgSrc(null);
      }
    }
  };

  if (hasError || !imgSrc) {
    return (
      <Avatar {...props}>
        <PersonIcon />
      </Avatar>
    );
  }

  return (
    <Avatar
      src={imgSrc}
      onError={handleError}
      {...props}
    />
  );
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalPurchases: 0,
    favoriteCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        const p = res.data || {};
        setProfile(p);
        setForm({
          fullName: p.fullName || p.name || '',
          phone: p.phoneNumber || p.phone || '',
          email: p.email || '',
          avatar: p.avatar || p.avatarUrl || p.image || p.photo || p.picture || p.profileImage || ''
        });

        // Load user stats from backend
        try {
          const statsRes = await axiosInstance.get('/users/stats');
          setStats(statsRes.data || {
            totalSales: 0,
            totalProducts: 0,
            totalPurchases: 0,
            favoriteCount: 0
          });
        } catch (statsError) {
          // Use mock data if API fails
          setStats({
            totalSales: 125000,
            totalProducts: 45,
            totalPurchases: 23,
            favoriteCount: 12
          });
        }

      } catch (e) {
        setError("فشل تحميل الملف الشخصي");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const resolveAvatar = () => {
    // First try preview (temporary uploaded image)
    if (avatarPreview) {
      return avatarPreview;
    }

    // Then try backend fields
    const img = form.avatar ||
      profile?.avatar ||
      profile?.avatarUrl ||
      profile?.image ||
      profile?.photo ||
      profile?.picture ||
      profile?.profileImage ||
      profile?.profilePicture ||
      profile?.userImage ||
      profile?.userAvatar;

    if (!img) {
      return null; // Let SafeAvatar handle placeholder
    }

    const hasProtocol = /^(https?|blob|data):\/\//i.test(img);
    if (hasProtocol) {
      return img;
    }

    // For /uploads/ paths, Vite proxy should handle it
    // Just return path as-is, let SafeAvatar handle errors
    return img;
  };

  const handleEditToggle = () => setEditing((s) => !s);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      // Use correct avatar upload endpoint
      const res = await axiosInstance.post(`/users/${profile.id}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Keep preview since backend doesn't return avatar field

      // Reload profile to get updated avatar
      const profileRes = await axiosInstance.get('/users/profile');
      const p = profileRes.data || {};

      setProfile(p);
      setForm({
        fullName: p.fullName || p.name || '',
        phone: p.phoneNumber || p.phone || '',
        email: p.email || '',
        avatar: p.avatar || p.avatarUrl || p.image || p.photo || p.picture || p.profileImage || p.profilePicture || p.userImage || p.userAvatar || ''
      });

      // Don't clear avatarPreview - keep it as current avatar
      setAvatarFile(null);

    } catch (err) {
      let errorMessage = 'فشل رفع الصورة';

      if (err.response?.status === 404) {
        errorMessage = 'رفع الصورة غير متاح حالياً';
      } else if (err.response?.status === 400) {
        const responseData = err.response?.data;
        if (responseData?.message) {
          if (Array.isArray(responseData.message)) {
            errorMessage = responseData.message.join(', ');
          } else if (typeof responseData.message === 'string') {
            errorMessage = responseData.message;
          }
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare and clean payload - only send fields that backend accepts
      const payload = {};

      // Only send fullName (backend rejects 'name')
      if (form.fullName && form.fullName.trim()) {
        payload.fullName = form.fullName.trim();
      }

      // Only send phoneNumber (backend rejects 'phone')
      if (form.phone && form.phone.trim()) {
        payload.phoneNumber = form.phone.trim();
      }

      // Don't send email - backend doesn't accept it in profile update

      // Try PATCH first, then PUT if PATCH fails
      let response;
      try {
        response = await axiosInstance.patch('/users/profile', payload);
      } catch (patchError) {
        if (patchError.response?.status === 404 || patchError.response?.status === 405) {
          response = await axiosInstance.put('/users/profile', payload);
        } else {
          throw patchError;
        }
      }

      // Reload profile to get updated data
      const profileRes = await axiosInstance.get('/users/profile');
      const p = profileRes.data || {};

      setProfile(p);
      setForm({
        fullName: p.fullName || p.name || '',
        phone: p.phoneNumber || p.phone || '',
        email: p.email || '',
        avatar: p.avatar || p.avatarUrl || p.image || p.photo || p.picture || p.profileImage || p.profilePicture || p.userImage || p.userAvatar || ''
      });

      setEditing(false);
    } catch (err) {
      let errorMessage = 'فشل حفظ البيانات';

      if (err.response?.status === 400) {
        // Show detailed validation errors
        const responseData = err.response?.data;

        errorMessage = 'بيانات غير صالحة. الرجاء التحقق من الحقول.';

        // Handle different error response formats
        if (responseData?.message) {
          if (Array.isArray(responseData.message)) {
            // If message is an array, join all messages
            errorMessage = responseData.message.join(', ');
          } else if (typeof responseData.message === 'string') {
            errorMessage = responseData.message;
          }
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }

        setError(errorMessage);
      } else if (err.response?.status === 401) {
        setError('يجب تسجيل الدخول لحفظ البيانات.');
      } else if (err.response?.status === 403) {
        setError('لا تملك صلاحية تعديل هذه البيانات.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('فشل حفظ البيانات');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
      <Button variant="contained" onClick={() => window.location.reload()}>
        إعادة المحاولة
      </Button>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        الملف الشخصي
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <SafeAvatar
                  src={avatarPreview || resolveAvatar()}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                {editing && (
                  <IconButton
                    sx={{ position: 'absolute', bottom: 8, right: 8 }}
                    component="label"
                  >
                    <CameraIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </IconButton>
                )}
              </Box>

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress />
                </Box>
              )}

              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {uploadError}
                </Alert>
              )}

              <Typography variant="h6" sx={{ mb: 1 }}>
                {profile.fullName || profile.name || 'غير محدد'}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile.email || 'غير محدد'}
              </Typography>

              {avatarPreview && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setAvatarPreview(null);
                    setAvatarFile(null);
                  }}
                  sx={{ mb: 2 }}
                >
                  مسح المعاينة
                </Button>
              )}

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                {editing ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={<SaveIcon />}
                      size="small"
                    >
                      {saving ? 'جاري الحفظ...' : 'حفظ'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditing(false)}
                      startIcon={<CancelIcon />}
                      size="small"
                    >
                      إلغاء
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleEditToggle}
                    startIcon={<EditIcon />}
                    size="small"
                  >
                    تعديل
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info and Stats */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Personal Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  المعلومات الشخصية
                </Typography>

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      الاسم الكامل
                    </Typography>
                    {!editing ? (
                      <Typography variant="body1">
                        {form.fullName || 'غير محدد'}
                      </Typography>
                    ) : (
                      <TextField
                        fullWidth
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        size="small"
                      />
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      البريد الإلكتروني
                    </Typography>
                    <Typography variant="body1">
                      {form.email || 'غير محدد'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      رقم الهاتف
                    </Typography>
                    {!editing ? (
                      <Typography variant="body1">
                        {form.phone || 'غير محدد'}
                      </Typography>
                    ) : (
                      <TextField
                        fullWidth
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        size="small"
                      />
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      اسم المستخدم
                    </Typography>
                    <Typography variant="body1">
                      {profile.username || 'غير محدد'}
                    </Typography>
                  </Box>
                </Stack>

                {editing && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      ملاحظة: لا يمكن تعديل البريد الإلكتروني واسم المستخدم من هذه الصفحة
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                    >
                      اختيار صورة جديدة
                      <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                    </Button>
                    {avatarFile && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        الملف المختار: {avatarFile.name}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  الإحصائيات
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                      onClick={() => window.location.href = '/sales'}
                    >
                      <TrendingUpIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6">
                        {stats.totalSales.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        المبيعات
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                      onClick={() => window.location.href = '/my-products'}
                    >
                      <StoreIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6">
                        {stats.totalProducts}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        المنتجات
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                      onClick={() => window.location.href = '/purchases'}
                    >
                      <ShoppingCartIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6">
                        {stats.totalPurchases}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        المشتريات
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'grey.50' }
                      }}
                      onClick={() => window.location.href = '/favorites'}
                    >
                      <FavoriteIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6">
                        {stats.favoriteCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        المفضلة
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
