import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";

import { Container, Typography, Box, Avatar, Chip, Divider, Grid, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";

import CategoryIcon from "@mui/icons-material/Category";

import { useNavigate } from "react-router-dom";

import { t } from "../i18n";

// Get current language
const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};


// Always-visible fallback tiles with bilingual support
const FALLBACK_TILES = [
  {
    slug: 'c-electronics',
    title: { ar: 'إلكترونيات', en: 'Electronics' },
    image: '/cat-electronics.svg',
    subs: [
      { ar: 'هواتف وملحقاتها', en: 'Phones and Accessories' },
      { ar: 'حواسيب ولابتوبات', en: 'Computers and Laptops' },
      { ar: 'سماعات وساعات ذكية', en: 'Smart Watches and Headphones' },
      { ar: 'أجهزة منزلية', en: 'Home Appliances' }
    ]
  },
  {
    slug: 'c-furniture',
    title: { ar: 'أثاث وديكور', en: 'Furniture and Decor' },
    image: '/cat-furniture.svg',
    subs: [
      { ar: 'غرف نوم', en: 'Bedrooms' },
      { ar: 'غرف جلوس', en: 'Living Rooms' },
      { ar: 'مكاتب وكراسي', en: 'Desks and Chairs' },
      { ar: 'ديكورات منزلية', en: 'Home Decor' }
    ]
  },
  {
    slug: 'c-clothes',
    title: { ar: 'ملابس وأزياء', en: 'Clothing and Fashion' },
    image: '/cat-clothes.svg',
    subs: [
      { ar: 'رجالي', en: 'Men' },
      { ar: 'نسائي', en: 'Women' },
      { ar: 'أطفال', en: 'Kids' },
      { ar: 'أحذية وحقائب', en: 'Shoes and Bags' },
      { ar: 'إكسسوارات وساعات', en: 'Accessories and Watches' }
    ]
  },
  {
    slug: 'c-beauty',
    title: { ar: 'جمال وصحة', en: 'Beauty and Health' },
    image: '/cat-beauty.svg',
    subs: [
      { ar: 'مستحضرات تجميل', en: 'Cosmetics' },
      { ar: 'عطور', en: 'Perfumes' },
      { ar: 'أجهزة عناية', en: 'Personal Care' }
    ]
  },
  {
    slug: 'c-hobbies',
    title: { ar: 'أدوات وهوايات', en: 'Tools and Hobbies' },
    image: '/cat-hobbies.svg',
    subs: [
      { ar: 'رياضة ولياقة', en: 'Sports and Fitness' },
      { ar: 'أدوات موسيقية', en: 'Musical Instruments' },
      { ar: 'كتب ومستلزمات دراسية', en: 'Books and Stationery' },
      { ar: 'ألعاب وهدايا', en: 'Toys and Gifts' }
    ]
  },
  {
    slug: 'c-auto',
    title: { ar: 'سيارات وملحقاتها', en: 'Cars and Accessories' },
    image: '/cat-auto.svg',
    subs: [
      { ar: 'سيارات مستعملة', en: 'Used Cars' },
      { ar: 'دراجات', en: 'Motorcycles' },
      { ar: 'قطع غيار', en: 'Auto Parts' },
      { ar: 'إكسسوارات السيارات', en: 'Car Accessories' }
    ]
  }
];






