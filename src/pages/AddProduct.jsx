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
      } catch (err) {
        //ddddddd
        console.error("Failed to load categories or provinces:", err);
        setError(t('error_loading_form_data'));
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


  // AddProduct.jsx

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError('');
  //   setSuccess('');




  //   const requiredNumericFields = ['categoryId', 'provinceId', 'cityId', 'price'];
  //   for (const field of requiredNumericFields) {
  //     if (!form[field] || isNaN(Number(form[field]))) {
  //       setError(`الرجاء إدخال رقم صحيح لحقل ${field}.`);
  //       setLoading(false);
  //       return;
  //     }
  //   }
  //   // const numericPrice = parseFloat(form.price);
  //   // if (isNaN(numericPrice)) {
  //   //   setError('الرجاء إدخال سعر صحيح');
  //   //   setLoading(false);
  //   //   return;
  //   // }
  //   const formData = new FormData();

  //   formData.append('title', form.title);
  //   formData.append('description', form.description);
  //   formData.append('price', Number(form.price)); 
  //   formData.append('categoryId',Number(form.categoryId));
  //   formData.append('condition', form.condition);
  //   formData.append('provinceId',Number (form.provinceId));
  //   formData.append('cityId', Number( form.cityId));
  //   formData.append('address', form.address);


  //   for (const file of files) {
  //     formData.append('images', file);
  //   }

  //   try {

  //     await axiosInstance.post('/products', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     setSuccess(t('success_product_added'));


  //   } catch (err) {
  //     console.error("Submission error:", err.response?.data);
  //     const messages = err.response?.data?.message || ['حدث خطأ.'];
  //     setError(messages.join(', '))
  //     // setError(err.response?.data?.message || t('error_adding_product'));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // --- Step 1: Frontend Validation (Very Important) ---
    // We check the form data before sending it to the server.
    const requiredFields = {
      title: 'Title is required.',
      price: 'Price is required and must be a valid number.',
      categoryId: 'Category is required.',
      provinceId: 'Province is required.',
      cityId: 'City is required.',
      condition: 'Condition is required.',
    };

    for (const field in requiredFields) {
      // Check if the field is empty, '0', or (for price) not a number.
      if (!form[field] || form[field] === '0' || (field === 'price' && isNaN(Number(form[field])))) {
        setError(requiredFields[field]); // Show a clear error to the user
        setLoading(false);
        return; // Stop the submission
      }
    }

    // Check if at least one image is selected.
    if (files.length === 0) {
      setError('At least one image is required.');
      setLoading(false);
      return; // Stop the submission
    }
    // ------------------------------------


    // --- Step 2: Build JSON payload and create product ---
    const payload = {
      title: form.title,
      description: form.description,
      price: Math.max(0, parseFloat(form.price)),
      categoryId: Number(form.categoryId),
      condition: form.condition,
      provinceId: Number(form.provinceId),
      cityId: Number(form.cityId),
      address: form.address,
      isNegotiable: Boolean(form.isNegotiable),
    };

    // Debug: log JSON payload
    console.log('Submitting product JSON payload:', payload);

    try {
      // 1) Create the product (JSON)
      const createRes = await axiosInstance.post('/products', payload);
      const newProduct = createRes.data;
      const productId = newProduct?.productId || newProduct?.id;
      console.log('Created product response:', newProduct, 'Resolved productId:', productId);

      // 2) Upload images if any (single request with repeated 'images')
      if (productId && files?.length) {
        const form = new FormData();
        files.forEach((f) => form.append('images', f));
        const token = (typeof window !== 'undefined') ? (localStorage.getItem('token') || localStorage.getItem('authToken') || '') : '';
        const uploadUrl = `/images/upload/${productId}`;
        console.log('Uploading images to:', uploadUrl, { count: files.length, names: files.map(f => f.name) });
        try {
          // Prefer axiosInstance for base URL; include Authorization if we have a token
          await axiosInstance.post(uploadUrl, form, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
        } catch (imgErr) {
          const data = imgErr.response?.data;
          const msg = Array.isArray(data?.message)
            ? data.message.join(', ')
            : (data?.message || data?.error || imgErr.message || 'Image upload failed');
          console.error('Image upload failed:', uploadUrl, msg, data);
          setError(msg);
        }
      }

      setSuccess('Product added successfully!');
      // After successful creation and image upload, navigate to My Products so the new ad is visible
      setTimeout(() => navigate('/my-products'), 700);
    } catch (err) {
      const d = err.response?.data;
      const msgs = Array.isArray(d?.message)
        ? d.message
        : [typeof d?.message === 'string' ? d.message : (d?.error || err.message || 'An error occurred on the server.')];
      setError(msgs.join(', '));
      console.error('Submission error:', d || err.message);
    } finally {
      setLoading(false);
    }
  };





















  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setSuccess('');
  //   setLoading(true);
  //   try {
  //     const required = ['title','categoryId','price','condition','provinceId','cityId'];
  //     for (const k of required) if (!form[k]) throw new Error('missing');

  //     const payload = {
  //       title: form.title,
  //       description: form.description,
  //       categoryId: Number(form.categoryId),
  //       price: parseFloat(form.price),
  //       condition: form.condition,
  //       provinceId: Number(form.provinceId),
  //       cityId: Number(form.cityId),
  //       address: form.address,
  //       isNegotiable: Boolean(form.isNegotiable),
  //     };

  //     const createRes = await axiosInstance.post('/products', payload);
  //     const newProduct = createRes.data;
  //     const productId = newProduct?.productId;

  //     if (productId && files?.length) {
  //       for (let i = 0; i < files.length; i++) {
  //         const file = files[i];
  //         const formData = new FormData();
  //         formData.append('image', file);
  //         formData.append('isPrimary', String(i === 0));
  //         formData.append('displayOrder', String(i));
  //         await axiosInstance.post(`/images/upload/${productId}`, formData, {
  //           headers: { 'Content-Type': 'multipart/form-data' },
  //         });
  //       }
  //     }

  //     setSuccess('');
  //     setTimeout(() => navigate(`/products/${productId}`), 800);
  //   } catch (err) {
  //     setError('');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
                <TextField fullWidth label={t('field_title')} value={form.title} onChange={(e) => update('title', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth select label={t('field_category')} value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)}>
                  {categories.map((c) => (
                    <MenuItem key={c.categoryId} value={c.categoryId}>{c.nameAr || c.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline minRows={3} label={t('field_description')} value={form.description} onChange={(e) => update('description', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="number" label={t('field_price')} value={form.price} onChange={(e) => update('price', e.target.value)} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label={t('field_condition')} value={form.condition} onChange={(e) => update('condition', e.target.value)}>
                  {CONDITION_OPTIONS.map((o) => (<MenuItem key={o.value} value={o.value}>{t(o.key)}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label={t('field_province')} value={form.provinceId} onChange={(e) => update('provinceId', e.target.value)}>
                  {provinces.map((p) => (<MenuItem key={p.provinceId} value={p.provinceId}>{p.nameAr || p.name}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth select label={t('field_city')} value={form.cityId} onChange={(e) => update('cityId', e.target.value)}>
                  {cities.map((c) => (<MenuItem key={c.cityId} value={c.cityId}>{c.nameAr || c.name}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField fullWidth label={t('field_address')} value={form.address} onChange={(e) => update('address', e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button variant="outlined" component="label">
                    {t('field_images_upload')}
                    <input type="file" hidden multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
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

// return (
//     <Container sx={{ mt: 4 }}>
//       <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{t('add_product_title')}</Typography>
//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
//       {success && <Typography color="primary" sx={{ mb: 2 }}>{success}</Typography>}

//       <Card>
//         <CardContent>
//           <Box component="form" onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               {/* --- تم حذف 'item' من كل الأسطر التالية --- */}
//               <Grid xs={12} md={6}>
//                 <TextField fullWidth label={t('field_title')} value={form.title} onChange={(e)=>update('title', e.target.value)} />
//               </Grid>
//               <Grid xs={12} md={6}>
//                 <TextField fullWidth select label={t('field_category')} value={form.categoryId} onChange={(e)=>update('categoryId', e.target.value)}>
//                   {categories.map((c) => (
//                     <MenuItem key={c.categoryId} value={c.categoryId}>{c.nameAr || c.name}</MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid xs={12}>
//                 <TextField fullWidth multiline minRows={3} label={t('field_description')} value={form.description} onChange={(e)=>update('description', e.target.value)} />
//               </Grid>
//               <Grid xs={12} md={4}>
//                 <TextField fullWidth type="number" label={t('field_price')} value={form.price} onChange={(e)=>update('price', e.target.value)} />
//               </Grid>
//               <Grid xs={12} md={4}>
//                 <TextField fullWidth select label={t('field_condition')} value={form.condition} onChange={(e)=>update('condition', e.target.value)}>
//                   {CONDITION_OPTIONS.map((o)=>(<MenuItem key={o.value} value={o.value}>{t(o.key)}</MenuItem>))}
//                 </TextField>
//               </Grid>
//               <Grid xs={12} md={4}>
//                 <TextField fullWidth select label={t('field_province')} value={form.provinceId} onChange={(e)=>update('provinceId', e.target.value)}>
//                   {provinces.map((p) => (<MenuItem key={p.provinceId} value={p.provinceId}>{p.nameAr || p.name}</MenuItem>))}
//                 </TextField>
//               </Grid>
//               <Grid xs={12} md={4}>
//                 <TextField fullWidth select label={t('field_city')} value={form.cityId} onChange={(e)=>update('cityId', e.target.value)}>
//                   {cities.map((c) => (<MenuItem key={c.cityId} value={c.cityId}>{c.nameAr || c.name}</MenuItem>))}
//                 </TextField>
//               </Grid>
//               <Grid xs={12} md={8}>
//                 <TextField fullWidth label={t('field_address')} value={form.address} onChange={(e)=>update('address', e.target.value)} />
//               </Grid>
//               <Grid xs={12}>
//                 <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
//                   <Button variant="outlined" component="label">
//                     {t('field_images_upload')}
//                     <input type="file" hidden multiple accept="image/*" onChange={(e)=>setFiles(Array.from(e.target.files||[]))} />
//                   </Button>
//                   <Typography variant="body2">{files.length ? String(files.length) : t('no_files_selected')}</Typography>
//                 </Box>
//               </Grid>
//               <Grid xs={12}>
//                 <Button type="submit" variant="contained">{t('submit_product')}</Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }