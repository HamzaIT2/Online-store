import { useEffect, useState } from "react";
import { Container, Grid, TextField, MenuItem, Button, Typography, Box, Card, CardContent, LinearProgress, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "../i18n";

const CONDITION_OPTIONS = [
    { key: 'condition_new', value: 'new' },
    { key: 'condition_like_new', value: 'like_new' },
    { key: 'condition_good', value: 'good' },
    { key: 'condition_fair', value: 'fair' },
    { key: 'condition_poor', value: 'poor' },
];

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') || 'buyer' : 'buyer';
    const canSell = userType === 'seller' || userType === 'both';

    const [loading, setLoading] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
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

    const [files, setFiles] = useState([]); // new images to upload
    const [existingImages, setExistingImages] = useState([]);
    const [confirmDelOpen, setConfirmDelOpen] = useState(false);
    const [toDeleteImage, setToDeleteImage] = useState(null);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

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
                console.warn('Failed to load categories/provinces', err);
            }

            if (!id) return;
            try {
                const res = await axiosInstance.get(`/products/${id}`);
                const p = res.data?.product || res.data || {};
                setForm((prev) => ({
                    ...prev,
                    title: p.title || p.name || '',
                    description: p.description || p.desc || '',
                    categoryId: (p.categoryId ?? p.category_id ?? p.category) || '',
                    price: p.price ?? p.amount ?? '',
                    condition: p.condition || prev.condition,
                    provinceId: (p.provinceId ?? p.province_id ?? p.province) || '',
                    cityId: (p.cityId ?? p.city_id ?? p.city) || '',
                    address: p.address || p.location?.address || '',
                    isNegotiable: p.isNegotiable ?? p.negotiable ?? prev.isNegotiable,
                }));
                // extract existing images if available
                const imgs = [];
                if (Array.isArray(p.images)) imgs.push(...p.images);
                else if (Array.isArray(p.photos)) imgs.push(...p.photos);
                else if (Array.isArray(res.data?.images)) imgs.push(...res.data.images);
                setExistingImages(imgs.filter(Boolean));
            } catch (e) {
                console.error('Failed to load product for edit', e);
                setError(t('error_loading_product') || 'Failed to load product');
            } finally {
                setLoadingInitial(false);
            }
        };
        load();
    }, [id]);

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

    if (!canSell) {
        return (
            <Container sx={{ mt: 6 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>{t('edit_product')}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" onClick={() => navigate('/register')}>{t('register')}</Button>
                    <Button variant="contained" onClick={() => navigate('/')}>{t('home')}</Button>
                </Box>
            </Container>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const payload = {
            title: form.title,
            description: form.description,
            price: Math.max(0, parseFloat(form.price || 0)),
            categoryId: Number(form.categoryId),
            condition: form.condition,
            provinceId: Number(form.provinceId),
            cityId: Number(form.cityId),
            address: form.address,
            isNegotiable: Boolean(form.isNegotiable),
        };

        try {
            await axiosInstance.put(`/products/${id}`, payload);

            // upload any new images
            if (files?.length) {
                const formData = new FormData();
                files.forEach((f) => formData.append('images', f));
                try {
                    const token = (typeof window !== 'undefined') ? (localStorage.getItem('token') || localStorage.getItem('authToken') || '') : '';
                    await axiosInstance.post(`/images/upload/${id}`, formData, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
                } catch (imgErr) {
                    console.error('Image upload failed during edit', imgErr);
                    // don't block the whole update; show a warning
                    setError('Updated product but image upload failed.');
                }
            }

            setSuccess('Product updated successfully');
            setSuccess('Product updated successfully');
            setSuccessDialogOpen(true);
        } catch (err) {
            console.error('Update failed', err?.response?.data || err.message);
            setError(err?.response?.data?.message || err.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (loadingInitial) return (<Container sx={{ mt: 6, textAlign: 'center' }}><LinearProgress /></Container>);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>{t('edit_product') || 'Edit Product'}</Typography>
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

                            {existingImages && existingImages.length > 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="body2">{t('existing_images') || 'Existing images:'} {existingImages.length}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            {existingImages.map((img, idx) => (
                                                <Box key={idx} sx={{ position: 'relative' }}>
                                                    <Avatar variant="rounded" src={typeof img === 'string' ? img : (img.url || img.src)} sx={{ width: 120, height: 90 }} />
                                                    <IconButton size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)' }} onClick={() => { setToDeleteImage(img); setConfirmDelOpen(true); }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">{t('save_changes') || 'Save Changes'}</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={confirmDelOpen} onClose={() => setConfirmDelOpen(false)}>
                <DialogTitle>{t('confirm_delete_image') || 'Confirm delete image'}</DialogTitle>
                <DialogContent>
                    <Typography>{t('confirm_delete_image_text') || 'Are you sure you want to delete this image?'}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelOpen(false)}>{t('cancel') || 'Cancel'}</Button>
                    <Button color="error" onClick={async () => {
                        if (!toDeleteImage) { setConfirmDelOpen(false); return; }
                        try {
                            // try multiple delete paths depending on backend shape
                            const imgId = toDeleteImage.id || toDeleteImage.imageId || toDeleteImage._id || toDeleteImage.name || null;
                            if (imgId) {
                                await axiosInstance.delete(`/images/${imgId}`);
                            } else {
                                // fallback: send product + image url to delete
                                await axiosInstance.post(`/images/delete`, { productId: id, url: (typeof toDeleteImage === 'string' ? toDeleteImage : (toDeleteImage.url || toDeleteImage.src)) });
                            }
                        } catch (e) {
                            console.error('Failed to delete image', e);
                        } finally {
                            // remove from UI regardless to keep consistent state; backend error will be logged
                            setExistingImages((prev) => prev.filter(x => x !== toDeleteImage));
                            setToDeleteImage(null);
                            setConfirmDelOpen(false);
                        }
                    }}>{t('delete') || 'Delete'}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
                <DialogTitle>{t('product_saved') || 'Product saved'}</DialogTitle>
                <DialogContent>
                    <Typography>{t('product_saved_message') || 'Your product was updated successfully.'}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setSuccessDialogOpen(false); }}>{t('stay') || 'Stay'}</Button>
                    <Button onClick={() => navigate('/my-products')} variant="contained">{t('go_to_my_products') || 'Go to My Ads'}</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
