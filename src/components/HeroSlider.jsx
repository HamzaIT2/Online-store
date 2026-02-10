// // src/components/HeroSlider.jsx

// import React from 'react';

// import Carousel from 'react-material-ui-carousel';

// import { Paper, Box, Typography, Button } from '@mui/material';

// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// import { useNavigate } from 'react-router-dom';



// // لاحظ هنا: المكون يستقبل "slides" كخاصية (Prop)

// export default function HeroSlider({ slides }) {

//     const navigate = useNavigate();



//     // حماية: إذا لم يتم تمرير صور، لا تعرض شيئاً

//     if (!slides || slides.length === 0) return null;



//     return (





//         <Carousel

//             animation="slide"

//             duration={1000}

//             interval={4000}

//             navButtonsAlwaysVisible={true}

//             indicators={true}

//             stopAutoPlayOnHover={false}

//             swipe={true}

//             indicatorIconButtonProps={{

//                 style: { padding: '5px', color: 'rgba(0,0,0,0.3)' }

//             }}

//             activeIndicatorIconButtonProps={{

//                 style: { color: '#1976d2' }

//             }}

//             NextIcon={<ArrowForwardIosIcon />}

//             PrevIcon={<ArrowBackIosIcon />}

//         >



//             {slides.map((slide) => (

//                 <Paper

//                     key={slide.id}

//                     elevation={11}

//                     sx={{

//                         position: 'relative',

//                         height: { xs: 400, md: 500, lg: 700 }, // ارتفاع متجاوب

//                         borderRadius: 3,

//                         overflow: 'hidden',

//                         backgroundImage: slide.image ? `url(${slide.image})` : 'none',

//                         backgroundSize: 'cover',

//                         backgroundPosition: 'center',

//                         backgroundColor: slide.bgColor || '#777',

//                         display: 'flex',

//                         alignItems: 'center',

//                         justifyContent: 'center',

//                         color: 'white',

//                         textAlign: 'center',

//                     }}

//                 >



//                     {/* طبقة التعتيم */}

//                     <Box

//                         sx={{

//                             position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',

//                             backgroundColor: 'rgba(0, 0, 0, 0.4)', zIndex: 1

//                         }}

//                     />



//                     {/* المحتوى */}

//                     <Box sx={{ position: 'relative', zIndex: 2, px: 3, maxWidth: '800px' }}>

//                         <Typography

//                             variant="h3"

//                             sx={{

//                                 fontWeight: 'bold', mb: 2,

//                                 textShadow: '2px 2px 4px rgba(0,0,0,0.8)',

//                                 fontSize: { xs: '1.8rem', md: '3rem' }

//                             }}

//                         >

//                             {slide.title}

//                         </Typography>



//                         <Typography

//                             variant="h6"

//                             sx={{

//                                 mb: 3,

//                                 textShadow: '1px 1px 2px rgba(0,0,0,0.8)',

//                                 fontSize: { xs: '1rem', md: '1.25rem' }

//                             }}

//                         >

//                             {slide.description}

//                         </Typography>



//                         <Button

//                             variant="contained"

//                             color="secondary" // يمكنك تغيير اللون

//                             size="large"

//                             onClick={() => navigate(slide.link)}

//                             sx={{

//                                 fontWeight: 'bold', px: 4, py: 1, borderRadius: 50,

//                                 boxShadow: '0 4px 14px 0 rgba(0,0,0,0.3)',

//                                 '&:hover': { transform: 'scale(1.05)' }

//                             }}

//                         >

//                             {slide.buttonText}

//                         </Button>

//                     </Box>

//                 </Paper>

//             ))}

//         </Carousel>

//     );

// }

//=============================-------------------------------=========================---------------------------=====================



// import React from 'react';

// import Carousel from 'react-material-ui-carousel';

// import { Paper, Box, Typography, Button, Skeleton, Container } from '@mui/material';

// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// import { useNavigate } from 'react-router-dom';



// export default function HeroSlider({ slides, loading }) {

//     const navigate = useNavigate();



//     // 1. حالة التحميل: نعرض هيكل (Skeleton)

//     if (loading) {

//         return (

//             <Box sx={{ height: { xs: 400, md: 500 }, borderRadius: 3, overflow: 'hidden', bgcolor: '#f0f0f0' }}>

//                 <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />

//             </Box>

//         );

//     }



//     // 2. حالة عدم وجود إعلانات (نعرض بانر افتراضي للموقع)

//     if (!slides || slides.length === 0) {

//         return (

//             <Paper

//                 elevation={6}

//                 sx={{

//                     position: 'relative',

//                     height: { xs: 400, md: 500 },

//                     borderRadius: 3,

//                     overflow: 'hidden',

//                     backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // خلفية متدرجة جميلة

//                     display: 'flex',

//                     alignItems: 'center',

//                     justifyContent: 'center',

//                     color: 'white',

//                     textAlign: 'center',

//                 }}

//             >

//                 <Box sx={{ p: 3 }}>

