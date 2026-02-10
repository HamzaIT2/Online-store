import React, { useState } from 'react';
import {
    Drawer, Box, Typography, Slider, FormControl, InputLabel, Select, MenuItem,
    Button, Divider, RadioGroup, FormControlLabel, Radio, IconButton, Chip
} from '@mui/material';
import { Close, FilterList } from '@mui/icons-material';
import { t } from '../i18n'; // تأكد من مسار الترجمة

export default function FilterDrawer({ open, onClose, onApply }) {
    // القيم الافتراضية (يمكنك ربطها بالـ State القادمة من الأب)
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [condition, setCondition] = useState('all');
    const [province, setProvince] = useState('');
    
    // قائمة المحافظات (مثال)
    const provinces = [
        { id: 1, name: 'بغداد' },
        { id: 2, name: 'البصرة' },
        { id: 3, name: 'أربيل' },
    ];

    const handleApply = () => {
        // إرسال البيانات للكومبوننت الأب لتنفيذ الفلترة
        onApply({ priceRange, condition, province });
        onClose();
    };

    const handleClear = () => {
        setPriceRange([0, 1000000]);
        setCondition('all');
        setProvince('');
    };

    return (
        <Drawer
            anchor="right" // تفتح من اليمين (أو اليسار حسب اللغة)
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { width: 320, p: 2 } }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterList color="primary" />
                    <Typography variant="h6" fontWeight="bold">تصفية النتائج</Typography>
                </Box>
                <IconButton onClick={onClose}><Close /></IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 1. السعر (Slider) */}
            <Box sx={{ mb: 4 }}>
                <Typography gutterBottom fontWeight="medium">نطاق السعر (د.ع)</Typography>
                <Slider
                    value={priceRange}
                    onChange={(e, val) => setPriceRange(val)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000000}
                    step={5000}
                    sx={{ mt: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">{priceRange[0].toLocaleString()}</Typography>
                    <Typography variant="caption" color="text.secondary">{priceRange[1].toLocaleString()}</Typography>
                </Box>
            </Box>

            {/* 2. الحالة (Condition) */}
            <Box sx={{ mb: 4 }}>
                <Typography gutterBottom fontWeight="medium">حالة المنتج</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {['all', 'new', 'used'].map((type) => (
                        <Chip 
                            key={type}
                            label={type === 'all' ? 'الكل' : type === 'new' ? 'جديد' : 'مستعمل'} 
                            onClick={() => setCondition(type)}
                            color={condition === type ? "primary" : "default"}
                            variant={condition === type ? "filled" : "outlined"}
                            clickable
                        />
                    ))}
                </Box>
            </Box>

            {/* 3. المحافظة */}
            <Box sx={{ mb: 4 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>المحافظة</InputLabel>
                    <Select
                        value={province}
                        label="المحافظة"
                        onChange={(e) => setProvince(e.target.value)}
                    >
                        <MenuItem value=""><em>الكل</em></MenuItem>
                        {provinces.map((p) => (
                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Footer Buttons */}
            <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={handleApply}
                    sx={{ borderRadius: 2, py: 1.2 }}
                >
                    تطبيق الفلتر
                </Button>
                <Button 
                    variant="outlined" 
                    color="error"
                    onClick={handleClear}
                    sx={{ borderRadius: 2 }}
                >
                    مسح
                </Button>
            </Box>
        </Drawer>
    );
}