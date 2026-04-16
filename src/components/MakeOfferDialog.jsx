import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, InputAdornment, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { AccessTime, LocalOffer } from '@mui/icons-material';
import axiosInstance from '../api/axiosInstance';
import { t } from '../i18n';

export default function MakeOfferDialog({ open, onClose, product, onSuccess }) {
    const [offerPrice, setOfferPrice] = useState('');
    const [duration, setDuration] = useState(24); // الافتراضي 24 ساعة
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // 1. استخراج الـ ID بشكل آمن (لأن بعض القواعد تستخدم id والبعض productId)
        const productId = product?.id || product?.productId;

        // فحص الأمان: إذا لم يوجد ID لا ترسل الطلب
        if (!productId) {
            console.error("خطأ: رقم المنتج غير موجود", product);
            alert("حدث خطأ: لا يمكن العثور على معرف المنتج");
            return;
        }

        // تحقق من سعر العرض
        if (!offerPrice || offerPrice.trim() === '') {
            alert("الرجاء إدخال سعر العرض");
            return;
        }

        const offerPriceNum = Number(offerPrice);
        const currentPriceNum = Number(product.price);

        if (isNaN(offerPriceNum) || offerPriceNum <= 0) {
            alert("سعر العرض يجب أن يكون رقماً موجباً");
            return;
        }

        if (offerPriceNum >= currentPriceNum) {
            alert(`سعر العرض يجب أن يكون أقل من السعر الحالي (${currentPriceNum.toLocaleString()} د.ع)`);
            return;
        }

        setLoading(true);
        try {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + duration);

            const payload = {
                price: offerPriceNum,
                oldPrice: currentPriceNum,
                offerExpiresAt: expiryDate.toISOString()
            };



            // 2. استخدام الـ ID المستخرج في الرابط
            const response = await axiosInstance.patch(`/products/${productId}`, payload);



            onSuccess();
            onClose();
        } catch (error) {
            console.error("فشل إنشاء العرض:", error);

            // عرض رسالة خطأ مفصلة
            let errorMessage = "حدث خطأ أثناء حفظ العرض";

            if (error.response) {
                // الخادم استجاب مع خطأ
                errorMessage = error.response.data?.message ||
                    error.response.data?.error ||
                    `خطأ من الخادم: ${error.response.status}`;
            } else if (error.request) {
                // تم إرسال الطلب但没有 استجابة
                errorMessage = "لا يوجد اتصال بالخادم، تحقق من شبكة الإنترنت";
            } else {
                // خطأ في إعداد الطلب
                errorMessage = error.message || "حدث خطأ غير معروف";
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <LocalOffer /> {t('create_offer') || "إنشاء عرض مؤقت"}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* السعر الجديد */}
                    <TextField
                        label={t('offer_price') || "سعر العرض الجديد"}
                        type="number"
                        fullWidth
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        InputProps={{ endAdornment: <InputAdornment position="start">IQD</InputAdornment> }}
                        helperText={`السعر الحالي: ${Number(product?.price).toLocaleString()}`}
                    />

                    {/* اختيار المدة */}
                    <FormControl fullWidth>
                        <InputLabel>{t('duration') || "مدة العرض"}</InputLabel>
                        <Select
                            value={duration}
                            label={t('duration') || "مدة العرض"}
                            onChange={(e) => setDuration(e.target.value)}
                            startAdornment={<AccessTime sx={{ mr: 1, color: 'text.secondary' }} />}
                        >
                            <MenuItem value={24}>24 ساعة (يوم واحد)</MenuItem>
                            <MenuItem value={48}>48 ساعة (يومان)</MenuItem>
                            <MenuItem value={72}>3 أيام</MenuItem>
                            <MenuItem value={168}>أسبوع كامل</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="caption" color="text.secondary">
                        * سينتهي العرض تلقائياً بعد انتهاء الوقت المحدد.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">{t('cancel') || "إلغاء"}</Button>
                <Button onClick={handleSubmit} variant="contained" color="error" disabled={loading}>
                    {loading ? "جاري الحفظ..." : t('activate_offer') || "تفعيل العرض"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}