//                     <Typography variant="h3" fontWeight="bold" gutterBottom>

//                         أهلاً بك في متجر العراق

//                     </Typography>

//                     <Typography variant="h6" sx={{ mb: 3 }}>

//                         المكان الأفضل لبيع وشراء كل شيء

//                     </Typography>

//                     <Button 

//                         variant="contained" 

//                         color="secondary" 

//                         size="large"

//                         onClick={() => navigate('/products')} // يوجه لصفحة المنتجات العامة

//                         sx={{ borderRadius: 20, px: 4 }}

//                     >

//                         تصفح المنتجات

//                     </Button>

//                 </Box>

//             </Paper>

//         );

//     }



//     // 3. عرض السلايدر الطبيعي (للمنتجات المميزة)

//     return (

//         <Carousel

//             animation="slide"

//             duration={800}

//             interval={5000}

//             navButtonsAlwaysVisible={true}

//             indicators={true}

//             swipe={true}

//             indicatorIconButtonProps={{

//                 style: { padding: '5px', color: 'rgba(255,255,255,0.5)' }

//             }}

//             activeIndicatorIconButtonProps={{

//                 style: { color: '#fff' }

//             }}

//             NextIcon={<ArrowForwardIosIcon />}

//             PrevIcon={<ArrowBackIosIcon />}

//         >

//             {slides.map((slide) => (

//                 <Paper

//                     key={slide.id}

//                     elevation={10}

//                     sx={{

//                         position: 'relative',

//                         height: { xs: 400, md: 500, lg: 600 },

//                         borderRadius: 3,

//                         overflow: 'hidden',

//                         backgroundImage: slide.image ? `url(${slide.image})` : 'none',

//                         backgroundSize: 'cover',

//                         backgroundPosition: 'center',

//                         backgroundColor: '#333',

//                         display: 'flex',

//                         alignItems: 'center',

//                         justifyContent: 'center',

//                     }}

//                 >

//                     {/* طبقة تظليل لتوضيح النص */}

//                     <Box

//                         sx={{

//                             position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',

//                             background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)',

//                             zIndex: 1

//                         }}

//                     />



//                     {/* المحتوى */}

//                     <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2, mt: 10 }}>

//                         <Typography

//                             variant="h3"

//                             sx={{

//                                 fontWeight: '900', mb: 2, color: 'white',

//                                 textShadow: '2px 2px 10px rgba(0,0,0,0.8)',

//                                 fontSize: { xs: '2rem', md: '3.5rem' }

//                             }}

//                         >

//                             {slide.title}

//                         </Typography>



//                         <Typography

//                             variant="h5"

//                             sx={{

//                                 mb: 4, color: '#FFD700', // لون ذهبي للسعر

//                                 fontWeight: 'bold',

//                                 textShadow: '1px 1px 5px rgba(0,0,0,0.8)',

//                                 fontSize: { xs: '1.2rem', md: '2rem' }

//                             }}

//                         >

//                             {slide.description}

//                         </Typography>



//                         <Button

//                             variant="contained"

//                             color="primary"

//                             size="large"

//                             onClick={() => navigate(slide.link)}

//                             sx={{

//                                 fontSize: '1.1rem',

//                                 fontWeight: 'bold', px: 5, py: 1.5, borderRadius: 50,

//                                 boxShadow: '0 4px 15px rgba(33, 150, 243, .4)',

//                                 '&:hover': { transform: 'scale(1.05)', backgroundColor: '#1565c0' }

//                             }}

//                         >

//                             {slide.buttonText || "مشاهدة التفاصيل"}

//                         </Button>

//                     </Box>

//                 </Paper>

//             ))}

//         </Carousel>

//     );

// }



//=========-==------------------------------===============================





// import React from 'react';



// import { Paper, Box, Typography, Button, Skeleton } from '@mui/material';

// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// import { useNavigate } from 'react-router-dom';



// export default function HeroSlider({ slides, loading }) {

//     const navigate = useNavigate();



//     // 1. حالة التحميل: عرض Skeleton

//     if (loading) {

//         return (

//             <Box sx={{ height: { xs: 300, md: 500 }, borderRadius: 3, overflow: 'hidden', bgcolor: '#f0f0f0' }}>

//                 <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />

//             </Box>

//         );

//     }



//     // 2. حالة عدم وجود إعلانات (بانر افتراضي)

//     if (!slides || slides.length === 0) {

//         return (

//             <Paper

//                 elevation={6}

//                 sx={{

//                     position: 'relative',

//                     height: { xs: 300, md: 500 },

//                     borderRadius: 3,

//                     overflow: 'hidden',

//                     background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',

//                     display: 'flex',

//                     alignItems: 'center',

//                     justifyContent: 'center',

//                     color: 'white',

//                     textAlign: 'center',

//                 }}

//             >

//                 <Box sx={{ p: 3 }}>

//                     <Typography variant="h3" fontWeight="bold" gutterBottom>

//                         أهلاً بك في متجر العراق

//                     </Typography>

//                     <Typography variant="h6" sx={{ mb: 3 }}>

