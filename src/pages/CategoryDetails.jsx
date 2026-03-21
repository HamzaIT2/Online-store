import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, Button } from "@mui/material";
import { t } from "../i18n";

const FALLBACK = {
  'c-electronics': ['هواتف وملحقاتها', 'حواسيب ولابتوبات', 'سماعات وساعات ذكية', 'أجهزة منزلية (خلاطات، مكانس، تلفزيونات...)'],
  'c-furniture': ['غرف نوم', 'غرف جلوس', 'مكاتب وكراسي', 'ديكورات منزلية'],
  'c-clothes': ['رجالي', 'نسائي', 'أطفال', 'أحذية وحقائب', 'إكسسوارات وساعات'],
  'c-beauty': ['مستحضرات تجميل', 'عطور', 'أجهزة عناية (سيشوار، ليزر، ...)'],
  'c-hobbies': ['رياضة ولياقة', 'أدوات موسيقية', 'كتب ومستلمات دراسة', 'ألعاب وهدايا'],
  'c-auto': ['سيارات مستعملة', 'دراجات', 'قطع غيار', 'إكسسوارات السيارات'],
};

export default function CategoryDetails() {
  const { id } = useParams(); // numeric id (API) or fallback slug
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const isNumeric = /^\d+$/.test(String(id));
    const load = async () => {
      if (isNumeric) {
        try {
          const res = await axiosInstance.get(`/categories/${id}`);
          const cat = res || {};
          setTitle(cat.nameAr || cat.name || "");
          const subsList = Array.isArray(cat.subCategories) ? cat.subCategories.map((s) => ({ id: s.categoryId, name: s.nameAr || s.name })) : [];
          if (subsList.length > 0) {
            setSubs(subsList);
            return;
          }
        } catch (err) {
          console.warn('Failed to load category:', err?.message);
          // fall through to fallback below if any
        }
      }

      // Fallback mapping by slug
      setTitle(
        id === 'c-electronics' ? 'إلكترونيات' :
          id === 'c-furniture' ? 'أثاث وديكور' :
            id === 'c-clothes' ? 'ملابس وأزياء' :
              id === 'c-beauty' ? 'جمال وصحة' :
                id === 'c-hobbies' ? 'أدوات وهوايات' :
                  id === 'c-auto' ? 'سيارات وملحقاتها' : ''
      );
      const list = FALLBACK[id] || [];
      setSubs(list.map((name, idx) => ({ id: `${id}-${idx}`, name })));
    };
    load();
  }, [id]);

  const openResults = (sub) => {
    const q = encodeURIComponent(sub.name);
    navigate(`/?category=${id}&q=${q}`);
  };

  return (
    <Container sx={{ mt: 4, direction: 'rtl' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'right' }}>
        {title || t('categories')}
      </Typography>
      {subs.length === 0 ? (
        <Typography color="text.secondary">{t('no_subs')}</Typography>
      ) : (
        <Grid container spacing={3}>
          {subs.map((s) => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 28px rgba(11,29,57,0.24)' }}>
                <CardActionArea onClick={() => openResults(s)}>
                  <Box sx={{ p: 3, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>{s.name}</Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/categories')}>{t('categories')}</Button>
      </Box>
    </Container>
  );
}

