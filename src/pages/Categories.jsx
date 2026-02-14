import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";

import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, IconButton, Button, Popover, Grow } from "@mui/material";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { useNavigate } from "react-router-dom";

import { t } from "../i18n";

import Zoom from "@mui/material/Zoom";

// Always-visible fallback tiles

const FALLBACK_TILES = [

  { slug: 'c-electronics', title: 'إلكترونيات', image: '/cat-electronics.svg', subs: ['هواتف وملحقاتها', 'حواسيب ولابتوبات', 'سماعات وساعات ذكية', 'أجهزة منزلية'] },

  { slug: 'c-furniture', title: 'أثاث وديكور', image: '/cat-furniture.svg', subs: ['غرف نوم', 'غرف جلوس', 'مكاتب وكراسي', 'ديكورات منزلية'] },

  { slug: 'c-clothes', title: 'ملابس وأزياء', image: '/cat-clothes.svg', subs: ['رجالي', 'نسائي', 'أطفال', 'أحذية وحقائب', 'إكسسوارات وساعات'] },

  { slug: 'c-beauty', title: 'جمال وصحة', image: '/cat-beauty.svg', subs: ['مستحضرات تجميل', 'عطور', 'أجهزة عناية (سيشوار، ليزر، ...)'] },

  { slug: 'c-hobbies', title: 'أدوات وهوايات', image: '/cat-hobbies.svg', subs: ['رياضة ولياقة', 'أدوات موسيقية', 'كتب ومستلمات دراسة', 'ألعاب وهدايا'] },

  { slug: 'c-auto', title: 'سيارات وملحقاتها', image: '/cat-auto.svg', subs: ['سيارات مستعملة', 'دراجات', 'قطع غيار', 'إكسسوارات السيارات'] },

];



const imageFor = (name = '') => {

  const n = String(name);

  if (n.includes('إلكترون')) return '/cat-electronics.svg';

  if (n.includes('أثاث') || n.includes('ديكور')) return '/cat-furniture.svg';

  if (n.includes('ملابس') || n.includes('أزياء')) return '/cat-clothes.svg';

  if (n.includes('سيارات') || n.includes('سيارة')) return '/cat-auto.svg';

  if (n.includes('جمال') || n.includes('صحة')) return '/cat-beauty.svg';

  if (n.includes('هوايات') || n.includes('رياضة') || n.includes('كتب')) return '/cat-hobbies.svg';

  return '/placeholder.svg';

};



