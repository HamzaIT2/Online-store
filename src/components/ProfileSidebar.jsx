import React, { act, useEffect, useState } from 'react';
import {
    Drawer, Box, Typography, Avatar, List, ListItem,
    ListItemIcon, ListItemText, Divider, IconButton, Switch, Skeleton, Badge,
    ListItemButton,
    Button,
    MenuItem
} from '@mui/material';
import {
    Store, Logout, Language, DarkMode, Close, FavoriteBorderOutlined,
    PersonOutlined, AddCircle, Campaign,
    LocalOfferOutlined
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import MessageIcon from '@mui/icons-material/Message';
import { useTheme } from "../context/ThemeContext";
import { CartIcon } from "./CartIcon";
import { hex } from 'framer-motion';

// 1️⃣ زر الثيم (الشمس والقمر)
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

// 2️⃣ زر اللغة (IOS Style) 👈 تمت إضافته هنا
const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#65C466',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

export default function ProfileDrawer({ open, onClose }) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [favCount, setFavCount] = useState(0);
    const [offerCount, setOfferCount] = useState(0);
    const { darkMode, toggleDarkMode } = useTheme();
    const currentLang = localStorage.getItem('lang') || 'ar';
    const isRTL = currentLang === 'ar';
    const drawerAnchor = isRTL ? 'right' : 'left';

    const fancyItemSx = {
        borderRadius: '12px',
        mb: 1.5,
        mx: 1,
        border: '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        '&:hover': {
            bgcolor: 'primary.main',
            color: '#fff',
            transform: `scale(1.03) translateX(${isRTL ? '-5px' : '5px'})`,
            boxShadow: (theme) => `0 8px 20px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
            '& .MuiListItemIcon-root': {
                color: '#fff',
                transform: 'scale(1.2) rotate(10deg)',
            },
            '& .MuiTypography-root': {
                fontWeight: 'bold',
            },
            '& .MuiBadge-badge': {
                bgcolor: '#fff',
                color: 'primary.main',
                fontWeight: 'bold'
            }
        },
    };

    // --- Data Fetching Logic (Same as before) ---
    useEffect(() => {
        const fetchData = async () => {
            // Check if user is authenticated
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                setUserData(null);
                setFavCount(0);
                return; // Don't make API calls for guests
            }

            try {
                setLoading(true);
                const [userRes, favRes] = await Promise.allSettled([
                    axiosInstance.get('/users/profile'),
                    axiosInstance.get('/favorites/my-favorites')
                ]);

                if (userRes.status === 'fulfilled') setUserData(userRes.value);
                if (favRes.status === 'fulfilled') {
                    // Handle paginated response: { data: productsArray, total: number }
                    const list = favRes.value?.data || [];
                    setFavCount(Array.isArray(list) ? list.length : 0);
                }
            } catch (error) {
                console.error("Error fetching drawer data", error);
            } finally {
                setLoading(false);
            }
        };
        if (open) fetchData();
    }, [open]);

    // Cart Logic
    useEffect(() => {
        let mounted = true;
        const loadCart = () => {
            try {
                const cartData = JSON.parse(localStorage.getItem(isRTL ? `cart_user_${userData?.id || 'guest'}` : 'cart') || '[]');
                const legacyData = JSON.parse(localStorage.getItem('cart') || '[]');
                const finalData = cartData.length > 0 ? cartData : legacyData;
                if (mounted) setCartCount(Array.isArray(finalData) ? finalData.length : 0);
            } catch (_) {
                if (mounted) setCartCount(0);
            }
        };
        loadCart();
        const onCartUpdated = () => loadCart();
        window.addEventListener('cart:updated', onCartUpdated);
        return () => {
            mounted = false;
            window.removeEventListener('cart:updated', onCartUpdated);
        };
    }, [userData]);

    // Favorite Logic
    useEffect(() => {
        let mounted = true;
        const loadFavCount = async () => {
            // ... (نفس الكود الخاص بك للمفضلة)
        };
        const onUpdated = () => loadFavCount();
        window.addEventListener('favorites:updated', onUpdated);
        return () => window.removeEventListener('favorites:updated', onUpdated);
    }, []);

    const getImageUrl = (img) => {
        if (!img) return null;

        // If it's already a full URL, return as-is
        if (img.startsWith('http') || img.startsWith('blob:') || img.startsWith('data:')) {
            return img;
        }

        // For /uploads/ paths, return as-is (Vite proxy will handle it)
        if (img.startsWith('/uploads/')) {
            return img;
        }

        // If it starts with uploads/ without leading slash, add it
        if (img.startsWith('uploads/')) {
            return `/${img}`;
        }

        // Otherwise, assume it's a relative path
        return img;
    };

    // Count Offers


    // useEffect(()=>{
    //     const fetchOffersCount = async ()=>{
    //         try{
    //             const response =await axiosInstance.get('/products');
    //             const allProducts = Array.isArray(response.data) ? response.data :(response.data.products || []);

    //             const activeOffers = allProducts.filter(p=>{
    //                 const currerntPrice = parseFloat(p.price);
    //                 const oldPriceRaw = parseFloat(p.oldPrice);
    //                 if(isNaN(currerntPrice) || isNaN(oldPriceRaw)) return false;

    //                 const hasDiscount = oldPriceRaw > currerntPrice;

    //                 let isTimeValid = true;
    //                 if(p.offerExpiresAt){
    //                     isTimeValid = new Date(p.offerExpiresAt) > new Date();
    //                 }
    //                 return hasDiscount && isTimeValid;
    //             });
    //             setOfferCount(activeOffers.length);

    //         } catch (err){
    //             console.error("Failed to fetch offers count",err);
    //         }
    //     };
    //     fetchOffersCount();
    // },[])

    useEffect(() => {
        const offerCount1 = async () => {
            try {
                const response = await axiosInstance.get('/products');
                const allProducts = Array.isArray(response?.data) ? response.data : [];

                const activeOffers = allProducts.filter(p => {
                    const currerntPrice = parseFloat(p.price);
                    const oldPriceRaw = parseFloat(p.oldPrice);
                    if (isNaN(currerntPrice) || isNaN(oldPriceRaw)) return false;

                    const hasDiscount = oldPriceRaw > currerntPrice;

                    let isTimeValid = true;
                    if (p.offerExpiresAt) {
                        isTimeValid = new Date(p.offerExpiresAt) > new Date();
                    }
                    return hasDiscount && isTimeValid;
                });
                setOfferCount(activeOffers.length);
            } catch (err) {
                console.error("Failed to fetch offers count", err);
            }
        }
    }, [])

    return (
        <Drawer
            anchor={drawerAnchor}
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 320,
                    borderTopLeftRadius: isRTL ? 20 : 0,
                    borderBottomLeftRadius: isRTL ? 20 : 0,
                    borderTopRightRadius: !isRTL ? 20 : 0,
                    borderBottomRightRadius: !isRTL ? 20 : 0,
                    // Mobile improvements
                    height: '100vh',
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                    },
                }
            }}
        >
            {/* Header */}
            <Box sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 1,
                background: (theme) => `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`
            }}>
                <Box sx={{ alignSelf: 'flex-end', width: '100%' }}>
                    <IconButton onClick={onClose} color="primary"><Close /></IconButton>
                </Box>

                {loading ? (
                    <>
                        <Skeleton variant="circular" width={90} height={90} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width={140} />
                        <Skeleton variant="text" width={200} />
                    </>
                ) : (
                    <>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={getImageUrl(userData?.image || userData?.profileImage || userData?.avatar)}
                                alt={userData?.fullName}
                                sx={{
                                    width: 90,
                                    height: 90,
                                    mb: 2,
                                    bgcolor: 'primary.main',
                                    fontSize: '2.5rem',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    border: '4px solid #fff'
                                }}
                            >
                                {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: '800' }}>
                            {userData?.fullName || userData?.username || (currentLang === 'ar' ? "زائر كريم" : "Guest")}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8, mb: 3 }}>
                            {userData?.email || ""}
                        </Typography>





                    </>

                )}
            </Box>

            <Divider variant="middle" sx={{ mb: 2 }} />



            {/* List Items */}
            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 300px)', // Account for header and settings
                '&::-webkit-scrollbar': {
                    width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '2px',
                },
            }}>
                <List sx={{ px: 2, py: 1 }}>


                    <ListItemButton onClick={() => { navigate('/profile'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>

                            <PersonOutlined color='primary.main' />

                        </ListItemIcon>
                        <ListItemText primary={isRTL ? "الملف الشخصي" : "Profile"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
                    </ListItemButton>

                    <ListItemButton onClick={() => { navigate('/offers'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>

                            {/* <LocalOfferOutlined color='primary.main'/> */}
                            <Badge
                                badgeContent={offerCount}
                                color="error"
                                fontSize="small"
                                invisible={offerCount === 0}
                            >
                                <LocalOfferOutlined />
                            </Badge>

                        </ListItemIcon>
                        <ListItemText primary={isRTL ? "العروض" : "Offers"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() => { navigate('/add-product'); onClose(); }}
                        sx={fancyItemSx}
                    >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                            <AddCircle fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            primary={isRTL ? "إضافة إعلان جديد" : "Add New Ad"}
                            primaryTypographyProps={{ fontWeight: '' }}
                            sx={{ textAlign: isRTL ? 'right' : 'left' }}
                        />
                    </ListItemButton>


                    <ListItemButton onClick={() => { navigate('/my-products'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}><Campaign /></ListItemIcon>
                        <ListItemText primary={isRTL ? "ترويج إعلاناتي" : "Promote Ads"} sx={{ textAlign: isRTL ? 'right' : 'left' }} />
                    </ListItemButton>


                    <ListItemButton onClick={() => { navigate('/cart'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>
                            <Badge badgeContent={cartCount} color="error" fontSize="small">
                                <CartIcon />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={isRTL ? "عربة التسوق" : "Cart"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: '' }} />
                    </ListItemButton>

                    <ListItemButton onClick={() => { navigate('/favorites'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>
                            <Badge badgeContent={favCount} color="error" max={99}>
                                <FavoriteBorderOutlined />
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={isRTL ? "المفضلة" : "Favorites"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: '' }} />
                    </ListItemButton>

                    <ListItemButton onClick={() => { navigate('/my-products'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>
                            <Store />
                        </ListItemIcon>
                        <ListItemText primary={currentLang === 'ar' ? "إدارة منتجاتي" : "My Products"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
                    </ListItemButton>

                    <ListItemButton onClick={() => { navigate('/chats'); onClose(); }} sx={fancyItemSx}>
                        <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>
                            <MessageIcon />
                        </ListItemIcon>
                        <ListItemText primary={currentLang === 'ar' ? "الرسائل" : "Messages"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
                    </ListItemButton>

                </List>
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <Divider sx={{ my: 1 }} />

            {/* Controls */}
            <Box sx={{ px: 3, py: 2, bgcolor: (theme) => alpha(theme.palette.background.default, 0.5) }}>

                {/* Theme Switch */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkMode color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">
                            {currentLang === 'ar' ? "المظهر" : "Theme"}
                        </Typography>
                    </Box>
                    <MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} />
                </Box>

                {/* Language Switch (IOS Style) 👈 تم التعديل هنا */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Language color="action" fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">
                            {currentLang === 'ar' ? "اللغة" : "Language"}
                        </Typography>
                    </Box>
                    <IOSSwitch
                        checked={currentLang === 'en'}
                        onChange={() => {
                            const newLang = currentLang === 'ar' ? 'en' : 'ar';
                            localStorage.setItem('lang', newLang);
                            window.location.reload();
                        }}
                    />

                </Box>
            </Box>

            {/* Logout */}
            <Box sx={{ p: 2 }}>
                <ListItemButton
                    onClick={() => {
                        // Clear authentication
                        localStorage.removeItem('token');

                        // Clear user-specific data
                        localStorage.removeItem('cart');
                        localStorage.removeItem('favorites');
                        localStorage.removeItem('user');

                        // Clear any additional auth tokens
                        const authKeys = ['access_token', 'jwt', 'authToken'];
                        authKeys.forEach(key => localStorage.removeItem(key));

                        navigate('/login');
                    }}
                    sx={{
                        ...fancyItemSx,
                        mb: 0,
                        border: '1px solid',
                        borderColor: 'error.light',
                        color: 'error.main',
                        '&:hover': {
                            bgcolor: 'error.main',
                            color: '#fff',
                            transform: 'scale(1.02)',
                            borderColor: 'error.main',
                            '& .MuiListItemIcon-root': { color: '#fff', transform: 'rotate(180deg)' }
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'error.main', transition: '0.3s' }}>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText
                        primary={currentLang === 'ar' ? "تسجيل الخروج" : "Logout"}
                        sx={{ textAlign: 'center' }}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                </ListItemButton>
            </Box>

        </Drawer>
    );
}

