import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography,
    Slider, FormControl, InputLabel, Select, MenuItem, Button, IconButton,
    Slide, RadioGroup, FormControlLabel, Radio, Chip, Card, CardContent,
    Avatar, Divider, useTheme
} from '@mui/material';
import {
    Close, Tune, AttachMoney, LocationOn, Category,
    Refresh, CheckCircle, FilterList
} from '@mui/icons-material';
import { t } from '../i18n';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FilterDrawer({ open, onClose, onApply }) {
    const theme = useTheme();
    // القيم الافتراضية
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [condition, setCondition] = useState('all');
    const [province, setProvince] = useState('');

    const provinces = [
        { id: 'p-baghdad', name: 'بغداد' },
        { id: 'p-basra', name: 'البصرة' },
        { id: 'p-erbil', name: 'أربيل' },
        { id: 'p-najaf', name: 'النجف' },
        { id: 'p-sulaymaniyah', name: 'السليمانية' },
        { id: 'p-dohuk', name: 'دهوك' },
        { id: 'p-karbala', name: 'كربلاء' },
        { id: 'p-mosul', name: 'الموصل' },
        { id: 'p-ninawa', name: 'نينوى' },
        { id: 'p-anbar', name: 'الأنبار' },
        { id: 'p-diyala', name: 'ديالى' },
        { id: 'p-wasit', name: 'واسط' },
        { id: 'p-maysan', name: 'ميسان' },
        { id: 'p-dhiqar', name: 'ذي قار' },
        { id: 'p-babil', name: 'بابل' },
        { id: 'p-kirkuk', name: 'كركوك' },
        { id: 'p-salah', name: 'صلاح الدين' },
        { id: 'p-muthanna', name: 'المثنى' },
        { id: 'p-diwaniya', name: 'الديوانية' }
    ];

    const conditionOptions = [
        { value: 'all', label: 'الكل', icon: '🔍', color: '#667eea' },
        { value: 'new', label: 'جديد', icon: '✨', color: '#4ecdc4' },
        { value: 'like_new', label: 'مثل جديد', icon: '🌟', color: '#45b7d1' },
        { value: 'good', label: 'جيد', icon: '👍', color: '#96ceb4' },
        { value: 'fair', label: 'متوسط', icon: '👌', color: '#feca57' },
        { value: 'poor', label: 'ضعيف', icon: '⚠️', color: '#ff6b6b' }
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

    const getActiveFiltersCount = () => {
        let count = 0;
        if (priceRange[0] !== 0 || priceRange[1] !== 2000000) count++;
        if (condition !== 'all') count++;
        if (province) count++;
        return count;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)'
                }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                p: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 3
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{
                            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                            width: 48,
                            height: 48
                        }}>
                            <Tune sx={{ color: '#fff', fontSize: 24 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                {t('filter_search') || "تصفية البحث"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {getActiveFiltersCount()} فلتر نشط
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            onClick={handleClear}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'rotate(180deg)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <Refresh />
                        </IconButton>
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    transform: 'rotate(90deg)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{
                p: 0,
                background: 'rgba(255, 255, 255, 0.05)',
                minHeight: 400
            }}>
                {/* Condition Section */}
                <Card sx={{
                    mx: 3,
                    mt: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Category sx={{ color: '#667eea', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                                {t('condition') || "حالة المنتج"}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            {conditionOptions.map((opt) => {
                                const selected = condition === opt.value;
                                return (
                                    <Card
                                        key={opt.value}
                                        onClick={() => setCondition(opt.value)}
                                        sx={{
                                            cursor: 'pointer',
                                            border: selected ? `2px solid ${opt.color}` : '2px solid transparent',
                                            background: selected ? `${opt.color}15` : 'rgba(255, 255, 255, 0.8)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ mb: 1 }}>{opt.icon}</Typography>
                                            <Typography variant="body2" sx={{
                                                fontWeight: selected ? 'bold' : 'normal',
                                                color: selected ? opt.color : '#666'
                                            }}>
                                                {opt.label}
                                            </Typography>
                                            {selected && (
                                                <CheckCircle sx={{
                                                    fontSize: 16,
                                                    color: opt.color,
                                                    mt: 1
                                                }} />
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    </CardContent>
                </Card>

                {/* Price Range Section */}
                <Card sx={{
                    mx: 3,
                    mt: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <AttachMoney sx={{ color: '#4ecdc4', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                                {t('price_range') || "نطاق السعر"}
                            </Typography>
                        </Box>

                        <Box sx={{ px: 2, mb: 2 }}>
                            <Slider
                                value={priceRange}
                                onChange={(_, v) => setPriceRange(v)}
                                min={0}
                                max={2000000}
                                step={25000}
                                valueLabelDisplay="auto"
                                sx={{
                                    '& .MuiSlider-thumb': {
                                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                                        border: '3px solid #fff',
                                        width: 24,
                                        height: 24,
                                        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)'
                                    },
                                    '& .MuiSlider-track': {
                                        background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                                        height: 8,
                                        borderRadius: 4
                                    },
                                    '& .MuiSlider-rail': {
                                        background: 'rgba(0, 0, 0, 0.1)',
                                        height: 8,
                                        borderRadius: 4
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            px: 2
                        }}>
                            <Chip
                                label={`${priceRange[0].toLocaleString()} د.ع`}
                                size="small"
                                sx={{
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Chip
                                label={`${priceRange[1].toLocaleString()} د.ع`}
                                size="small"
                                sx={{
                                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Province Section */}
                <Card sx={{
                    mx: 3,
                    mt: 3,
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <LocationOn sx={{ color: '#ff6b6b', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                                {t('province') || "المحافظة"}
                            </Typography>
                        </Box>

                        <FormControl fullWidth>
                            <Select
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                displayEmpty
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        borderRadius: 2,
                                        '&:hover': {
                                            background: 'rgba(255, 255, 255, 1)',
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>جميع المحافظات</em>
                                </MenuItem>
                                {provinces.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>
            </DialogContent>

            {/* Footer Actions */}
            <DialogActions sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                gap: 2
            }}>
                <Button
                    onClick={handleClear}
                    variant="outlined"
                    sx={{
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        color: '#fff',
                        px: 3,
                        py: 1.5,
                        borderRadius: 3,
                        '&:hover': {
                            borderColor: '#fff',
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                        }
                    }}
                >
                    {t('clear') || "مسح"}
                </Button>
                <Button
                    onClick={handleApply}
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        color: '#fff',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #ff5252, #3db8b0)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 30px rgba(255, 107, 107, 0.6)'
                        }
                    }}
                >
                    {t('apply') || "تطبيق الفلاتر"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}