export default function Categories() {

  const [items, setItems] = useState(FALLBACK_TILES);

  const [anchorEl, setAnchorEl] = useState(null);

  const [openFor, setOpenFor] = useState(null);

  const navigate = useNavigate();



  useEffect(() => {

    let mounted = true;

    const load = async () => {

      try {

        const res = await axiosInstance.get('/categories');

        const data = Array.isArray(res.data) ? res.data : [];

        if (!mounted) return;

        if (data.length) {

          const mapped = data.map((c) => {

            // جلب الأقسام الفرعية

            const subCats = Array.isArray(c.subCategories) ? c.subCategories : [];

            const subs = subCats.length > 0

              ? subCats.map((s) => ({ id: String(s.categoryId), name: s.nameAr || s.name }))

              : []; // إذا لم تكن هناك أقسام فرعية من API، استخدم fallback



            return {

              slug: String(c.categoryId),

              title: c.nameAr || c.name,

              image: imageFor(c.nameAr || c.name),

              subs: subs.length > 0 ? subs : (FALLBACK_TILES.find(ft => ft.title === (c.nameAr || c.name))?.subs || []),

            };

          });

          setItems(mapped);

        }

      } catch (err) {

        console.warn('Failed to load categories:', err?.message);

        // keep fallback

      }

    };

    load();

    return () => { mounted = false; };

  }, []);



  const goTo = (slug) => navigate(`/?category=${slug}`);

  const openDetails = (slug) => navigate(`/categories/${slug}`);

  const handleOpenSubs = (event, slug) => {

    setAnchorEl(event.currentTarget);

    setOpenFor(slug);

  };

  const handleCloseSubs = () => {

    setAnchorEl(null);

    setOpenFor(null);

  };



  return (



    <Container sx={{ mt: 4 }}>

      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>

        {t('categories')}

      </Typography>

      <Grid container spacing={12}>

        {items.map((c) => (

          <Grid item xs={12} sm={6} md={4} key={c.slug} sx={{ display: 'flex' }}>

            <Card sx={{

              borderRadius: 7,

              overflow: 'hidden',

              boxShadow: '10px 10px 28px rgba(11,29,57,0.24)',

              display: 'flex',

              flexDirection: 'column',

              width: '100%',

              height: '90%'

            }}>

              {/* Image area: navigates to products */}

              <CardActionArea onClick={() => goTo(c.slug)} sx={{ position: 'relative' }}>

                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>

                  <Box sx={{ pt: '100%' }} />

                  <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${c.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform .3s ease', '&:hover': { transform: 'scale(1.02)' } }} />

                </Box>

                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.65) 100%)' }} />

              </CardActionArea>



              {/* Title row + popout icon to details page */}

              <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                  <Typography variant="h6" sx={{ fontWeight: 800 }}>

                    {c.title}

                  </Typography>

                  <IconButton color="primary" aria-label={t('show_more')} onClick={() => openDetails(c.slug)}>

                    <OpenInNewIcon />

                  </IconButton>

                </Box>

                <Box sx={{ mt: 'auto', pt: 1, textAlign: 'left' }}>

                  <Button size="small" onClick={(e) => handleOpenSubs(e, c.slug)}>{t('show_subs')}</Button>

                </Box>

              </CardContent>

            </Card>

          </Grid>

        ))}

      </Grid>



      {/* Popover for subcategories */}

      <Popover

        open={Boolean(anchorEl)}

        anchorEl={anchorEl}

        onClose={handleCloseSubs}

        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}

        transformOrigin={{ vertical: 'top', horizontal: 'center' }}

        PaperProps={{ sx: { p: 2, width: { xs: 320, sm: 420 }, maxWidth: '90vw' } }}

      >

        {(() => {

          const current = items.find((i) => i.slug === openFor);

          let list = current?.subs || [];



          // إذا لم تكن هناك أقسام فرعية، استخدم الـ fallback

          if (!list || list.length === 0) {

            const fallbackItem = FALLBACK_TILES.find(ft => ft.slug === openFor);

            if (fallbackItem && fallbackItem.subs) {

              list = fallbackItem.subs.map((name, idx) => ({

                id: `${openFor}-${idx}`,

                name: typeof name === 'string' ? name : name.name

              }));

            }

          }



          if (!list.length) {

            return (

              <Typography variant="body2" color="text.secondary">

                {t('no_subs')}

              </Typography>

            );

          }

          return (

            <Grid container spacing={2} sx={{ border: 2, borderRadius: 2 }}>

              {list.map((s, idx) => {

                const id = typeof s === 'object' && s !== null ? s.id : undefined;

                const name = typeof s === 'object' && s !== null ? s.name : String(s);

                const onClick = () => {

                  if (id) {

                    navigate(`/?category=${id}`);

                  } else if (openFor) {

                    const q = encodeURIComponent(name);

                    navigate(`/?category=${openFor}&q=${q}`);

                  }

                  handleCloseSubs();

                };

                return (

                  <Grid item size={{ xs: 12, sm: 6 }} key={id || `${openFor}-${idx}`}>

                    <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 28px rgba(11,29,57,0.24)' }}>

                      <CardActionArea onClick={onClick}>

                        <Zoom in={true} style={{ transitionDelay: `${idx * 200}ms` }} key={id || `${openFor}-${idx}`}>

                          <Box sx={{ p: 3, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%)' }}>

                            <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: 'center' }}>{name}</Typography>

                          </Box>

                        </Zoom>

                      </CardActionArea>

                    </Card>

                  </Grid>

                );

              })}

              <Grid item xs={12}>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

                  <Button onClick={() => { if (openFor) openDetails(openFor); handleCloseSubs(); }}>

                    {t('show_more')}

                  </Button>

                </Box>

              </Grid>

            </Grid>

          );

        })()}

      </Popover>

    </Container>



  );

}

