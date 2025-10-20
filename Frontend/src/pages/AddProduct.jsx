import { useEffect, useState } from "react";
import { Container, Grid, TextField, MenuItem, Button, Typography, Box, Card, CardContent, LinearProgress } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { t } from "../i18n";

const CONDITION_OPTIONS = [
  { key: 'condition_new', value: 'new' },
  { key: 'condition_like_new', value: 'like_new' },
  { key: 'condition_good', value: 'good' },
  { key: 'condition_fair', value: 'fair' },
  { key: 'condition_poor', value: 'poor' },
];

export default function AddProduct() {
  const navigate = useNavigate();
  const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') || 'buyer' : 'buyer';
  const canSell = userType === 'seller' || userType === 'both';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    price: '',
    condition: 'good',
    provinceId: '',
    cityId: '',
    address: '',
    isNegotiable: true,
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, prov] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get('/provinces'),
        ]);
        setCategories(cats.data || []);
        setProvinces(prov.data || []);
      } catch (e) {
        setError('');
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (!form.provinceId) { setCities([]); return; }
      try {
        const res = await axiosInstance.get(`/provinces/${form.provinceId}/cities`);
        setCities(res.data || []);
      } catch (e) {
        setCities([]);
      }
    };
    loadCities();
  }, [form.provinceId]);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const required = ['title','categoryId','price','condition','provinceId','cityId'];
      for (const k of required) if (!form[k]) throw new Error('missing');

      const payload = {
        title: form.title,
        description: form.description,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        condition: form.condition,
        provinceId: Number(form.provinceId),
        cityId: Number(form.cityId),
        address: form.address,
        isNegotiable: Boolean(form.isNegotiable),
      };

      const createRes = await axiosInstance.post('/products', payload);
      const newProduct = createRes.data;
      const productId = newProduct?.productId;

      if (productId && files?.length) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('image', file);
          formData.append('isPrimary', String(i === 0));
          formData.append('displayOrder', String(i));
          await axiosInstance.post(`/images/upload/${productId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }

      setSuccess('');
      setTimeout(() => navigate(`/products/${productId}`), 800);
    } catch (err) {
      setError('');
    } finally {
      setLoading(false);
    }
  };

  if (!canSell) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          {t('add_product_title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/register')}>{t('register')}</Button>
          <Button variant="contained" onClick={() => navigate('/')}>{t('home')}</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{t('add_product_title')}</Typography>
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {success && <Typography color="primary" sx={{ mb: 2 }}>{success}</Typography>}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label={t('field_title')} value={form.title} onChange={(e)=>update('title', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth select label={t('field_category')} value={form.categoryId} onChange={(e)=>update('categoryId', e.target.value)}>
                  {categories.map((c) => (
                    <MenuItem key={c.categoryId} value={c.categoryId}>{c.nameAr || c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline minRows={3} label={t('field_description')} value={form.description} onChange={(e)=>update('description', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="number" label={t('field_price')} value={form.price} onChange={(e)=>update('price', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label={t('field_condition')} value={form.condition} onChange={(e)=>update('condition', e.target.value)}>
                  {CONDITION_OPTIONS.map((o)=>(<MenuItem key={o.value} value={o.value}>{t(o.key)}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label={t('field_province')} value={form.provinceId} onChange={(e)=>update('provinceId', e.target.value)}>
                  {provinces.map((p) => (<MenuItem key={p.provinceId} value={p.provinceId}>{p.nameAr || p.name}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label={t('field_city')} value={form.cityId} onChange={(e)=>update('cityId', e.target.value)}>
                  {cities.map((c) => (<MenuItem key={c.cityId} value={c.cityId}>{c.nameAr || c.name}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField fullWidth label={t('field_address')} value={form.address} onChange={(e)=>update('address', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button variant="outlined" component="label">
                    {t('field_images_upload')}
                    <input type="file" hidden multiple accept="image/*" onChange={(e)=>setFiles(Array.from(e.target.files||[]))} />
                  </Button>
                  <Typography variant="body2">{files.length ? String(files.length) : t('no_files_selected')}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">{t('submit_product')}</Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}