import { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField, Slider, Typography } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

const IRAQ_PROVINCES_FALLBACK = [
  { provinceId: 'p-baghdad', nameAr: 'بغداد' },
  { provinceId: 'p-basra', nameAr: 'البصرة' },
  { provinceId: 'p-ninawa', nameAr: 'نينوى' },
  { provinceId: 'p-erbil', nameAr: 'أربيل' },
  { provinceId: 'p-sulaymaniyah', nameAr: 'السليمانية' },
  { provinceId: 'p-dohuk', nameAr: 'دهوك' },
  { provinceId: 'p-karbala', nameAr: 'كربلاء' },
  { provinceId: 'p-najaf', nameAr: 'النجف' },
  { provinceId: 'p-babil', nameAr: 'بابل' },
  { provinceId: 'p-wasit', nameAr: 'واسط' },
  { provinceId: 'p-dhiqar', nameAr: 'ذي قار' },
  { provinceId: 'p-maysan', nameAr: 'ميسان' },
  { provinceId: 'p-diwaniya', nameAr: 'الديوانية' },
  { provinceId: 'p-kirkuk', nameAr: 'كركوك' },
  { provinceId: 'p-diyala', nameAr: 'ديالى' },
  { provinceId: 'p-anbar', nameAr: 'الأنبار' },
  { provinceId: 'p-salah', nameAr: 'صلاح الدين' },
  { provinceId: 'p-muthanna', nameAr: 'المثنى' },
];

export default function Filters({ onFilterChange }) {
  const [provinces, setProvinces] = useState(IRAQ_PROVINCES_FALLBACK);
  const [filters, setFilters] = useState({
    province: "",
    condition: "",
    priceRange: [1000, 2000000],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get('/provinces');
        if (Array.isArray(res.data) && res.data.length) setProvinces(res.data);
      } catch (_) {
        // keep fallbacks
      }
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => {
      let v = value;
      if (field === 'priceRange' && Array.isArray(value)) {
        const a = Number(value[0] ?? 1000);
        const b = Number(value[1] ?? 2000000);
        v = [Math.min(a, b), Math.max(a, b)];
      }
      const next = { ...prev, [field]: v };
      return next;
    });
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const conditionOptions = [
    { label: t('condition_any'), value: '' },
    { label: t('condition_new'), value: 'new' },
    { label: t('condition_like_new'), value: 'like_new' },
    { label: t('condition_good'), value: 'good' },
    { label: t('condition_fair'), value: 'fair' },
    { label: t('condition_poor'), value: 'poor' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, direction: 'rtl' }}>
      {/* Top row: Provinces dropdown + Price slider */}
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, alignItems: 'center' }}>
        {/* Provinces dropdown */}
        <TextField
          select
          label={t('province')}
          value={filters.province}
          onChange={(e) => handleChange('province', e.target.value)}
          sx={{ minWidth: 240 }}
        >
          <MenuItem value="">{t('all_provinces')}</MenuItem>
          {provinces.map((p) => (
            <MenuItem key={p.provinceId} value={p.provinceId}>
              {p.nameAr || p.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Price slider */}
        <Box sx={{ width: '100%', px: 1, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
            {t('price_label')}
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={(_, v) => handleChange('priceRange', v)}
            valueLabelDisplay="auto"
            valueLabelFormat={(val) => Number(val).toLocaleString()}
            min={1000}
            max={2000000}
            step={1000}
            disableSwap
          />
        </Box>
      </Box>

      {/* Condition segmented bar */}
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 1,
        p: 1, borderRadius: 2,
        background: 'linear-gradient(90deg, #0b1d39 0%, #0f2b66 100%)',
      }}>
        {conditionOptions.map((opt) => {
          const selected = String(filters.condition) === String(opt.value);
          return (
            <Button key={opt.value || 'all'}
              onClick={() => handleChange('condition', selected ? '' : opt.value)}
              sx={{
                color: '#fff',
                backgroundColor: selected ? '#1b4f99' : 'transparent',
                '&:hover': { backgroundColor: selected ? '#2362bd' : 'rgba(255,255,255,0.12)' },
              }}
            >
              {opt.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