export default function Categories() {

  const [items, setItems] = useState(FALLBACK_TILES);


  const navigate = useNavigate();


  // دالة يدوية لربط اسم القسم بالصورة الخاصة به - تدعم العربية والإنجليزية
  const getSubcategoryImage = (subName) => {
    if (!subName) return '/placeholder.svg';

    // ابدأ بإضافة صورك هنا بناءً على الكلمات المفتاحية
    if (subName.includes('هواتف') || subName.includes('Phone')) return 'subcategories/phone.jpg';
    if (subName.includes('حواسيب') || subName.includes('Computer') || subName.includes('لابتوب') || subName.includes('labtop')) return 'subcategories/labtop.jpg';
    if (subName.includes('سماعات وساعات') || subName.includes('Headphones')) return 'subcategories/clock.jpg';
    if (subName.includes('أجهزة منزلية') || subName.includes('Home Appliances')) return 'subcategories/dvicehome.jpg';
    if (subName.includes('غرف نوم') || subName.includes('Bedrooms')) return 'subcategories/room.jpg';
    if (subName.includes('غرف جلوس') || subName.includes('Living Rooms')) return 'subcategories/room1.jpg';
    if (subName.includes('مكاتب وكراسي') || subName.includes('Desks and Chairs')) return 'subcategories/mm.jpg';
    if (subName.includes('ديكورات منزلية') || subName.includes('Home Decor')) return 'subcategories/mmm.jpg';


    // هذه الصورة ستظهر إذا لم تقم بإضافة صورة للقسم بعد
    return '/placeholder.svg';
  };



  useEffect(() => {

    let mounted = true;

    const load = async () => {

      try {

        const res = await axiosInstance.get('/categories');

        const data = Array.isArray(res.data) ? res.data : [];

        if (!mounted) return;

        if (data.length) {

          const mapped = data.map((c) => ({

            id: c.id,

            slug: String(c.slug || c.id || ''),

            title: c.title || 'بدون اسم',

            image: c.image !== '/placeholder.svg' ? c.image : getSubcategoryImage(c.title),

            subs: Array.isArray(c.subs) ? c.subs : [],

          }));

          setItems(mapped);

        }

      } catch (err) {

        // keep fallback

      }

    };

    load();

    return () => { mounted = false; };

  }, []);









  return (

    <Container sx={{ mt: 4, mb: 4 }}>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>

        {t('categories')}

      </Typography>

      {items.map((category, index) => (

        <Box key={category.id || index}>

          {/* Main Category Header */}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>

            <Avatar

              src={category.image}

              alt={category.title}

              sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}

            >

              {typeof category.title === 'object'
                ? (getCurrentLang() === 'ar' ? category.title.ar : category.title.en).charAt(0) || ''
                : (category.title || '').charAt(0) || ''
              }

            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {typeof category.title === 'object'
                ? (getCurrentLang() === 'ar' ? category.title.ar : category.title.en)
                : category.title || 'قسم بدون اسم'
              }
            </Typography>

          </Box>

          {/* Subcategories Grid */}

          {category.subs?.length > 0 ? (

            <Grid container spacing={2} sx={{ mb: 3, ml: 7 }}>

              {category.subs.filter(Boolean).map((sub, subIndex) => {
                // Handle both string and object formats for subcategories
                const subValue = typeof sub === 'string' ? sub : (sub.en || sub.ar || sub);

                const handleClick = () => {
                  const query = encodeURIComponent(subValue || '');

                  // Create a unique ID for the subcategory using category.id and subIndex
                  const subcategoryId = `${category.id}-${subIndex}`;

                  navigate(`/?categoryId=${subcategoryId}&q=${query}`);
                };

                return (

                  <Grid item xs={6} sm={4} md={3} key={subIndex}>

                    <Card

                      elevation={1}

                      sx={{

                        borderRadius: 2,

                        '&:hover': {

                          transform: 'scale(1.02)',

                          transition: 'transform 0.2s ease'

                        }

                      }}

                    >

                      <CardActionArea onClick={handleClick}>

                        <CardContent sx={{ p: 0, m: 5, textAlign: 'center' }}>

                          <CardMedia

                            component="img"

                            image={getSubcategoryImage(subValue)}

                            alt={subValue}

                            sx={{ width: '100%', height: '120px', objectFit: 'cover', mb: 2 }}

                          />

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              color: 'primary.dark',
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}
                          >
                            {typeof sub === 'object'
                              ? (getCurrentLang() === 'ar' ? sub.ar : sub.en)
                              : sub
                            }
                          </Typography>

                        </CardContent>

                      </CardActionArea>

                    </Card>

                  </Grid>

                );

              })}

            </Grid>

          ) : (

            <Box sx={{ ml: 7, mb: 3 }}>

              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>

                لا توجد أقسام فرعية

              </Typography>

            </Box>

          )}

          {/* Divider - only show if not the last item */}

          {index < items.length - 1 && (

            <Divider sx={{ my: 4, borderBottomWidth: 2 }} />

          )}

        </Box>

      ))}

    </Container>

  );

}