//                         المكان الأفضل لبيع وشراء كل شيء

//                     </Typography>

//                     <Button

//                         variant="contained"

//                         color="secondary"

//                         size="large"

//                         onClick={() => navigate('/products')} // يوجه لصفحة المنتجات العامة

//                         sx={{ borderRadius: 20, px: 4 }}

//                     >

//                         تصفح المنتجات

//                     </Button>

//                 </Box>

//             </Paper>

//         );

//     }



//     // 3. عرض السلايدر (الإعلانات المميزة)

//     return (

//         <Carousel

//             animation="slide"

//             duration={800}

//             interval={5000}

//             navButtonsAlwaysVisible={true}

//             indicators={true}

//             swipe={true}

//             NextIcon={<ArrowForwardIosIcon />}

//             PrevIcon={<ArrowBackIosIcon />}

//         >

//             {slides.map((slide) => (

//                 <Paper

//                     key={slide.id}

//                     elevation={10}

//                     sx={{

//                         position: 'relative',

//                         height: { xs: 300, md: 500 },

//                         borderRadius: 3,

//                         overflow: 'hidden',

//                         backgroundImage: slide.image ? `url(${slide.image})` : 'none',

//                         backgroundSize: 'cover',

//                         backgroundPosition: 'center',

//                         backgroundColor: slide.bgColor || '#333',

//                         display: 'flex',

//                         alignItems: 'center',

//                         justifyContent: 'center',

//                     }}

//                 >

//                     {/* طبقة تظليل */}

//                     <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.4)', zIndex: 1 }} />



//                     <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', px: 2, mt: 4 }}>

//                         <Typography

//                             variant="h3"

//                             sx={{

//                                 fontWeight: '900', mb: 2, color: 'white',

//                                 textShadow: '2px 2px 10px rgba(0,0,0,0.8)',

//                                 fontSize: { xs: '2rem', md: '3.5rem' }

//                             }}

//                         >

//                             {slide.title}

//                         </Typography>



//                         <Typography

//                             variant="h4"

//                             sx={{

//                                 mb: 4, color: '#FFD700', fontWeight: 'bold',

//                                 textShadow: '1px 1px 5px rgba(0,0,0,0.8)',

//                             }}

//                         >

//                             {slide.description}

//                         </Typography>



//                         <Button

//                             variant="contained"

//                             color="primary"

//                             size="large"

//                             onClick={() => navigate(slide.link)}

//                             sx={{ borderRadius: 50, px: 5, py: 1.5, fontSize: '1.1rem' }}

//                         >

//                             {slide.buttonText}

//                         </Button>

//                     </Box>

//                 </Paper>

//             ))}

//         </Carousel>

//     );

// }



//=-=-==-========


import React from 'react';
// استيراد مكتبة Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// استيراد ملفات الـ CSS الضرورية
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HeroSlider({ slides }) {
    const navigate = useNavigate();

    // حماية: إذا لم تكن هناك شرائح، لا تعرض شيئاً
    if (!slides || slides.length === 0) return null;

    return (
        <Box sx={{ width: '100%', height: '550px', position: 'relative' }}>
            <Swiper
                // تفعيل الموديولات: التنقل، النقاط، التشغيل التلقائي، وتأثير الاختفاء
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect={'fade'} // تأثير Fade يمنع مشاكل التراكب
                navigation={true} // إظهار الأسهم
                pagination={{ clickable: true }} // إظهار النقاط السفلية
                autoplay={{ delay: 5000, disableOnInteraction: false }} // تشغيل تلقائي كل 5 ثواني
                style={{ width: '100%', height: '100%' }}
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        {/* هنا الحل الجذري:
                           نستخدم الصورة كخلفية (Background Image)
                           بدلاً من عنصر img عادي
                        */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                // الصورة + طبقة سوداء خفيفة لتوضيح النص
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url("${slide.image}")`,
                                backgroundSize: 'cover',   // تغطية كامل المساحة
                                backgroundPosition: 'center', // توسيط الصورة
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#222' // لون احتياطي
                            }}
                        >
                            {/* المحتوى النصي فوق الصورة */}
                            <Container maxWidth="md" sx={{ textAlign: 'center', color: 'white' }}>
                                <Typography 
                                    variant="h2" 
                                    sx={{ 
                                        fontWeight: 800, 
                                        mb: 2,
                                        textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
                                        fontSize: { xs: '2rem', md: '3.5rem' }
                                    }}
                                >
                                    {slide.title}
                                </Typography>

                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 4, 
                                        color: '#FFD700', // لون ذهبي للسعر/الوصف
                                        fontWeight: 'bold',
                                        textShadow: '1px 1px 5px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    {slide.description}
                                </Typography>

                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate(slide.link)}
                                    sx={{
                                        borderRadius: '50px',
                                        px: 5,
                                        py: 1.5,
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        textTransform: 'none'
                                    }}
                                >
                                    {slide.buttonText}
                                </Button>
                            </Container>
                        </Box>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
}