import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Button, IconButton, Slide, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Close, Tune } from '@mui/icons-material';
import { t } from '../i18n';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FilterDrawer({ open, onClose, onApply }) {
    // القيم الافتراضية
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [condition, setCondition] = useState('all');
    const [province, setProvince] = useState('');

    const provinces = [
        { id: 'p-baghdad', name: 'بغداد' },
        { id: 'p-basra', name: 'البصرة' },
        { id: 'p-erbil', name: 'أربيل' },
        { id: 'p-najaf', name: 'النجف' }
    ];

    // ✅ عند الضغط على تطبيق
    const handleApply = () => {
        if (onApply) {
            onApply({ priceRange, condition, province });
        }
        onClose();
    };

    // مسح الفلاتر
    const handleClear = () => {
        setPriceRange([0, 2000000]);
        setCondition('all');
        setProvince('');
    };

    return (
        <Dialog 
        open={open}
         onClose={onClose}
          TransitionComponent={Transition}
           fullWidth
            maxWidth="xs"
            
            >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Tune color="primary" />
                    <Typography variant="h6">{t('filter_search') || "تصفية"}</Typography>
                </Box>
                <IconButton onClick={onClose}><Close /></IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* الحالة */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{t('condition') || "الحالة"}</Typography>
                    <RadioGroup row value={condition} onChange={(e) => setCondition(e.target.value)}>
                        <FormControlLabel value="all" control={<Radio />} label="الكل" />
                        <FormControlLabel value="new" control={<Radio />} label="جديد" />
                        <FormControlLabel value="used" control={<Radio />} label="مستعمل" />
                    </RadioGroup>
                </Box>

                {/* السعر */}
                <Box sx={{ mb: 3, px: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{t('price_range') || "السعر"}</Typography>
                    <Slider value={priceRange} onChange={(_, v) => setPriceRange(v)} min={0} max={2000000} step={25000} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption">{priceRange[0].toLocaleString()}</Typography>
                        <Typography variant="caption">{priceRange[1].toLocaleString()}</Typography>
                    </Box>
                </Box>

                {/* المحافظة */}
                <FormControl fullWidth size="small">
                    <InputLabel>{t('province') || "المحافظة"}</InputLabel>
                    <Select value={province} label="المحافظة" onChange={(e) => setProvince(e.target.value)}>
                        <MenuItem value=""><em>الكل</em></MenuItem>
                        {provinces.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={handleClear} color="error">{t('clear') || "مسح"}</Button>
                <Button onClick={handleApply} variant="contained">{t('apply') || "تطبيق"}</Button>
            </DialogActions>
        </Dialog>
    );
}