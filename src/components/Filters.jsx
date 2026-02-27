import { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField, Slider, Typography } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

const IRAQ_PROVINCES_FALLBACK = [
  { provinceId: 'p-baghdad', nameAr: 'بغداد', nameEn: 'Baghdad' },
  { provinceId: 'p-basra', nameAr: 'البصرة', nameEn: 'Basra' },
  { provinceId: 'p-ninawa', nameAr: 'نينوى', nameEn: 'Nineveh' },
  { provinceId: 'p-erbil', nameAr: 'أربيل', nameEn: 'Erbil' },
  { provinceId: 'p-sulaymaniyah', nameAr: 'السليمانية', nameEn: 'Sulaymaniyah' },
  { provinceId: 'p-dohuk', nameAr: 'دهوك', nameEn: 'Dohuk' },
  { provinceId: 'p-karbala', nameAr: 'كربلاء', nameEn: 'Karbala' },
  { provinceId: 'p-najaf', nameAr: 'النجف', nameEn: 'Najaf' },
  { provinceId: 'p-babil', nameAr: 'بابل', nameEn: 'Babil' },
  { provinceId: 'p-wasit', nameAr: 'واسط', nameEn: 'Wasit' },
  { provinceId: 'p-dhiqar', nameAr: 'ذي قار', nameEn: 'Dhi Qar' },
  { provinceId: 'p-maysan', nameAr: 'ميسان', nameEn: 'Maysan' },
  { provinceId: 'p-diwaniya', nameAr: 'الديوانية', nameEn: 'Diwaniya' },
  { provinceId: 'p-kirkuk', nameAr: 'كركوك', nameEn: 'Kirkuk' },
  { provinceId: 'p-diyala', nameAr: 'ديالى', nameEn: 'Diyala' },
  { provinceId: 'p-anbar', nameAr: 'الأنبار', nameEn: 'Anbar' },
  { provinceId: 'p-salah', nameAr: 'صلاح الدين', nameEn: 'Salah ad Din' },
  { provinceId: 'p-muthanna', nameAr: 'المثنى', nameEn: 'Muthanna' },
];

// Get current language
const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};

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

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Trigger re-render by updating filters state
      setFilters(prev => ({ ...prev }));
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
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



    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6, direction: 'rtl' }}>
      {/* Condition segmented bar */}
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center',
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
      {/* Top row: Provinces dropdown + Price slider */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, alignItems: 'center' }}>
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
              {getCurrentLang() === 'ar' ? (p.nameAr || p.name) : (p.nameEn || p.name || p.nameAr)}
            </MenuItem>
          ))}
        </TextField>

        
      </Box>


    </Box>
  );
}
