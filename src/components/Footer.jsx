import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, TextField, Button, Divider } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn, Email, Phone, LocationOn, Send, PrivacyTipOutlined } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { t } from '../i18n'; // تأكد من مسار ملف الترجمة
import { PersonOutline } from '@mui/icons-material';
import { CartIcon } from './CartIcon';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HomeIcon from '@mui/icons-material/Home';
export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1a1a1a', // لون خلفية داكن فخم
                color: 'white',
                pt: 1,
                pb: 2,
                mt: 'auto', // يضمن بقاء الفوتر في الأسفل دائماً


            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={5}>

                    {/* العمود الأول: معلومات المتجر */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                            {t('site_name')}
                        </Typography>
                        {/* <Typography variant="body2" sx={{ color: 'grey.400', mb: 3, lineHeight: 1.8 }}>
                            {t('footer_des')}
                        </Typography> */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                aria-label="Facebook"
                            >
                                <Link
                                    sx={{ color: 'white', '&:hover': { color: '#1877F2' } }}
                                    href={"https://www.facebook.com/share/17uys4UtZJ/"}
                                    target="_blank"
                                >
                                    <Facebook />
                                </Link>


                            </IconButton>
                            <IconButton
                                aria-label="Instagram"
                                sx={{ color: 'white', '&:hover': { color: '#E4405F' } }}>
                                <Link
                                    sx={{ color: 'white', '&:hover': { color: '#E4405F' } }}
                                    href={"https://www.instagram.com/e.2.e.a?igsh=MTltYW1vdjRkbHM1"}
                                    target="_blank"
                                >
                                    <Instagram />
                                </Link>
                            </IconButton>
                            <IconButton
                                aria-label="Twitter"
                                sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }}>
                                <Link
                                    sx={{ color: 'white', '&:hover': { color: '#1DA1F2' } }}
                                    href={"https://x.com/HithamHamz75190"}
                                    target="_blank"
                                >
                                    <Twitter />
                                </Link>
                            </IconButton>
                            <IconButton
                                aria-label="LinkedIn"
                                sx={{ color: 'white', '&:hover': { color: '#0077B5' } }}>
                                <Link
                                    sx={{ color: 'white', '&:hover': { color: '#0077B5' } }}
                                    href={"https://www.linkedin.com/in/hamza-h-ahmed-173953180?utm_source=share_via&utm_content=profile&utm_medium=member_android"}
                                    target="_blank"
                                >
                                    <LinkedIn />
                                </Link>
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* العمود الثاني: روابط سريعة */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {t('quick_links') || "روابط سريعة"}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <FooterLink to="/">
                                <HomeIcon />
                                {t('home')}</FooterLink>
                            <FooterLink to="/products">
                                <StorefrontIcon />
                                {t('my_products')}</FooterLink>
                            <FooterLink to="/offers">
                                <LocalOfferIcon />
                                {t('offers')}</FooterLink>

                        </Box>
                    </Grid>

                    {/* العمود الثالث: خدمة العملاء والقانونية */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {t('customer_service')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <FooterLink to="/profile">

                                <PersonOutline />

                                {t('profile')}</FooterLink>
                            <FooterLink to="/cart">
                                <CartIcon />
                                {t('cart_title')}</FooterLink>
                            <FooterLink to="/terms">
                                <PrivacyTipOutlined />
                                {t('terms')}</FooterLink>
                            <FooterLink to="/privacy">
                                <PrivacyTipOutlined />
                                {t('privacy')}</FooterLink>
                        </Box>
                    </Grid>

                    {/* العمود الرابع: النشرة البريدية */}
                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                            {t('newsletter') || "النشرة البريدية"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'grey.400', mb: 2 }}>
                            {t('newsletter_desc') || "اشترك معنا ليصلك كل جديد وعروض حصرية."}
                        </Typography>
                        <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder={t('email') || "البريد الإلكتروني"}
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 1,
                                    '& fieldset': { border: 'none' }
                                }}
                            />
                            <Button variant="contained" color="primary" sx={{ minWidth: '50px' }}>
                                <Send fontSize="small" />
                            </Button>
                        </Box>

                        {/* معلومات الاتصال السريعة */}
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: 'grey.400' }}>
                                <Email fontSize="small" />
                                <Typography variant="body2">

                                    <Link
                                        href="mailto:hmzhkymr4@gmail.com"
                                        underline='none'
                                        sx={{
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            transition: '0.3s',
                                            '&:hover': { color: 'blue' }
                                        }}
                                    >
                                        hmzhkymr4@gmail.com
                                    </Link>

                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'grey.400' }}>
                                <Phone fontSize="small" />
                                <Typography variant="body2">

                                    <Link
                                        href="tel:+9647822925016"
                                        underline='none'
                                        sx={{
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            transition: '0.3s',
                                            '&:hover': { color: 'blue' }
                                        }}
                                        dir="ltr"
                                    >
                                        +964 782 292 5016
                                    </Link>

                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2, bgcolor: 'grey.800' }} />

                {/* حقوق النشر */}
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        © {new Date().getFullYear()} {t('site_name')}. {t('copyright') || "جميع الحقوق محفوظة."}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

// مكون صغير مساعد للروابط لتقليل تكرار الكود
function FooterLink({ to, children }) {
    return (
        <Link
            component={RouterLink}
            to={to}
            underline="none"
            sx={{
                color: 'grey.400',
                transition: '0.3s',
                fontSize: '0.95rem',
                '&:hover': {
                    color: 'primary.main',
                    paddingRight: '5px' // حركة بسيطة عند التمرير (للغة العربية)
                }
            }}
        >
            {children}
        </Link>
    );
}