import { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Card, CardContent, Avatar, Button, TextField, Grid, LinearProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        const p = res.data || {};
        setProfile(p);
        setForm({
          fullName: p.fullName || p.name || '',
          phone: p.phoneNumber || p.phone || '',
          avatar: p.avatar || p.avatarUrl || p.image || p.photo || p.picture || ''
        });
      } catch (e) {
        setError("");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <Container sx={{ textAlign: 'center', mt: 6 }}><CircularProgress /></Container>
  );

  if (error) return (
    <Container sx={{ mt: 4 }}>
      <Typography color="error" align="center">{error}</Typography>
    </Container>
  );

  if (!profile) return null;

  const resolveAvatar = () => {
    const img = (form.avatar && String(form.avatar)) || profile.avatar || profile.avatarUrl || profile.image || profile.photo || profile.picture;
    if (!img) return '/placeholder.svg';
    const hasProtocol = /^(https?|blob|data):\/\//i.test(img);
    if (hasProtocol) return img;
    try { const origin = new URL(axiosInstance.defaults.baseURL).origin; return origin + (img.startsWith('/') ? img : `/${img}`); } catch { return img; }
  };

  const handleEditToggle = () => setEditing((s) => !s);
  
  const uploadAvatar = async (file) => {
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await axiosInstance.post(`/users/avatar/${userId}`, fd);
      const data = res?.data || {};
      // Try multiple common shapes
      let path = data.avatar || data.avatarUrl || data.photo || data.picture || data.image || data.imagePath
        || data.path || data.url || data.filename
        || data.file?.path || data.file?.filename
        || data.data?.avatar || data.data?.avatarUrl || data.data?.photo || data.data?.picture || data.data?.image || data.data?.imagePath
        || data.data?.path || data.data?.url || data.data?.filename || "";
      if (!path) {
        // Heuristic: scan top-level string fields for an uploads path or image URL
        try {
          for (const [k, v] of Object.entries(data)) {
            if (typeof v === 'string' && (v.includes('/uploads/') || /^https?:\/\//i.test(v))) { path = v; break; }
          }
        } catch {}
      }
      if (path) {
        if (/^https?:\/\//i.test(path)) {
          // absolute URL returned
        } else if (!path.startsWith('/uploads/')) {
          path = `/uploads/${path}`;
        }
        setForm((f) => ({ ...f, avatar: path }));
        setProfile((p) => ({ ...(p || {}), avatar: path }));
        // Also refetch profile to sync any other changes from backend
        try { const pr = await axiosInstance.get('/users/profile'); setProfile(pr.data || {}); } catch {}
      } else {
        // Fallback: show a local preview using blob URL, don't show error
        try {
          const blobUrl = URL.createObjectURL(file);
          setForm((f) => ({ ...f, avatar: blobUrl }));
          setProfile((p) => ({ ...(p || {}), avatar: blobUrl }));
          console.warn('Unexpected upload response shape, used blob preview instead', data);
          // Attempt to refetch profile shortly after upload to get final persisted avatar
          setTimeout(async () => { try { const pr = await axiosInstance.get('/users/profile'); setProfile(pr.data || {}); } catch {} }, 500);
        } catch {
          setUploadError(t('avatar_upload_failed') || 'Avatar upload failed');
        }
      }
    } catch (e) {
      setUploadError(t('avatar_upload_failed') || 'Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setAvatarFile(f || null);
    if (f) uploadAvatar(f);
  };

  const handleSave = async () => {
    // Build payload with only allowed fields
    const payload = {};
    if (form.fullName != null) payload.fullName = String(form.fullName).trim();
    if (form.phone != null) payload.phoneNumber = String(form.phone).trim();
    // Do not include avatar in payload; backend rejects this field
    if (profile?.provinceId != null) payload.provinceId = Number(profile.provinceId);
    if (profile?.cityId != null) payload.cityId = Number(profile.cityId);

    setSaving(true);
    try {
      // Try PATCH first, then fallback to PUT on 404/405
      try {
        await axiosInstance.patch('/users/profile', payload);
      } catch (e) {
        const st = e?.response?.status;
        if (st === 404 || st === 405) {
          await axiosInstance.put('/users/profile', payload);
        } else if (st === 400) {
          // Surface server validation message
          const srv = e.response.data;
          let msg = 'Validation failed';
          if (srv) {
            if (Array.isArray(srv.message)) msg = srv.message.join('; ');
            else if (typeof srv.message === 'string') msg = srv.message;
            else if (srv.error) msg = srv.error;
            else try { msg = JSON.stringify(srv); } catch { /* ignore */ }
          }
          throw new Error(msg);
        } else {
          throw e;
        }
      }
      // reload profile
      const res = await axiosInstance.get('/users/profile');
      setProfile(res.data || {});
      setEditing(true);
    } catch (e) {
      console.error('Save profile failed', e);
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        setError(t('unauthorized') || 'Unauthorized or forbidden. Please login again or check your permissions.');
      } else if (e instanceof Error && e.message) {
        setError(e.message);
      } else {
        setError(t('error_saving_profile') || 'Failed to save profile');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{t('profile_title')}</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar src={resolveAvatar()} sx={{ width: 96, height: 96 }} />
            </Grid>
            <Grid item xs>
              {!editing ? (
                <Box>
                  <Typography variant="h6">{profile.fullName || profile.name || ''}</Typography>
                  <Typography color="text.secondary">{profile.email}</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField label={t('profile_full_name')} value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
                  <TextField label={t('profile_phone')} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </Box>
              )}
            </Grid>
            <Grid item>
              {!editing ? (
                <Button startIcon={<EditIcon />} onClick={handleEditToggle}>{t('edit')}</Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave} disabled={saving}>{saving ? <LinearProgress /> : t('save')}</Button>
                  <Button startIcon={<CancelIcon />} onClick={() => setEditing(false)}>{t('cancel')}</Button>
                </Box>
              )}
            </Grid>
          </Grid>

          {editing && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" component="label">
                {uploading ? (t('uploading') || '...جاري الرفع') : (t('upload_avatar') || 'رفع الصورة')}
                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
              </Button>
              {avatarFile && <Typography variant="body2">{avatarFile.name}</Typography>}
              {uploadError && <Typography color="error" variant="body2">{uploadError}</Typography>}
            </Box>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography>{t('profile_username')}: {profile.username}</Typography>
            <Typography>{t('profile_province')}: {profile.province?.nameAr || profile.province?.name || t('unknown')}</Typography>
            <Typography>{t('profile_total_sales')}: {profile.totalSales ?? 0}</Typography>
            <Typography>{t('profile_rating_avg')}: {profile.ratingAverage ?? 0}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

