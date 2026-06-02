import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Container, Typography, Box, Avatar, Divider, Grid, Card, CardActionArea, CardContent, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { t } from "../i18n";

const getCurrentLang = () => {
  try {
    return localStorage.getItem('lang') || 'ar';
  } catch {
    return 'ar';
  }
};

const FALLBACK_TILES = [
  {
    slug: 'c-electronics',
    id: 'fallback-elec',
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
    id: 'fallback-furn',
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
    id: 'fallback-cloth',
    title: { ar: 'ملابس وأزياء', en: 'Clothing and Fashion' },
    image: '/cat-clothes.svg',
    subs: [
      { ar: 'رجالي', en: 'Men' },
      { ar: 'نسائي', en: 'Women' },
      { ar: 'أطفال', en: 'Kids' },
      { ar: 'أحذية وحقائب', en: 'Shoes and Bags' },
      { ar: 'إكسسوارات شاشات وأجهزة', en: 'Accessories and Watches' }
    ]
  },
  {
    slug: 'c-beauty',
    id: 'fallback-beauty',
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
    id: 'fallback-hobby',
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
    id: 'fallback-auto',
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
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const getSubcategoryImage = (subName) => {
    if (!subName) return '/placeholder.svg';
    if (subName.includes('هواتف') || subName.includes('Phone')) return 'subcategories/phone.jpg';
    if (subName.includes('حواسيب') || subName.includes('Computer') || subName.includes('لابتوب') || subName.includes('labtop')) return 'subcategories/labtop.jpg';
    if (subName.includes('سماعات وساعات') || subName.includes('Headphones')) return 'subcategories/clock.jpg';
    if (subName.includes('اجهزة منزلية') || subName.includes('Home Appliances')) return 'subcategories/dvicehome.jpg';
    if (subName.includes('غرف نوم') || subName.includes('Bedrooms')) return 'subcategories/room.jpg';
    if (subName.includes('غرف جلوس') || subName.includes('Living Rooms')) return 'subcategories/room1.jpg';
    if (subName.includes('مكاتب وكراسي') || subName.includes('Desks and Chairs')) return 'subcategories/mm.jpg';
    if (subName.includes('ديكورات منزلية') || subName.includes('Home Decor')) return 'subcategories/mmm.jpg';
    if (subName.includes('قطع غيار') || subName.includes('Auto Parts')) return 'subcategories/quta.jpg';
    if (subName.includes('سيارات مستعملة') || subName.includes('Used Cars')) return 'subcategories/camry.jpg';
    if (subName.includes('دراجات') || subName.includes('Motorcycles')) return 'subcategories/bicke.jpg';
    if (subName.includes('أدوات موسيقية') || subName.includes('Musical Instruments')) return 'subcategories/music.jpg';
    if (subName.includes('رياضة ولياقة') || subName.includes('Sports and Fitness')) return 'subcategories/jem.jpg';
    if (subName.includes('ألعاب وهدايا') || subName.includes('Toys and Gifts')) return 'subcategories/game.jpg';
    if (subName.includes('كتب ومستلزمات دراسية') || subName.includes('Books and Stationery')) return 'subcategories/book.jpg';
    if (subName.includes('أجهزة عناية') || subName.includes('Personal Care')) return 'subcategories/dvicepersonal.jpg';
    if (subName.includes('عطور') || subName.includes('Perfumes')) return 'subcategories/ator.jpg';
    if (subName.includes('مستحضرات تجميل') || subName.includes('Beauty Products')) return 'subcategories/tjmel.jpg';
    if (subName.includes('إكسسوارات شاشات وأجهزة') || subName.includes('Accessories and Watches')) return 'subcategories/mobility.jpg';
    if (subName.includes('رجالي') || subName.includes('Men')) return 'subcategories/man.jpg';
    if (subName.includes('نسائي') || subName.includes('Women')) return 'subcategories/weman.jpg';
    if (subName.includes('أحذية وحقائب') || subName.includes('Shoes and Bags')) return 'subcategories/xy.jpg';
    return '/placeholder.svg';
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axiosInstance.get('/categories');
        const rawData = res.data !== undefined ? res.data : res;
        const data = Array.isArray(rawData) ? rawData : (rawData?.data || []);

        if (!mounted) return;

        if (data.length > 0) {
          // الباك اند يرسل البيانات مرتبة ومجمعة مسبقاً، لذلك فقط نعيد تنسيقها لتناسب التصميم
          const mapped = data.map((main) => ({
            id: main.id || main.category_id,
            title: {
              ar: main.name_ar || main.name || 'بدون اسم',
              en: main.name || main.name_ar || 'Unnamed'
            },
            image: main.icon || main.image || getSubcategoryImage(main.name || main.name_ar),
            // إعادة تنسيق الأقسام الفرعية بداخل القسم الرئيسي
            subs: Array.isArray(main.subs) ? main.subs.map(sub => ({
              id: sub.id || sub.category_id,
              ar: sub.name_ar || sub.name,
              en: sub.name || sub.name_ar,
              icon: sub.icon || sub.image || null,
            })) : []
          }));

          setItems(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);
  return (
    <Container sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        {t('categories')}
      </Typography>

      {items.map((category, index) => (
        <Box key={category.id || index}>
          {/* هيدر القسم الرئيسي */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', mb: 3, cursor: 'pointer' }}
            onClick={() => {
              if (category.id) {
                navigate(`/?categoryId=${category.id}`);
              }
            }}
          >
            <Avatar
              src={category.image}
              alt={getCurrentLang() === 'ar' ? category.title.ar : category.title.en}
              sx={{ width: 48, height: 48, mr: 2, bgcolor: 'primary.main' }}
            >
              {(getCurrentLang() === 'ar' ? category.title.ar : category.title.en).charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary' }}>
              {getCurrentLang() === 'ar' ? category.title.ar : category.title.en}
            </Typography>
          </Box>

          {/* شبكة الأقسام الفرعية */}
          {category.subs?.length > 0 ? (
            <Grid container spacing={2} sx={{ mb: 3, ml: 1 }}>
              {category.subs.map((sub, subIndex) => {
                const handleClick = () => {
                  if (sub.id) {
                    navigate(`/?categoryId=${sub.id}`);
                  }
                };

                return (
                  <Grid item xs={6} sm={4} md={3} key={sub.id || subIndex}>
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
                        <CardContent sx={{ p: 0, m: 2, textAlign: 'center' }}>
                          <CardMedia
                            component="img"
                            // 1. محاولة تحميل الصورة من السيرفر، وإلا التراجع فوراً للدالة الافتراضية
                            image={sub.icon ? `http://localhost:3000${sub.icon}` : getSubcategoryImage(sub.name_ar || sub.name || sub.ar || sub.en)}

                            alt={getCurrentLang() === 'ar' ? (sub.name_ar || sub.ar) : (sub.name || sub.en)}
                            sx={{ width: '100%', height: '120px', objectFit: 'cover', mb: 2, borderRadius: 1 }}

                            // 🚨 2. خط الدفاع الأخير: إذا فشل المتصفح في جلب الصورة من السيرفر (خطأ 404)، يتم تحويله للصورة الافتراضية فوراً
                            onError={(e) => {
                              e.target.src = getSubcategoryImage(sub.name_ar || sub.name || sub.ar || sub.en);
                            }}
                          />

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: '1rem',
                              color: 'primary.main', // تم تعديلها إلى primary.main لضمان ظهور اللون في MUI
                              textAlign: 'center',
                              lineHeight: 1.3,
                            }}
                          >
                            {/* 3. عرض الاسم وضمان عدم وجود قيم فارغة */}
                            {getCurrentLang() === 'ar'
                              ? (sub.name_ar || sub.ar || sub.name || 'بدون اسم')
                              : (sub.name || sub.en || sub.name_ar || 'Unnamed')}
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
                {t('no_subcategories')}
              </Typography>
            </Box>
          )}

          {index < items.length - 1 && (
            <Divider sx={{ my: 4, borderBottomWidth: 2 }} />
          )}
        </Box>
      ))}
    </Container>
  );
}



