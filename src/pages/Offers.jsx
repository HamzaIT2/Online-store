// import React, { useState, useEffect } from 'react';
// import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, Chip, Button, Skeleton } from '@mui/material';
// import { LocalOffer, Timer, ShoppingCart } from '@mui/icons-material';
// import { t } from '../i18n';
// import axiosInstance from '../api/axiosInstance';
// import { useNavigate } from 'react-router-dom';

// // مكون العداد التنازلي (Visual Effect)
// const FlashSaleTimer = () => {
//   const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
//         if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
//         if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
//         return prev;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 2 }}>
//       {['hours', 'minutes', 'seconds'].map((unit, i) => (
//         <Box key={i} sx={{ textAlign: 'center', bgcolor: 'white', color: 'error.main', p: 1.5, borderRadius: 2, boxShadow: 1, minWidth: 70 }}>
//           <Typography variant="h5" fontWeight="bold">
//             {String(timeLeft[unit]).padStart(2, '0')}
//           </Typography>
//           <Typography variant="caption" color="text.secondary">
//             {unit === 'hours' ? 'ساعة' : unit === 'minutes' ? 'دقيقة' : 'ثانية'}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// export default function Offers() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // هنا نجلب المنتجات التي عليها خصم فقط
//     const fetchOffers = async () => {
//       try {
//         // افترضنا أن الباك إند يقبل فلتر ?onSale=true
//         // أو يمكنك جلب المنتجات وفلترتها يدوياً
//         const response = await axiosInstance.get('/products', { params: { onSale: true } });

//         // إذا لم يكن لديك فلتر في الباك اند، استخدم هذا الكود المؤقت لفلترة المنتجات التي لها سعر قديم
//         // const allProducts = response.data;
//         // const discounted = allProducts.filter(p => p.oldPrice && p.oldPrice > p.price);

//         setProducts(response.data || []);
//       } catch (err) {
//         console.error("Failed to fetch offers", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOffers();
//   }, []);

//   return (
//     <Container maxWidth="xl" sx={{ mt: 5, mb: 8 }}>

//       {/* 1. الهيدر الحماسي (Flash Sale Banner) */}
//       <Box
//         sx={{
//           background: 'linear-gradient(135deg, #ff5252 0%, #b71c1c 100%)',
//           borderRadius: 4,
//           p: 4,
//           mb: 6,
//           color: 'white',
//           textAlign: 'center',
//           boxShadow: '0 8px 32px rgba(255, 82, 82, 0.3)'
//         }}
//       >
//         <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
//           <LocalOffer fontSize="large" /> {t('flash_sale') || "عروض نار"}
//         </Typography>
//         <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
//           {t('limited_time_offers') || "تخفيضات تصل إلى 50% على المنتجات المختارة - لفترة محدودة!"}
//         </Typography>

//         <FlashSaleTimer />
//       </Box>

//       {/* 2. شبكة المنتجات */}
//       <Grid container spacing={3}>
//         {loading ? (
//           // Skeleton Loading Effect
//           Array.from(new Array(4)).map((_, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
//               <Skeleton width="60%" sx={{ mt: 1 }} />
//               <Skeleton width="40%" />
//             </Grid>
//           ))
//         ) : products.length > 0 ? (
//           products.map((product) => {
//             // حساب نسبة الخصم
//             const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

//             return (
//               <Grid item xs={12} sm={6} md={3} key={product.id}>
//                 <Card
//                   sx={{
//                     position: 'relative',
//                     borderRadius: 3,
//                     transition: '0.3s',
//                     '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
//                     cursor: 'pointer'
//                   }}
//                   onClick={() => navigate(`/products/${product.productId}`)}
//                 >
//                   {/* شارة الخصم */}
//                   {discount > 0 && (
//                     <Chip
//                       label={`-${discount}%`}
//                       color="error"
//                       size="small"
//                       sx={{
//                         position: 'absolute',
//                         top: 10,
//                         left: 10,
//                         fontWeight: 'bold',
//                         zIndex: 1
//                       }}
//                     />
//                   )}

//                   <CardMedia
//                     component="img"
//                     height="220"
//                     image={product.images?.[0]?.url ? `http://localhost:3000/${product.images[0].url}` : '/placeholder.jpg'}
//                     alt={product.title}
//                     sx={{ objectFit: 'cover' }}
//                   />

//                   <CardContent>
//                     <Typography variant="subtitle1" fontWeight="bold" noWrap>
//                       {product.title}
//                     </Typography>

//                     {/* قسم السعر */}
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                       <Typography variant="h6" color="primary.main" fontWeight="bold">
//                         {Number(product.price).toLocaleString()} د.ع
//                       </Typography>
//                       {product.oldPrice && (
//                         <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
//                           {Number(product.oldPrice).toLocaleString()}
//                         </Typography>
//                       )}
//                     </Box>

//                     <Button
//                       variant="outlined"
//                       fullWidth
//                       sx={{ mt: 2, borderRadius: 2 }}
//                       startIcon={<ShoppingCart />}
//                     >
//                       {t('add_to_cart') || "شراء الآن"}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             );
//           })
//         ) : (
//           <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
//             <Typography variant="h5" color="text.secondary">
//               {t('no_offers') || "لا توجد عروض حالياً، تابعنا قريباً!"}
//             </Typography>
//           </Box>
//         )}
//       </Grid>
//     </Container>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, Chip, Button, Skeleton } from '@mui/material';
import { LocalOffer, ShoppingCart, AccessTime } from '@mui/icons-material';
import { t } from '../i18n';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer'; // تأكد من استيراد العداد الذي أنشأناه سابقاً

