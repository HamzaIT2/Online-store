import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography,
    Slider, FormControl, InputLabel, Select, MenuItem, Button, IconButton,
    Slide, Chip, Card, CardContent, Avatar, useTheme
} from '@mui/material';
import {
    Close, Tune, AttachMoney, LocationOn, Category,
    Refresh, CheckCircle
} from '@mui/icons-material';
import { t } from '../i18n';
import axiosInstance from '../api/axiosInstance';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// Clean filter state interface
const initialFilterState = {
    provinceId: null,
    condition: null,
    minPrice: null,
    maxPrice: null
};

export default function FilterDrawer({ open, onClose, onApply }) {
    const theme = useTheme();

    // Clean filter state
    const [filters, setFilters] = useState(initialFilterState);
    const [priceRange, setPriceRange] = useState([0, 2000000]);

    // Dynamic provinces state
    const [provinces, setProvinces] = useState([]);

    // Fetch provinces from backend (same as AddProduct)
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const res = await axiosInstance.get('/provinces');

                const provincesData = res.data?.data || res.data || res || [];
                setProvinces(provincesData);

            } catch (err) {
                console.error("❌ Failed to load filter provinces:", err);
                console.error("❌ Error response:", err.response?.data);
                setProvinces([]);  // Set empty array on error
            }
        };
        loadProvinces();
    }, []);

    // Dynamic province options from backend data
    const provinceOptions = provinces.map((province) => {
        return {
            value: province.id || province.provinceId,  // Handle both id formats
            label: t(province.name) || province.name
        };
    });

    // Backend-compatible condition options with enum values
    const conditionOptions = [
        { value: 'new', label: t('new') || 'New', icon: '✨', color: '#4ecdc4' },
        { value: 'used', label: t('used') || 'Used', icon: '📦', color: '#ff9800' },
        { value: 'like_new', label: t('like_new') || 'Like New', icon: '🌟', color: '#45b7d1' },
        { value: 'bad', label: t('bad') || 'Bad', icon: '⚠️', color: '#f44336' }
    ];

    // Handle province change
    const handleProvinceChange = (event) => {
        const value = event.target.value;
        const parsedValue = value === '' ? null : parseInt(value, 10);

        setFilters(prev => ({
            ...prev,
            provinceId: parsedValue
        }));
    };

    // Handle condition change
    const handleConditionChange = (conditionValue) => {
        setFilters(prev => ({
            ...prev,
            condition: conditionValue
        }));
    };

    // Handle price range change
    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
        setFilters(prev => ({
            ...prev,
            minPrice: newValue[0] !== 0 ? newValue[0] : null,
            maxPrice: newValue[1] !== 2000000 ? newValue[1] : null
        }));
    };

    // Apply filters with clean payload
    const handleApply = () => {
        // Build clean filter payload - strip out null/undefined values
        const cleanPayload = {};

        if (filters.provinceId !== null) {
            cleanPayload.provinceId = filters.provinceId;
        }

        if (filters.condition !== null) {
            cleanPayload.condition = filters.condition;
        }

        if (filters.minPrice !== null) {
            cleanPayload.minPrice = filters.minPrice;
        }

        if (filters.maxPrice !== null) {
            cleanPayload.maxPrice = filters.maxPrice;
        }

        // Pass clean payload to parent
        if (onApply) {
            onApply(cleanPayload);
        }

        onClose();
    };

    // Clear all filters
    const handleClear = () => {
        setFilters(initialFilterState);
        setPriceRange([0, 2000000]);
    };

    // Get active filters count for UI
    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.provinceId !== null) count++;
        if (filters.condition !== null) count++;
        if (filters.minPrice !== null || filters.maxPrice !== null) count++;
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
                                {t('filter_search') || "Filter Search"}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                {getActiveFiltersCount()} {t('active_filters') || 'active filters'}
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
                {/* Province Section */}
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
                            <LocationOn sx={{ color: '#ff6b6b', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                                {t('province') || "Province"}
                            </Typography>
                        </Box>

                        <FormControl fullWidth>
                            <Select
                                value={filters.provinceId || ''}
                                onChange={handleProvinceChange}
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
                                    <em>{t('all_provinces') || 'All Provinces'}</em>
                                </MenuItem>
                                {provinceOptions.map((province) => (
                                    <MenuItem key={province.value} value={province.value}>
                                        {province.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </CardContent>
                </Card>

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
                                {t('condition') || "Condition"}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            {conditionOptions.map((option) => {
                                const selected = filters.condition === option.value;
                                return (
                                    <Card
                                        key={option.value}
                                        onClick={() => handleConditionChange(option.value)}
                                        sx={{
                                            cursor: 'pointer',
                                            border: selected ? `2px solid ${option.color}` : '2px solid transparent',
                                            background: selected ? `${option.color}15` : 'rgba(255, 255, 255, 0.8)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography variant="h4" sx={{ mb: 1 }}>{option.icon}</Typography>
                                            <Typography variant="body2" sx={{
                                                fontWeight: selected ? 'bold' : 'normal',
                                                color: selected ? option.color : '#666'
                                            }}>
                                                {option.label}
                                            </Typography>
                                            {selected && (
                                                <CheckCircle sx={{
                                                    fontSize: 16,
                                                    color: option.color,
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
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <AttachMoney sx={{ color: '#4ecdc4', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                                {t('price_range') || "Price Range"}
                            </Typography>
                        </Box>

                        <Box sx={{ px: 2, mb: 2 }}>
                            <Slider
                                value={priceRange}
                                onChange={handlePriceRangeChange}
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
                    {t('clear') || "Clear"}
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
                    {t('apply') || "Apply Filters"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}