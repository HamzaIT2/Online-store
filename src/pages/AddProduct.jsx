import React, { useEffect, useState } from "react";
import {
  Container, Grid, TextField, MenuItem, Button, Typography, Box,
  Paper, LinearProgress, InputAdornment, IconButton, Avatar, Switch, FormControlLabel, Alert, Snackbar, Chip
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { t } from "../i18n";
import { Zoom, Slide } from '@mui/material';
import { motion } from 'framer-motion';
// --- الثوابت والبيانات الاحتياطية (كما هي في كودك) ---
const CONDITION_OPTIONS = [
  { key: 'condition_new', value: 'new' },
  { key: 'condition_used', value: 'used' },
  { key: 'condition_bad', value: 'bad' },
];

const CATEGORY_OPTIONS = [
  { categoryId: 'c-electronics', nameAr: 'الكترونيات وملحقاتها', nameEn: 'Electronics & Accessories' },
  { categoryId: 'c-clothing-clothing', nameAr: 'ملابس و ملحقاتها', nameEn: 'Clothing & Accessories' },
  { categoryId: 'c-car', nameAr: 'سيارات وملحقاتها', nameEn: 'Cars & Accessories' },
  { categoryId: 'c-tool', nameAr: 'ادوات و هوايات', nameEn: 'Tools & Hobbies' },
  { categoryId: 'c-beauty', nameAr: 'جمال وصحة', nameEn: 'Beauty & Health' },
  { categoryId: 'c-furniture', nameAr: 'اثاث وديكور', nameEn: 'Furniture & Decor' },


]

const getCurrentLang = () => {
  try { return localStorage.getItem('lang') || 'ar'; } catch { return 'ar'; }
};

export default function AddProduct() {
  const navigate = useNavigate();

  // --- States (الحالات) ---
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('token') || null : null));
  const [userType, setUserType] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('userType') || 'both' : 'both'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [categories, setCategories] = useState([]);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    price: '',
    condition: 'new',  // Changed from 'good' to 'new' (backend enum)
    provinceId: '',     // Will be set to number when province selected
    cityId: '',
    address: '',
    isNegotiable: false,
  });

  const [files, setFiles] = useState([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [imageError, setImageError] = useState('');

  // --- Effects (التحميل والتحقق) ---
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, prov] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get('/provinces'),
        ]);

        // Safely extract data from different response structures
        const categoriesData = cats.data?.data || cats.data || cats || [];
        const provincesData = prov.data?.data || prov.data || prov || [];

        setCategories(categoriesData);
        setProvinces(provincesData);

      } catch (err) {
        setError(t('error_loading_form_data'));
        setProvinces([]);  // Set empty array instead of fallback
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('token'));
        setUserType(localStorage.getItem('userType') || 'both');
      }
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!token) { navigate('/login'); }
  }, [token, navigate]);

  useEffect(() => {
    const loadCities = async () => {
      if (!form.provinceId) {
        setCities([]);
        return;
      }

      try {
        const res = await axiosInstance.get(`/provinces/${form.provinceId}/cities`);

        // Safely extract data from different response structures
        const citiesData = res.data?.data || res.data || res || [];
        setCities(citiesData);

      } catch (e) {

        // Set empty cities array - backend data required
        setCities([]);
      }
    };
    loadCities();
  }, [form.provinceId]);

  // --- Handlers (الدوال) ---
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Helper function to get subcategories of selected main category
  const getSelectedCategorySubcategories = () => {
    const selectedCategory = categories.find(cat =>
      (cat.id === selectedMainCategoryId) || (cat.categoryId === selectedMainCategoryId)
    );
    return selectedCategory?.subs || [];
  };

  // Handle main category selection
  const handleMainCategoryChange = (categoryId) => {
    setSelectedMainCategoryId(categoryId);
    setSelectedSubCategoryId(''); // Reset subcategory when main category changes
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubCategoryId(subcategoryId);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Check if adding these files would exceed the limit
    if (files.length + selectedFiles.length > 10) {
      setImageError('الحد الأقصى للصور هو 10 صور فقط');
      return;
    }

    setImageError('');
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);
      // Adjust cover image index if needed
      if (coverImageIndex >= newFiles.length) {
        setCoverImageIndex(Math.max(0, newFiles.length - 1));
      } else if (coverImageIndex > indexToRemove) {
        setCoverImageIndex(coverImageIndex - 1);
      }
      return newFiles;
    });
  };

  const handleSetCoverImage = (index) => {
    setCoverImageIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // 1. Validation
    const requiredFields = {
      title: 'Title is required.',
      price: 'Price is required and must be a valid number.',
      provinceId: 'Province is required.',
      cityId: 'City is required.',
      condition: 'Condition is required.',
    };

    // Custom validation for category/subcategory
    if (!selectedSubCategoryId && !selectedMainCategoryId) {
      setError('Category is required.');
      setLoading(false);
      return;
    }

    for (const field in requiredFields) {
      if (!form[field] || form[field] === '0' || (field === 'price' && isNaN(Number(form[field])))) {
        setError(requiredFields[field]);
        setLoading(false);
        return;
      }
    }

    if (files.length === 0) {
      setError('يجب إضافة صورة واحدة على الأقل');
      setLoading(false);
      return;
    }

    // 2. Prepare Payload
    // Ensure categoryId is a valid number - prioritize subcategory, fallback to main category
    let categoryIdToSend = null;

    if (selectedSubCategoryId && selectedSubCategoryId !== '') {
      // For subcategories, we need to find the corresponding main category ID
      // Since subcategories are strings, we'll use the main category ID as the categoryId
      categoryIdToSend = Number(selectedMainCategoryId);
    } else if (selectedMainCategoryId && selectedMainCategoryId !== '') {
      categoryIdToSend = Number(selectedMainCategoryId);
    }

    // Final validation
    if (!categoryIdToSend || isNaN(categoryIdToSend)) {
      setError('Please select a valid category.');
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Math.max(0, parseFloat(form.price)),
      categoryId: categoryIdToSend,
      condition: form.condition,
      provinceId: Number(form.provinceId),
      cityId: Number(form.cityId),
      address: form.address,
      isNegotiable: Boolean(form.isNegotiable),
    };



    try {
      // Create Product
      const createRes = await axiosInstance.post('/products', payload);
      const newProduct = createRes;
      const productId = newProduct?.productId || newProduct?.id;

      // Upload Images with cover image info
      if (productId && files?.length) {
        const formData = new FormData();
        files.forEach((f, index) => {
          formData.append('images', f);
          // Mark which image is the cover
          if (index === coverImageIndex) {
            formData.append('coverIndex', index.toString());
          }
        });
        const token = localStorage.getItem('token');
        const uploadUrl = `/images/upload/${productId}`;

        await axiosInstance.post(uploadUrl, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSuccess('Product added successfully!');
      setTimeout(() => navigate('/my-products'), 1000);
    } catch (err) {

      const d = err.response?.data;
      const msgs = Array.isArray(d?.message) ? d.message : [d?.message || d?.error || 'Error occurred'];
      setError(msgs.join(', '));
    } finally {
      setLoading(false);
    }
  };

  // --- UI Design ---
  return (
    <Zoom in={true} timeout={{ enter: 800, exit: 500 }}>
      <Container maxWidth="md" sx={{ mt: 17 }}>
        <Paper elevation={3}
          sx={{
            p: 6, borderRadius: 15,
            border: '1px solid #a59696ff',
            boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)'

          }}>

          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {t('add_product_title')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              أدخل تفاصيل إعلانك الجديد ليراه آلاف المشترين
            </Typography>
          </Box>

          {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}


          {error && <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
            <Alert
              variant="filled"
              severity="error"
              sx={{ mb: 3, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}

            >
              {error}

            </Alert>
          </Slide>}
          {success && <Slide direction="down" in={!!success} mountOnEnter unmountOnExit>
            <Alert
              variant="filled"
              severity="success"
              sx={{ mb: 3, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
            >{success}

            </Alert>
          </Slide>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>




              {/* 2. Basic Info */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('field_title')}
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  variant="outlined"
                  placeholder="مثال: آيفون 13 برو ماكس نظيف جداً"
                />
              </Grid>


              {/* 3. Details (Category & Condition) */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={t('field_category')}
                  value={selectedMainCategoryId}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                >
                  {categories.map((c) => {

                    // Determine current language
                    const isArabic = getCurrentLang() === 'ar';

                    return (
                      <MenuItem key={c.id} value={c.id}>
                        {isArabic ? c.name_ar : c.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="القسم الفرعي"
                  value={selectedSubCategoryId}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  disabled={!selectedMainCategoryId || getSelectedCategorySubcategories().length === 0}
                >
                  {getSelectedCategorySubcategories().map((sub, index) => {
                    // Handle both string and object formats for subcategories
                    const subValue = typeof sub === 'string' ? sub : (sub.en || sub.ar || sub);

                    // Determine current language
                    const isArabic = getCurrentLang() === 'ar';

                    // Handle multilingual display for subcategories
                    const subLabel = typeof sub === 'string'
                      ? sub
                      : (isArabic ? sub.name_ar : sub.name);

                    return (
                      <MenuItem key={index} value={subValue}>
                        {subLabel}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  label={t('field_description')}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  variant="outlined"
                  placeholder="اذكر جميع التفاصيل، الملحقات، والعيوب إن وجدت..."
                />
              </Grid>


              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={t('field_condition')}
                  value={form.condition}
                  onChange={(e) => update('condition', e.target.value)}
                >
                  {CONDITION_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{t(o.key)}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* 4. Location */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={t('field_province')}
                  value={form.provinceId}
                  onChange={(e) => update('provinceId', e.target.value)}
                >
                  {provinces.map((p) => {

                    return (
                      <MenuItem key={p.provinceId || p.id} value={p.provinceId || p.id}>
                        {getCurrentLang() === 'ar' ? (p.nameAr || p.name) : (p.nameEn || p.name)}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label={t('field_city')}
                  value={form.cityId}
                  onChange={(e) => update('cityId', e.target.value)}
                  disabled={!cities.length}
                >
                  {cities.map((c) => {

                    return (
                      <MenuItem key={c.cityId || c.id} value={c.cityId || c.id}>
                        {getCurrentLang() === 'ar' ? (c?.nameAr || c?.name) : (c?.nameEn || c?.name)}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('field_address')}
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="اسم المنطقة / أقرب نقطة دالة"
                />
              </Grid>

              {/* 5. Price & Negotiation */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('field_price')}
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><AttachMoneyIcon /></InputAdornment>,
                  }}
                />
              </Grid>


              {/* Enhanced Image Upload Section */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
                    {t('field_images_upload')} ({files.length}/10)
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    أضف صوراً واضحة لمنتجك. الحد الأقصى 10 صور.
                  </Typography>
                </Box>

                {/* Image Upload Area */}
                <Box
                  sx={{
                    border: files.length >= 10 ? '2px dashed #ccc' : '2px dashed #90caf9',
                    bgcolor: files.length >= 10 ? '#f5f5f5' : '#f0f7ff',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: files.length >= 10 ? 'not-allowed' : 'pointer',
                    transition: '0.3s',
                    '&:hover': files.length >= 10 ? {} : { bgcolor: '#e3f2fd', borderColor: '#1976d2' }
                  }}
                >
                  <Button
                    component="label"
                    disabled={files.length >= 10}
                    disableRipple
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: files.length >= 10 ? 0.6 : 1
                    }}
                  >
                    <CloudUploadIcon sx={{ fontSize: 40, color: files.length >= 10 ? '#ccc' : '#1976d2', mb: 1 }} />
                    <Typography variant="h6" color={files.length >= 10 ? '#ccc' : 'primary'}>
                      {files.length >= 10 ? 'تم الوصول للحد الأقصى' : 'اختر الصور'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      JPG, PNG - الحجم الأقصى 5MB للصورة الواحدة
                    </Typography>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>

                {/* Image Error Message */}
                {imageError && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                    {imageError}
                  </Alert>
                )}

                {/* Image Preview Grid */}
                {files.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                      معاينة الصور (اضغط على النجمة لتحديد صورة الغلاف):
                    </Typography>
                    <Grid container spacing={2}>
                      {files.map((file, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box
                            sx={{
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              border: index === coverImageIndex ? '3px solid #1976d2' : '1px solid #ddd',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }
                            }}
                          >
                            {/* Cover Image Badge */}
                            {index === coverImageIndex && (
                              <Chip
                                icon={<StarIcon sx={{ fontSize: 16 }} />}
                                label="صورة الغلاف"
                                size="small"
                                color="primary"
                                sx={{
                                  position: 'absolute',
                                  top: 5,
                                  right: 5,
                                  zIndex: 10,
                                  fontSize: '0.7rem',
                                  height: 24
                                }}
                              />
                            )}

                            {/* Image Preview */}
                            <Avatar
                              src={URL.createObjectURL(file)}
                              variant="rounded"
                              sx={{
                                width: '100%',
                                height: 120,
                                border: 'none'
                              }}
                            />

                            {/* Action Buttons */}
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 5,
                                left: 5,
                                display: 'flex',
                                gap: 0.5
                              }}
                            >
                              {/* Set as Cover Button */}
                              <IconButton
                                size="small"
                                onClick={() => handleSetCoverImage(index)}
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                                  '&:hover': { bgcolor: 'white' }
                                }}
                                title={index === coverImageIndex ? 'صورة الغلاف الحالية' : 'تعيين كصورة غلاف'}
                              >
                                {index === coverImageIndex ? (
                                  <StarIcon color="primary" fontSize="small" />
                                ) : (
                                  <StarBorderIcon fontSize="small" />
                                )}
                              </IconButton>

                              {/* Delete Button */}
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(index)}
                                sx={{
                                  bgcolor: 'rgba(244, 67, 54, 0.9)',
                                  color: 'white',
                                  '&:hover': { bgcolor: '#d32f2f' }
                                }}
                                title="حذف الصورة"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            {/* File Name */}
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                p: 0.5,
                                fontSize: '0.7rem',
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {file.name}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isNegotiable}
                      onChange={(e) => update('isNegotiable', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="السعر قابل للتفاوض؟"
                />
              </Grid>

              {/* 6. Submit Button */}
              <Grid item xs={12}>
                <Button
                  component={motion.button}
                  whileTap={{ scale: 0.9 }} //يعمل عند الضغط يزغر 
                  whileHover={{ scale: 1.05 }} // هذا للماوس  الانمايشون 
                  whileFocus={{ scale: 1 }}

                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}

                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={!loading && <AddPhotoAlternateIcon />}
                  sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  {loading ? "جاري النشر..." : t('submit_product')}
                </Button>
              </Grid>



            </Grid>
          </Box>
        </Paper>
      </Container>
    </Zoom>
  );
}