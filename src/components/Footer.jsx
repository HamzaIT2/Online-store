import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, TextField, Button, Divider, Fade } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn, Email, Phone, Send, PrivacyTipOutlined, KeyboardArrowUp, Star, Security, SupportAgent, LocalShipping } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { t } from '../i18n';
import { PersonOutline } from '@mui/icons-material';
import { CartIcon } from './CartIcon';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HomeIcon from '@mui/icons-material/Home';

export default function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLinkClick = () => {
        scrollToTop();
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            setEmailError(t('email_required') || 'البريد الإلكتروني مطلوب');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError(t('email_invalid') || 'البريد الإلكتروني غير صحيح');
            return;
        }
        setEmailError('');
        alert(t('newsletter_success') || 'تم الاشتراك بنجاح!');
        setEmail('');
    };

    return (
        <>
            <Box
                component="footer"
                sx={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                    color: 'white',
                    pt: 6,
                    pb: 3,
                    mt: 8,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                        animation: 'gradient 3s ease infinite',
                    },
                    '@keyframes gradient': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' },
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Fade in timeout={1000}>
                        <Grid container spacing={4}>
                            {/* العمود الأول: معلومات المتجر */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {t('site_name')}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3, lineHeight: 1.8 }}>
                                        {t('footer_des')}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" sx={{ mb: 2, color: '#ffffff' }}>
                                        {t('follow_us') || "تابعنا"}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <SocialIconButton href="https://www.facebook.com/share/17uys4UtZJ/" color="#1877F2">
                                            <Facebook />
                                        </SocialIconButton>
                                        <SocialIconButton href="https://www.instagram.com/e.2.e.a?igsh=MTltYW1vdjRkbHM1" color="#E4405F">
                                            <Instagram />
                                        </SocialIconButton>
                                        <SocialIconButton href="https://x.com/HithamHamz75190" color="#1DA1F2">
                                            <Twitter />
                                        </SocialIconButton>
                                        <SocialIconButton href="https://www.linkedin.com/in/hamza-h-ahmed-173953180" color="#0077B5">
                                            <LinkedIn />
                                        </SocialIconButton>
                                    </Box>
                                </Box>

                                {/* معلومات الاتصال */}
                                <Box sx={{ mt: 3 }}>
                                    <ContactInfo icon={<Email />} text="hmzhkymr4@gmail.com" href="mailto:hmzhkymr4@gmail.com" />
                                    <ContactInfo icon={<Phone />} text="+964 782 292 5016" href="tel:+9647822925016" />
                                </Box>
                            </Grid>

                            {/* العمود الثاني: روابط سريعة */}
                            <Grid item xs={12} sm={6} md={2}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ffffff' }}>
                                    {t('quick_links') || "روابط سريعة"}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <EnhancedFooterLink to="/" onClick={handleLinkClick}>
                                        <HomeIcon />
                                        {t('home')}
                                    </EnhancedFooterLink>
                                    <EnhancedFooterLink to="/products" onClick={handleLinkClick}>
                                        <StorefrontIcon />
                                        {t('my_products')}
                                    </EnhancedFooterLink>
                                    <EnhancedFooterLink to="/offers" onClick={handleLinkClick}>
                                        <LocalOfferIcon />
                                        {t('offers')}
                                    </EnhancedFooterLink>
                                    <EnhancedFooterLink to="/favorites" onClick={handleLinkClick}>
                                        <Star />
                                        {t('favorites')}
                                    </EnhancedFooterLink>
                                </Box>
                            </Grid>

                            {/* العمود الثالث: خدمة العملاء */}
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ffffff' }}>
                                    {t('customer_service')}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <EnhancedFooterLink to="/profile" onClick={handleLinkClick}>
                                        <PersonOutline />
                                        {t('profile')}
                                    </EnhancedFooterLink>
                                    <EnhancedFooterLink to="/cart" onClick={handleLinkClick}>
                                        <CartIcon />
                                        {t('cart_title')}
                                    </EnhancedFooterLink>
                                    <EnhancedFooterLink to="/terms" onClick={handleLinkClick}>
                                        <PrivacyTipOutlined />
                                        {t('terms')}
                                    </EnhancedFooterLink>
                                    <EnhancedFooterLink to="/privacy" onClick={handleLinkClick}>
                                        <PrivacyTipOutlined />
                                        {t('privacy')}
                                    </EnhancedFooterLink>
                                </Box>
                            </Grid>

                            {/* العمود الرابع: النشرة البريدية والمميزات */}
                            <Grid item xs={12} md={3}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#ffffff' }}>
                                    {t('newsletter') || "النشرة البريدية"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3, lineHeight: 1.6 }}>
                                    {t('newsletter_desc') || "اشترك معنا ليصلك كل جديد وعروض حصرية."}
                                </Typography>

                                <Box component="form" onSubmit={handleNewsletterSubmit} sx={{ mb: 4 }}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder={t('email') || "البريد الإلكتروني"}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        error={!!emailError}
                                        helperText={emailError}
                                        sx={{
                                            bgcolor: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: 2,
                                            mb: 2,
                                            '& fieldset': {
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                borderRadius: 2
                                            },
                                            '&:hover fieldset': {
                                                border: '1px solid rgba(255, 255, 255, 0.3)'
                                            },
                                            '& input': { color: 'white' },
                                            '& input::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                                            '& .Mui-error': { color: '#ff6b6b' },
                                            '& .MuiFormHelperText-root': { color: '#ff6b6b' }
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                                            py: 1.5,
                                            borderRadius: 2,
                                            fontWeight: 'bold',
                                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #ff5252, #3db8b0)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)'
                                            }
                                        }}
                                    >
                                        <Send sx={{ ml: 1 }} />
                                        {t('subscribe') || "اشترك الآن"}
                                    </Button>
                                </Box>

                                {/* شعارات الثقة */}
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, color: '#ffffff' }}>
                                        {t('trust_badges') || "نضمن لك الأمان"}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <TrustBadge icon={<Security />} text={t('secure_payment') || "دفع آمن"} />
                                        <TrustBadge icon={<LocalShipping />} text={t('fast_delivery') || "توصيل سريع"} />
                                        <TrustBadge icon={<SupportAgent />} text={t('24_7_support') || "دعم 24/7"} />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Fade>

                    {/* قسم الإحصائيات */}
                    <Box sx={{ mt: 6, mb: 4 }}>
                        <Divider sx={{ mb: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                        <Grid container spacing={3} textAlign="center">
                            <Grid item xs={6} md={3}>
                                <StatBox number="10,000+" label={t('happy_customers') || "عميل سعيد"} />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <StatBox number="5,000+" label={t('products') || "منتج"} />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <StatBox number="98%" label={t('satisfaction') || "نسبة الرضا"} />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <StatBox number="24/7" label={t('support') || "دعم فني"} />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* قسم طرق الدفع */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, color: '#ffffff' }}>
                            {t('payment_methods') || "طرق الدفع المتاحة"}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <PaymentMethod name="Mastercard" />
                            <PaymentMethod name="Visa" />
                            <PaymentMethod name="PayPal" />
                            <PaymentMethod name="Cash on Delivery" />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 4, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                    {/* حقوق النشر */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#888888' }}>
                            © {new Date().getFullYear()} {t('site_name')}. {t('copyright') || "جميع الحقوق محفوظة."}
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* زر العودة للأعلى */}
            <Fade in={showBackToTop}>
                <IconButton
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        bgcolor: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        color: 'white',
                        width: 56,
                        height: 56,
                        boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
                        '&:hover': {
                            bgcolor: 'linear-gradient(45deg, #ff5252, #3db8b0)',
                            transform: 'scale(1.1)'
                        },
                        zIndex: 1000
                    }}
                >
                    <KeyboardArrowUp />
                </IconButton>
            </Fade>
        </>
    );
}

