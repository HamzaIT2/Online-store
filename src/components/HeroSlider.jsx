


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
        <Box sx={{
            width: '100%',
            height: { xs: 300, sm: 400, md: 500, lg: 600 },
            position: 'relative'
        }}>
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