export default function Offers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true)
        // 1. نجلب كل المنتجات
        const response = await axiosInstance.get('/products');
        console.log("API Response Structure:", response);
        console.log("Response Data:", response.data);

        const allProducts = Array.isArray(response?.data) ? response.data : [];
        console.log("All Products after extraction:", allProducts)
        console.log("Number of products:", allProducts.length);

        // Check if the response has pagination metadata
        const pagination = response.data.pagination || response.data.meta || {};

        // If pagination is present, fetch all pages
        if (pagination.totalPages > 1) {
          const allPagesProducts = await Promise.all(
            Array.from({ length: pagination.totalPages }, (_, index) => {
              return axiosInstance.get('/products', {
                params: { page: index + 1 },
              });
            })
          );

          // Flatten the array of pages into a single array of products
          allProducts = allPagesProducts.flatMap((page) => page.data);
        }

        // 2. 🧠 الفلترة الذكية (هنا السحر)
        const activeOffers = allProducts.filter((p, index) => {
          console.log(`\n=== فحص المنتج رقم ${index + 1}: ${p.title} ===`);
          // ...
          const currentPrice = Number(p.price);
          const oldPrice = Number(p.oldPrice);

          console.log("البيانات الخام:", {
            price: p.price,
            oldPrice: p.oldPrice,
            offerExpiresAt: p.offerExpiresAt
          });

          // الشرط الأول: هل يوجد سعر قديم؟
          const hasDiscount = p.oldPrice && oldPrice > currentPrice;
          console.log(`hasDiscount: ${hasDiscount} (oldPrice: ${oldPrice}, currentPrice: ${currentPrice})`);

          // الشرط الثاني: هل الوقت لم ينتهِ بعد؟
          // (إذا كان التاريخ موجوداً نتحقق منه، وإذا لم يكن موجوداً نعتبر العرض دائم)
          const isNotExpired = p.offerExpiresAt
            ? new Date(p.offerExpiresAt) > new Date()
            : true;
          console.log(`isNotExpired: ${isNotExpired} (expiresAt: ${p.offerExpiresAt})`);

          const finalResult = hasDiscount && isNotExpired;
          console.log(`النتيجة النهائية: ${finalResult ? "✅ سيتم العرض" : "❌ لن يتم العرض"}`);

          return finalResult;
        });

        console.log(`\n=== النتائج النهائية ===`);
        console.log(`عدد المنتجات الإجمالي: ${allProducts.length}`);
        console.log(`عدد العروض النشطة: ${activeOffers.length}`);
        console.log("العروض النشطة:", activeOffers);

        setProducts(activeOffers);
      } catch (err) {
        console.error("Failed to fetch offers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 8 }}>

      {/* البانر العلوي */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          borderRadius: 4,
          p: 4,
          mb: 6,
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(211, 47, 47, 0.3)'
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <LocalOffer fontSize="large" /> {t('flash_sale') || "عروض لفترة محدودة"}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          اغتنم الفرصة قبل انتهاء الوقت!
        </Typography>
      </Box>

      {/* شبكة المنتجات */}
      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
              <Skeleton width="60%" sx={{ mt: 1 }} />
            </Grid>
          ))
        ) : products.length > 0 ? (
          products.map((product) => {
            // حساب نسبة الخصم
            const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

            return (
              <Grid item xs={12} sm={6} md={3} key={product.id || product.productId}>
                <Card
                  sx={{
                    position: 'relative',
                    borderRadius: 3,
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/products/${product.id || product.productId}`)}
                >
                  {/* شارة نسبة الخصم */}
                  <Chip
                    label={`-${discount}%`}
                    color="error"
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold', zIndex: 1 }}
                  />

                  {/* العداد التنازلي فوق الصورة (اختياري) */}
                  {product.offerExpiresAt && (
                    <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
                      <CountdownTimer targetDate={product.offerExpiresAt} />
                    </Box>
                  )}

                  <CardMedia
                    component="img"
                    height="220"
                    // معالجة رابط الصورة
                    image={product.images && product.images.length > 0
                      ? (product.images[0].url.startsWith('http') ? product.images[0].url : `http://localhost:3000${product.images[0].url.startsWith('/') ? '' : '/'}${product.images[0].url}`)
                      : '/placeholder.jpg'}
                    alt={product.title}
                    sx={{ objectFit: 'cover' }}
                  />

                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {product.title}
                    </Typography>

                    {/* الأسعار */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                      <Typography variant="h6" color="error.main" fontWeight="bold">
                        {Number(product.price).toLocaleString()} د.ع
                      </Typography>
                      <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                        {Number(product.oldPrice).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* تنبيه إذا قارب الوقت على الانتهاء */}
                    {product.offerExpiresAt && new Date(product.offerExpiresAt) < new Date(Date.now() + 86400000) && (
                      <Typography variant="caption" color="error" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} /> ينتهي قريباً جداً!
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2, borderRadius: 2 }}
                      startIcon={<ShoppingCart />}
                    >
                      شراء الآن
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              لا توجد عروض نشطة حالياً، تفقد الموقع لاحقاً!
            </Typography>
          </Box>
        )}
      </Grid>
    </Container>
  );
}