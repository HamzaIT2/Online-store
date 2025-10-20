import { Grid, Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { t } from "../i18n";

const CATEGORIES = [
  {
    slug: 'c-electronics',
    title: 'إلكترونيات',
    image: '/cat-electronics.svg',
    subs: ['هواتف وملحقاتها', 'حواسيب ولابتوبات', 'سماعات وساعات ذكية', 'أجهزة منزلية (خلاطات، مكانس، تلفزيونات...)'],
  },
  {
    slug: 'c-furniture',
    title: 'أثاث وديكور',
    image: '/cat-furniture.svg',
    subs: ['غرف نوم', 'غرف جلوس', 'مكاتب وكراسي', 'ديكورات منزلية'],
  },
  {
    slug: 'c-clothes',
    title: 'ملابس وأزياء',
    image: '/cat-clothes.svg',
    subs: ['رجالي', 'نسائي', 'أطفال', 'أحذية وحقائب', 'إكسسوارات وساعات'],
  },
  {
    slug: 'c-beauty',
    title: 'جمال وصحة',
    image: '/cat-beauty.svg',
    subs: ['مستحضرات تجميل', 'عطور', 'أجهزة عناية (سيشوار، ليزر، ...)'],
  },
  {
    slug: 'c-hobbies',
    title: 'أدوات وهوايات',
    image: '/cat-hobbies.svg',
    subs: ['رياضة ولياقة', 'أدوات موسيقية', 'كتب ومستلمات دراسة', 'ألعاب وهدايا'],
  },
  {
    slug: 'c-auto',
    title: 'سيارات وملحقاتها',
    image: '/cat-auto.svg',
    subs: ['سيارات مستعملة', 'دراجات', 'قطع غيار', 'إكسسوارات السيارات'],
  },
];

export default function CategoryTiles() {
  const navigate = useNavigate();
  const goTo = (slug) => navigate(`/?category=${slug}`);

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'right' }}>
        {t('categories')}
      </Typography>
      <Grid container spacing={3}>
        {CATEGORIES.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.slug}>
            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 28px rgba(11,29,57,0.24)' }}>
              <CardActionArea onClick={() => goTo(c.slug)} sx={{ position: 'relative' }}>
                <Box sx={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  backgroundImage: `url(${c.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.65) 100%)' }} />
                <CardContent sx={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', textAlign: 'center', mb: 1 }}>
                    {c.title}
                  </Typography>
                  {Array.isArray(c.subs) && (
                    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', color: '#fff', textAlign: 'center', fontSize: 14 }}>
                      {c.subs.map((s, idx) => (
                        <Box component="li" key={idx} sx={{ opacity: 0.92 }}>
                          {s}
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