// مكونات مساعدة للتصميم المحسن
function SocialIconButton({ children, href, color }) {
    return (
        <IconButton
            component={Link}
            href={href}
            target="_blank"
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                width: 44,
                height: 44,
                transition: 'all 0.3s ease',
                '&:hover': {
                    bgcolor: color,
                    transform: 'translateY(-3px) scale(1.1)',
                    boxShadow: `0 8px 25px ${color}40`
                }
            }}
        >
            {children}
        </IconButton>
    );
}

function ContactInfo({ icon, text, href }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
                bgcolor: 'rgba(255, 107, 107, 0.2)',
                p: 1,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {React.cloneElement(icon, { sx: { color: '#ff6b6b', fontSize: 20 } })}
            </Box>
            <Link
                href={href}
                underline='none'
                sx={{
                    color: '#b0b0b0',
                    fontSize: '0.95rem',
                    transition: '0.3s',
                    '&:hover': { color: '#ff6b6b' }
                }}
            >
                {text}
            </Link>
        </Box>
    );
}

function EnhancedFooterLink({ to, children, onClick }) {
    return (
        <Link
            component={RouterLink}
            to={to}
            underline="none"
            onClick={onClick}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#b0b0b0',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem',
                padding: '8px 12px',
                borderRadius: 1,
                '&:hover': {
                    color: '#ff6b6b',
                    bgcolor: 'rgba(255, 107, 107, 0.1)',
                    transform: 'translateX(5px)',
                    '& svg': {
                        color: '#ff6b6b'
                    }
                },
                '& svg': {
                    fontSize: 18,
                    transition: 'color 0.3s ease'
                }
            }}
        >
            {children}
        </Link>
    );
}

function TrustBadge({ icon, text }) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 1,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
                bgcolor: 'rgba(255, 107, 107, 0.1)',
                borderColor: 'rgba(255, 107, 107, 0.3)',
                transform: 'translateY(-2px)'
            }
        }}>
            {React.cloneElement(icon, { sx: { color: '#4ecdc4', fontSize: 16 } })}
            <Typography variant="caption" sx={{ color: '#b0b0b0', fontSize: '0.75rem' }}>
                {text}
            </Typography>
        </Box>
    );
}

function StatBox({ number, label }) {
    return (
        <Box sx={{
            textAlign: 'center',
            py: 2,
            px: 1,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.3s ease',
            '&:hover': {
                bgcolor: 'rgba(255, 107, 107, 0.1)',
                borderColor: 'rgba(255, 107, 107, 0.2)',
                transform: 'translateY(-5px)'
            }
        }}>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    color: '#ff6b6b',
                    mb: 1,
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                {number}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                {label}
            </Typography>
        </Box>
    );
}

function PaymentMethod({ name }) {
    return (
        <Box sx={{
            px: 3,
            py: 1.5,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#b0b0b0',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
                bgcolor: 'rgba(78, 205, 196, 0.1)',
                borderColor: 'rgba(78, 205, 196, 0.3)',
                color: '#4ecdc4',
                transform: 'translateY(-2px)'
            }
        }}>
            {name}
        </Box>
    );
}
