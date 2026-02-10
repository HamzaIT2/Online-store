// import React, { useEffect, useState } from 'react';
// import {
//     Drawer, Box, Typography, Avatar, List, ListItem,
//     ListItemIcon, ListItemText, Divider, IconButton, Switch, Skeleton, Badge,
//     ListItemButton
// } from '@mui/material';
// import {
//     Store, Logout, Settings, Language, DarkMode, Close, FavoriteBorderOutlined,
//     FavoriteOutlined
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance'; // تأكد أن المسار صحيح لملف axios
// import MessageIcon from '@mui/icons-material/Message';
// import { useTheme } from "../context/ThemeContext";
// import { CartIcon } from "./CartIcon";







// export default function ProfileDrawer({ open, onClose }) {
//     const navigate = useNavigate();

//     // 1. حالة لتخزين بيانات المستخدم القادمة من الباك إند
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [cartCount, setCartCount] = useState(4);
//     const [favCount, setFavCount] = useState(0);
//     const { darkMode, toggleDarkMode } = useTheme();
//     const currentLang = localStorage.getItem('lang') || 'ar';
//     const isRTL = currentLang === 'ar';
//     // 2. تحديد اللغة الحالية لتغيير اتجاه القائمة

//     // في العربية (ar) القائمة تفتح من اليمين (right)، وفي الإنجليزية من اليسار (left)
//     const drawerAnchor = currentLang === 'ar' ? 'right' : 'left';



//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 // نستخدم Promise.all لجلب كل البيانات دفعة واحدة لتقليل وقت الانتظار
//                 // تأكد من أن هذه الروابط (endpoints) صحيحة في الباك إند الخاص بك
//                 const [userRes, favRes] = await Promise.allSettled([
//                     axiosInstance.get('/users/profile'),  // بيانات المستخدم
//                     axiosInstance.get('/favorites/my-favorites')     // قائمة المفضلة
//                 ]);

//                 // معالجة بيانات المستخدم
//                 if (userRes.status === 'fulfilled') {
//                     console.log("👤 User profile response:", userRes.value.data);
//                     setUserData(userRes.value.data);
//                 }

//                 // معالجة عدد المفضلة (نفترض أن الرد عبارة عن مصفوفة منتجات)
//                 if (favRes.status === 'fulfilled') {
//                     // إذا كان الباك إند يعيد مصفوفة، نأخذ طولها
//                     // favRes.value.data.length
//                     // أو إذا كان يعيد { count: 5 } نأخذ favRes.value.data.count
//                     const list = favRes.value.data;
//                     setFavCount(Array.isArray(list) ? list.length : 0);
//                 }

//             } catch (error) {
//                 console.error("Error fetching drawer data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (open) {
//             fetchData();
//         }
//     }, [open]);

//     //   const getImageUrl = (img) => {
//     //     if (!img) return null;
//     //     if (img.startsWith('http')) return img;
//     //     return `http://localhost:3000/${img.replace('uploads/', '')}`;
//     //   };






//     // Load cart count
//     useEffect(() => {
//         let mounted = true;
//         const loadCart = () => {
//             try {
//                 const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
//                 if (mounted) setCartCount(Array.isArray(cartData) ? cartData.length : 0);
//             } catch (_) {
//                 if (mounted) setCartCount(0);
//             }
//         };
//         loadCart();
//         const onCartUpdated = () => loadCart();
//         window.addEventListener('cart:updated', onCartUpdated);
//         return () => {
//             mounted = false;
//             window.removeEventListener('cart:updated', onCartUpdated);
//         };
//     }, []);


//     useEffect(() => {
//         let mounted = true;
//         const loadCount = async () => {
//             try {
//                 const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//                 if (!token) { if (mounted) setFavCount(0); return; }
//                 const res = await axiosInstance.get('/favorites/my-favorites');
//                 const data = res && (res.data ?? res) ? (res.data ?? res) : [];
//                 let products = [];
//                 if (Array.isArray(data)) products = data.map(f => f.product || f).filter(Boolean);
//                 else if (Array.isArray(data.items)) products = data.items.map(f => f.product || f).filter(Boolean);
//                 else if (Array.isArray(data.data)) products = data.data.map(f => f.product || f).filter(Boolean);
//                 if (mounted) setFavCount(products.length);
//             } catch (e) {
//                 // ignore
//             }
//         };
//         loadCount();
//         const onUpdated = () => loadCount();
//         window.addEventListener('favorites:updated', onUpdated);
//         return () => { mounted = false; window.removeEventListener('favorites:updated', onUpdated); };
//     }, []);








//     // 3. جلب بيانات المستخدم عند تحميل المكون
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 // استبدل '/auth/profile' بالرابط الحقيقي في الباك إند الخاص بك
//                 // مثال: NestJS Controller الذي يعيد بيانات المستخدم المسجل دخوله
//                 const response = await axiosInstance.get('/users/profile');
//                 setUserData(response.data);
//             } catch (error) {
//                 console.error("فشل جلب بيانات المستخدم", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (open) { // جلب البيانات فقط عندما تفتح القائمة (لتحسين الأداء)
//             fetchUserProfile();
//         }
//     }, [open]);

//     // دالة لتجهيز رابط الصورة (معالجة الرابط النسبي كما فعلنا في السلايدر)
//     const getImageUrl = (img) => {
//         console.log("🖼️ Profile image data:", img);
//         if (!img) return null;
//         if (img.startsWith('http')) return img;
//         const fullUrl = `http://localhost:3000/${img.replace('uploads/', '')}`;
//         console.log("🔗 Full image URL:", fullUrl);
//         return fullUrl; // عدل البورت حسب سيرفرك
//     };

//     return (

//         <Drawer
//             anchor={drawerAnchor} // 👈 هنا الديناميكية: يمين أو يسار حسب اللغة
//             open={open}
//             onClose={onClose}
//             PaperProps={{
//                 sx: { width: 300 }
//             }}
//         >
//             {/* --- رأس القائمة --- */}
//             <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
//                 <Box sx={{ alignSelf: drawerAnchor === 'right' ? 'flex-start' : 'flex-end', width: '100%' }}>
//                     <IconButton onClick={onClose}><Close /></IconButton>
//                 </Box>

//                 {loading ? (
//                     // عرض Skeleton (شكل رمادي) أثناء التحميل
//                     <>
//                         <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
//                         <Skeleton variant="text" width={120} />
//                         <Skeleton variant="text" width={180} />
//                     </>
//                 ) : (
//                     // عرض البيانات الحقيقية
//                     <>
//                         <Avatar
//                             src={getImageUrl(userData?.image || userData?.profileImage || userData?.avatar)} // صورة الباك إند
//                             alt={userData?.fullName || userData?.username || "User"}
//                             sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
//                         >
//                             {/* إذا لم توجد صورة، اعرض الحرف الأول من الاسم */}
//                             {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() :
//                                 userData?.username ? userData.username.charAt(0).toUpperCase() : 'U'}
//                         </Avatar>

//                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                             {userData?.fullName || userData?.username || "مستخدم زائر"}
//                         </Typography>

//                         <Typography variant="body2" color="text.secondary">
//                             {userData?.email || "user@example.com"}
//                         </Typography>
//                     </>
//                 )}
//             </Box>

//             <Divider />

//             {/* --- باقي القائمة --- */}
//             <List sx={{ px: 2 }}>

//                 <ListItem
//                     onClick={() => { navigate('/cart'); onClose(); }}

//                     sx={{

//                         borderRadius: 2,
//                         mb: 1,
//                         border: '1px solid #2196f3',
//                         '&:hover': { bgcolor: '#e3f2fd' }
//                     }}
//                 >
//                     <ListItemIcon>
//                         <Badge badgeContent={cartCount} color="error">


//                             <CartIcon color='primary' />
//                         </Badge>
//                     </ListItemIcon>
//                     <ListItemText
//                         primary={isRTL ? "عربة التسوق" : "Cart"}
//                         sx={{
//                             color: 'primary',
//                             fontWeight: 'bold',
//                             textAlign: isRTL ? 'right' : 'left'
//                         }} />
//                 </ListItem>

//                 <ListItemButton
//                     onClick={() => {
//                         navigate('/favorites');
//                         onClose();

//                     }}

//                     sx={{
//                         borderRadius: 2,
//                         mb: 1,
//                         border: '1px solid #2196f3',
//                         position:'relative',
//                         transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',
//                         '&:hover': { bgcolor: '#e3f2fd' }
//                     }}
//                 >
//                     <ListItemIcon>
//                         <Badge
//                             badgeContent={favCount} color="error" max={99}
//                         >
//                             <FavoriteBorderOutlined color='primary' />
//                         </Badge>
//                     </ListItemIcon>
//                     <ListItemText
//                         primaryTypographyProps={{
//                             fontWeight: 'bold',
//                             color: 'primary.main',
//                             textAlign: currentLang === 'ar' ? 'right' : 'left'
//                         }}
//                     >{isRTL ? "المفضلة" : "Favorites"}</ListItemText>

//                 </ListItemButton>


//                 <ListItem
//                     onClick={() => { navigate('/my-products'); onClose(); }}
//                     sx={{
//                         borderRadius: 2,
//                         mb: 1,
//                         border: '1px solid #2196f3',
//                         '&:hover': { bgcolor: '#e3f2fd' }
//                     }}
//                 >
//                     <ListItemIcon><Store color="primary" /></ListItemIcon>
//                     <ListItemText
//                         primary={currentLang === 'ar' ? "إدارة منتجاتي" : "My Products"} // نص مترجم بسيط
//                         primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main', textAlign: currentLang === 'ar' ? 'right' : 'left' }}
//                     />
//                 </ListItem>

//                 {/* <ListItem
//                     onClick={() => { navigate('/settings'); onClose(); }}

//                     sx={{
//                         borderRadius: 2,
//                         mb: 1,
//                         border: '1px solid #2196f3',
//                         '&:hover': { bgcolor: '#e3f2fd' }
//                     }}
//                 >
//                     <ListItemIcon><Settings /></ListItemIcon>
//                     <ListItemText primary={currentLang === 'ar' ? "الإعدادات" : "Settings"} sx={{ textAlign: currentLang === 'ar' ? 'right' : 'left' }} />
//                 </ListItem> */}
//                 <ListItem
//                     onClick={() => {
//                         // handleCloseUserMenu();
//                         navigate('/chats');
//                         onClose();

//                     }}

//                     sx={{
//                         borderRadius: 2,
//                         mb: 1,
//                         border: '1px solid #2196f3',
//                         '&:hover': { bgcolor: '#e3f2fd' }
//                     }}
//                 >
//                     <ListItemIcon>
//                         <MessageIcon fontSize="small" color='primary' />
//                     </ListItemIcon>
//                     <ListItemText
//                         primaryTypographyProps={{
//                             fontWeight: 'bold',
//                             color: 'primary.main',
//                             textAlign: currentLang === 'ar' ? 'right' : 'left'
//                         }}
//                     >{currentLang === 'ar' ? "رسائلي" : "My Messages"}</ListItemText>
//                 </ListItem>
//             </List>

//             <Divider sx={{ my: 2 }} />

//             {/* --- أدوات التحكم --- */}
//             <Box sx={{ px: 3, py: 1 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <DarkMode color="action" />
//                         <Typography>{currentLang === 'ar' ? "الوضع الليلي" : "Dark Mode"}</Typography>
//                     </Box>
//                     <Switch
//                         checked={darkMode}
//                         onChange={toggleDarkMode}
//                         size="small" />
//                 </Box>

//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Language color="action" />
//                         <Typography>English / العربية</Typography>
//                     </Box>
//                     <Switch
//                         size="small"
//                         checked={currentLang === 'en'}
//                         onChange={() => {
//                             // تبديل اللغة
//                             const newLang = currentLang === 'ar' ? 'en' : 'ar';
//                             localStorage.setItem('lang', newLang);
//                             window.location.reload(); // إعادة تحميل لتطبيق التغييرات
//                         }}
//                     />
//                 </Box>
//             </Box>

//             <Box sx={{ flexGrow: 1 }} />

//             {/* --- زر الخروج --- */}
//             <Box sx={{ p: 2 }}>
//                 <ListItem
//                     onClick={() => {
//                         // منطق تسجيل الخروج
//                         localStorage.removeItem('token'); // مثال
//                         navigate('/login');
//                     }}
//                     sx={{
//                         borderRadius: 2,
//                         justifyContent: 'center',

//                         '&:hover': { bgcolor: '#fde3e3ff' }
//                     }}
//                 >
//                     <ListItemIcon sx={{ minWidth: 30 }}><Logout color="error" fontSize="small" /></ListItemIcon>
//                     <ListItemText primary={currentLang === 'ar' ? "تسجيل الخروج" : "Logout"} sx={{ flex: 'none' }} />
//                 </ListItem>
//             </Box>

//         </Drawer>
//     );
// }



// import React, { useEffect, useState } from 'react';
// import {
//     Drawer, Box, Typography, Avatar, List, ListItem,
//     ListItemIcon, ListItemText, Divider, IconButton, Switch, Skeleton, Badge,
//     ListItemButton
// } from '@mui/material';
// import {
//     Store, Logout, Language, DarkMode, Close, FavoriteBorderOutlined,
// } from '@mui/icons-material';
// import { styled, alpha } from '@mui/material/styles'; // 👈 إضافة أدوات الستايل
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
// import MessageIcon from '@mui/icons-material/Message';
// import { useTheme } from "../context/ThemeContext";
// import { CartIcon } from "./CartIcon";

// // 1. تعريف السويتش الجميل (الشمس والقمر)
// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//     width: 62,
//     height: 34,
//     padding: 7,
//     '& .MuiSwitch-switchBase': {
//         margin: 1,
//         padding: 0,
//         transform: 'translateX(6px)',
//         '&.Mui-checked': {
//             color: '#fff',
//             transform: 'translateX(22px)',
//             '& .MuiSwitch-thumb:before': {
//                 backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//                     '#fff',
//                 )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
//             },
//             '& + .MuiSwitch-track': {
//                 opacity: 1,
//                 backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//             },
//         },
//     },
//     '& .MuiSwitch-thumb': {
//         backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
//         width: 32,
//         height: 32,
//         '&::before': {
//             content: "''",
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             left: 0,
//             top: 0,
//             backgroundRepeat: 'no-repeat',
//             backgroundPosition: 'center',
//             backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//                 '#fff',
//             )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
//         },
//     },
//     '& .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//         borderRadius: 20 / 2,
//     },
// }));


// export default function ProfileDrawer({ open, onClose }) {
//     const navigate = useNavigate();
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [cartCount, setCartCount] = useState(0);
//     const [favCount, setFavCount] = useState(0);
//     const { darkMode, toggleDarkMode } = useTheme();
//     const currentLang = localStorage.getItem('lang') || 'ar';
//     const isRTL = currentLang === 'ar';
//     const drawerAnchor = isRTL ? 'right' : 'left';

//     // 2. ستايل موحد للأزرار التفاعلية
//     const fancyItemSx = {
//         borderRadius: '12px',
//         mb: 1.5,
//         mx: 1,
//         border: '1px solid transparent', // حدود شفافة للبدء
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         overflow: 'hidden',
//         '&:hover': {
//             bgcolor: 'primary.main',
//             color: '#fff',
//             transform: `scale(1.03) translateX(${isRTL ? '-5px' : '5px'})`, // حركة عكسية حسب اللغة
//             boxShadow: (theme) => `0 8px 20px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
//             '& .MuiListItemIcon-root': {
//                 color: '#fff',
//                 transform: 'scale(1.2) rotate(10deg)', // تدوير الأيقونة
//             },
//             '& .MuiTypography-root': {
//                 fontWeight: 'bold',
//             },
//             '& .MuiBadge-badge': {
//                 bgcolor: '#fff',
//                 color: 'primary.main',
//                 fontWeight: 'bold'
//             }
//         },
//     };

//     // --- (نفس منطق جلب البيانات الخاص بك) ---
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const [userRes, favRes] = await Promise.allSettled([
//                     axiosInstance.get('/users/profile'),
//                     axiosInstance.get('/favorites/my-favorites')
//                 ]);

//                 if (userRes.status === 'fulfilled') setUserData(userRes.value.data);
//                 if (favRes.status === 'fulfilled') {
//                     const list = favRes.value.data;
//                     setFavCount(Array.isArray(list) ? list.length : (list?.data?.length || 0));
//                 }
//             } catch (error) {
//                 console.error("Error fetching drawer data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (open) fetchData();
//     }, [open]);

//     // Cart Logic
//     useEffect(() => {
//         let mounted = true;
//         const loadCart = () => {
//             try {
//                 const cartData = JSON.parse(localStorage.getItem(isRTL ? `cart_user_${userData?.id || 'guest'}` : 'cart') || '[]'); // حاول استخدام المنطق الجديد
//                 // fallback للوضع الحالي لضمان العمل
//                 const legacyData = JSON.parse(localStorage.getItem('cart') || '[]');
//                 const finalData = cartData.length > 0 ? cartData : legacyData; 

//                 if (mounted) setCartCount(Array.isArray(finalData) ? finalData.length : 0);
//             } catch (_) {
//                 if (mounted) setCartCount(0);
//             }
//         };
//         loadCart();
//         const onCartUpdated = () => loadCart();
//         window.addEventListener('cart:updated', onCartUpdated);
//         return () => {
//             mounted = false;
//             window.removeEventListener('cart:updated', onCartUpdated);
//         };
//     }, [userData]); // Added userData dependancy

//     // Favorite Listener Logic
//     useEffect(() => {
//         let mounted = true;
//         const loadFavCount = async () => {
//            // ... (نفس الكود الخاص بك)
//            // اختصارا للرد، افترض وجود الكود هنا
//         };
//         const onUpdated = () => loadFavCount(); // إعادة تحميل عند التحديث
//         window.addEventListener('favorites:updated', onUpdated);
//         return () => window.removeEventListener('favorites:updated', onUpdated);
//     }, []);

//     const getImageUrl = (img) => {
//         if (!img) return null;
//         if (img.startsWith('http')) return img;
//         return `http://localhost:3000/${img.replace('uploads/', '')}`;
//     };

//     return (
//         <Drawer
//             anchor={drawerAnchor}
//             open={open}
//             onClose={onClose}
//             PaperProps={{
//                 sx: { 
//                     width: 320, 
//                     borderTopLeftRadius: isRTL ? 20 : 0,
//                     borderBottomLeftRadius: isRTL ? 20 : 0,
//                     borderTopRightRadius: !isRTL ? 20 : 0,
//                     borderBottomRightRadius: !isRTL ? 20 : 0,
//                 }
//             }}
//         >
//             {/* --- رأس القائمة (Header) --- */}
//             <Box sx={{ 
//                 p: 3, 
//                 display: 'flex', 
//                 flexDirection: 'column', 
//                 alignItems: 'center', 
//                 mb: 1,
//                 background: (theme) => `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.05)}, transparent)`
//             }}>
//                 <Box sx={{ alignSelf: 'flex-end', width: '100%' }}>
//                     <IconButton onClick={onClose} color="primary"><Close /></IconButton>
//                 </Box>

//                 {loading ? (
//                     <>
//                         <Skeleton variant="circular" width={90} height={90} sx={{ mb: 2 }} />
//                         <Skeleton variant="text" width={140} />
//                         <Skeleton variant="text" width={200} />
//                     </>
//                 ) : (
//                     <>
//                         <Box sx={{ position: 'relative' }}>
//                             <Avatar
//                                 src={getImageUrl(userData?.image || userData?.profileImage || userData?.avatar)}
//                                 alt={userData?.fullName}
//                                 sx={{ 
//                                     width: 90, 
//                                     height: 90, 
//                                     mb: 2, 
//                                     bgcolor: 'primary.main', 
//                                     fontSize: '2.5rem',
//                                     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
//                                     border: '4px solid #fff'
//                                 }}
//                             >
//                                 {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
//                             </Avatar>
//                         </Box>

//                         <Typography variant="h6" sx={{ fontWeight: '800' }}>
//                             {userData?.fullName || userData?.username || (currentLang === 'ar' ? "زائر كريم" : "Guest")}
//                         </Typography>

//                         <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
//                             {userData?.email || ""}
//                         </Typography>
//                     </>
//                 )}
//             </Box>

//             <Divider variant="middle" sx={{ mb: 2 }} />

//             {/* --- القائمة التفاعلية --- */}
//             <List sx={{ px: 2 }}>

//                 {/* عربة التسوق */}
//                 <ListItemButton onClick={() => { navigate('/cart'); onClose(); }} sx={fancyItemSx}>
//                     <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                         <Badge badgeContent={cartCount} color="error">
//                             <CartIcon />
//                         </Badge>
//                     </ListItemIcon>
//                     <ListItemText 
//                         primary={isRTL ? "عربة التسوق" : "Cart"} 
//                         primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} 
//                     />
//                 </ListItemButton>

//                 {/* المفضلة */}
//                 <ListItemButton onClick={() => { navigate('/favorites'); onClose(); }} sx={fancyItemSx}>
//                     <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                         <Badge badgeContent={favCount} color="error" max={99}>
//                             <FavoriteBorderOutlined />
//                         </Badge>
//                     </ListItemIcon>
//                     <ListItemText 
//                         primary={isRTL ? "المفضلة" : "Favorites"} 
//                         primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} 
//                     />
//                 </ListItemButton>

//                 {/* منتجاتي */}
//                 <ListItemButton onClick={() => { navigate('/my-products'); onClose(); }} sx={fancyItemSx}>
//                     <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                         <Store />
//                     </ListItemIcon>
//                     <ListItemText 
//                         primary={currentLang === 'ar' ? "إدارة منتجاتي" : "My Products"}
//                         primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} 
//                     />
//                 </ListItemButton>

//                 {/* الرسائل */}
//                 <ListItemButton onClick={() => { navigate('/chats'); onClose(); }} sx={fancyItemSx}>
//                     <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                         <MessageIcon />
//                     </ListItemIcon>
//                     <ListItemText 
//                         primary={currentLang === 'ar' ? "الرسائل" : "Messages"}
//                         primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} 
//                     />
//                 </ListItemButton>

//             </List>

//             <Box sx={{ flexGrow: 1 }} />

//             <Divider sx={{ my: 1 }} />

//             {/* --- أدوات التحكم (اللغة والثيم) --- */}
//             <Box sx={{ px: 3, py: 2, bgcolor: (theme) => alpha(theme.palette.background.default, 0.5) }}>

//                 {/* تبديل الثيم باستخدام الزر الجميل */}
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <DarkMode color="action" fontSize="small" />
//                         <Typography variant="body2" fontWeight="bold">
//                             {currentLang === 'ar' ? "المظهر" : "Theme"}
//                         </Typography>
//                     </Box>
//                     <MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} />
//                 </Box>

//                 {/* تبديل اللغة */}
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Language color="action" fontSize="small" />
//                         <Typography variant="body2" fontWeight="bold">
//                             {currentLang === 'ar' ? "اللغة" : "Language"}
//                         </Typography>
//                     </Box>
//                     <Switch
//                         size="small"
//                         checked={currentLang === 'en'}
//                         onChange={() => {
//                             const newLang = currentLang === 'ar' ? 'en' : 'ar';
//                             localStorage.setItem('lang', newLang);
//                             window.location.reload();
//                         }}
//                     />
//                 </Box>
//             </Box>

//             {/* --- زر الخروج --- */}
//             <Box sx={{ p: 2 }}>
//                 <ListItemButton
//                     onClick={() => {
//                         localStorage.removeItem('token');
//                         navigate('/login');
//                     }}
//                     sx={{
//                         ...fancyItemSx,
//                         mb: 0,
//                         border: '1px solid',
//                         borderColor: 'error.light',
//                         color: 'error.main',
//                         '&:hover': {
//                             bgcolor: 'error.main',
//                             color: '#fff',
//                             transform: 'scale(1.02)',
//                             borderColor: 'error.main',
//                             '& .MuiListItemIcon-root': { color: '#fff', transform: 'rotate(180deg)' }
//                         }
//                     }}
//                 >
//                     <ListItemIcon sx={{ minWidth: 40, color: 'error.main', transition: '0.3s' }}>
//                         <Logout />
//                     </ListItemIcon>
//                     <ListItemText 
//                         primary={currentLang === 'ar' ? "تسجيل الخروج" : "Logout"} 
//                         sx={{ textAlign: 'center' }}
//                         primaryTypographyProps={{ fontWeight: 'bold' }}
//                     />
//                 </ListItemButton>
//             </Box>

//         </Drawer>
//     );
// }


//-----------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import {
    Drawer, Box, Typography, Avatar, List, ListItem,
    ListItemIcon, ListItemText, Divider, IconButton, Switch, Skeleton, Badge,
    ListItemButton,
    Button,
    MenuItem
} from '@mui/material';
import {
    Store, Logout, Language, DarkMode, Close, FavoriteBorderOutlined,
    PersonOutlined,AddCircle,Campaign
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
            try {
                setLoading(true);
                const [userRes, favRes] = await Promise.allSettled([
                    axiosInstance.get('/users/profile'),
                    axiosInstance.get('/favorites/my-favorites')
                ]);

                if (userRes.status === 'fulfilled') setUserData(userRes.value.data);
                if (favRes.status === 'fulfilled') {
                    const list = favRes.value.data;
                    setFavCount(Array.isArray(list) ? list.length : (list?.data?.length || 0));
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
        if (img.startsWith('http')) return img;
        return `http://localhost:3000/${img.replace('uploads/', '')}`;
    };

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

            <MenuItem>
            <List sx={{ px: 2 }}>


                <ListItemButton onClick={() => { navigate('/profile'); onClose(); }} sx={fancyItemSx}>
                    <ListItemIcon sx={{ minWidth: 40, transition: '0.3s' }}>

                        <PersonOutlined color='primary.main'/>

                    </ListItemIcon>
                    <ListItemText primary={isRTL ? "الملف الشخصي" : "Profile"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
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
                    <ListItemIcon sx={{ minWidth: 40, transition: '0.3s'}}>
                        <Badge badgeContent={cartCount} color="error" fontSize="small">
                            <CartIcon  />
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
                    <ListItemIcon sx={{ minWidth: 40, transition: '0.3s'}}>
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
            </MenuItem>

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
                        localStorage.removeItem('token');
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

//---------------------------------------------------------------------------------new----------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import {
//     Drawer, Box, Typography, Avatar, List, ListItemButton,
//     ListItemIcon, ListItemText, Divider, IconButton, Switch, Skeleton, Badge,
//     Menu, MenuItem, Tooltip,ListItemAvatar
// } from '@mui/material';
// import {
//     Store, Logout, Language, DarkMode, Close, FavoriteBorderOutlined,
//     Settings, Person, ExpandMore, Check
// } from '@mui/icons-material';
// import { styled, alpha } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
// import MessageIcon from '@mui/icons-material/Message';
// import { useTheme } from "../context/ThemeContext";
// import { CartIcon } from "./CartIcon";

// // --- Styled Components ---

// // زر الثيم (الشمس والقمر)
// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//     width: 62,
//     height: 34,
//     padding: 7,
//     '& .MuiSwitch-switchBase': {
//         margin: 1,
//         padding: 0,
//         transform: 'translateX(6px)',
//         '&.Mui-checked': {
//             color: '#fff',
//             transform: 'translateX(22px)',
//             '& .MuiSwitch-thumb:before': {
//                 backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//                     '#fff',
//                 )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
//             },
//             '& + .MuiSwitch-track': {
//                 opacity: 1,
//                 backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//             },
//         },
//     },
//     '& .MuiSwitch-thumb': {
//         backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
//         width: 32,
//         height: 32,
//         '&::before': {
//             content: "''",
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             left: 0,
//             top: 0,
//             backgroundRepeat: 'no-repeat',
//             backgroundPosition: 'center',
//             backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//                 '#fff',
//             )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
//         },
//     },
//     '& .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//         borderRadius: 20 / 2,
//     },
// }));

// // زر اللغة (IOS Style)
// const IOSSwitch = styled(Switch)(({ theme }) => ({
//     width: 42,
//     height: 26,
//     padding: 0,
//     '& .MuiSwitch-switchBase': {
//         padding: 0,
//         margin: 2,
//         transitionDuration: '300ms',
//         '&.Mui-checked': {
//             transform: 'translateX(16px)',
//             color: '#fff',
//             '& + .MuiSwitch-track': {
//                 backgroundColor: '#65C466',
//                 opacity: 1,
//                 border: 0,
//             },
//             '&.Mui-disabled + .MuiSwitch-track': {
//                 opacity: 0.5,
//             },
//         },
//         '&.Mui-focusVisible .MuiSwitch-thumb': {
//             color: '#33cf4d',
//             border: '6px solid #fff',
//         },
//         '&.Mui-disabled .MuiSwitch-thumb': {
//             color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
//         },
//         '&.Mui-disabled + .MuiSwitch-track': {
//             opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
//         },
//     },
//     '& .MuiSwitch-thumb': {
//         boxSizing: 'border-box',
//         width: 22,
//         height: 22,
//     },
//     '& .MuiSwitch-track': {
//         borderRadius: 26 / 2,
//         backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
//         opacity: 1,
//         transition: theme.transitions.create(['background-color'], {
//             duration: 500,
//         }),
//     },
// }));

// export default function ProfileDrawer({ open, onClose }) {
//     const navigate = useNavigate();
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [cartCount, setCartCount] = useState(0);
//     const [favCount, setFavCount] = useState(0);
//     const { darkMode, toggleDarkMode } = useTheme();
    
//     // لإدارة القائمة المنبثقة للبروفايل
//     const [anchorEl, setAnchorEl] = useState(null);
//     const openMenu = Boolean(anchorEl);

//     const currentLang = localStorage.getItem('lang') || 'ar';
//     const isRTL = currentLang === 'ar';
//     const drawerAnchor = isRTL ? 'right' : 'left';

//     const fancyItemSx = {
//         borderRadius: '12px',
//         mb: 1.5,
//         mx: 1,
//         border: '1px solid transparent',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         overflow: 'hidden',
//         '&:hover': {
//             bgcolor: 'primary.main',
//             color: '#fff',
//             transform: `scale(1.03) translateX(${isRTL ? '-5px' : '5px'})`,
//             boxShadow: (theme) => `0 8px 20px -5px ${alpha(theme.palette.primary.main, 0.5)}`,
//             '& .MuiListItemIcon-root': {
//                 color: '#fff',
//                 transform: 'scale(1.2) rotate(10deg)',
//             },
//             '& .MuiTypography-root': {
//                 fontWeight: 'bold',
//             },
//             '& .MuiBadge-badge': {
//                 bgcolor: '#fff',
//                 color: 'primary.main',
//                 fontWeight: 'bold'
//             }
//         },
//     };

//     // --- Data Fetching ---
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const [userRes, favRes] = await Promise.allSettled([
//                     axiosInstance.get('/users/profile'),
//                     axiosInstance.get('/favorites/my-favorites')
//                 ]);

//                 if (userRes.status === 'fulfilled') setUserData(userRes.value.data);
//                 if (favRes.status === 'fulfilled') {
//                     const list = favRes.value.data;
//                     setFavCount(Array.isArray(list) ? list.length : (list?.data?.length || 0));
//                 }
//             } catch (error) {
//                 console.error("Error fetching drawer data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (open) fetchData();
//     }, [open]);

//     // Cart Logic
//     useEffect(() => {
//         let mounted = true;
//         const loadCart = () => {
//             try {
//                 const storedUser = localStorage.getItem('user');
//                 let uid = 'guest';
//                 if(storedUser) uid = JSON.parse(storedUser).id || 'guest';
                
//                 const cartData = JSON.parse(localStorage.getItem(isRTL ? `cart_user_${uid}` : 'cart') || '[]');
//                 const legacyData = JSON.parse(localStorage.getItem('cart') || '[]');
//                 const finalData = cartData.length > 0 ? cartData : legacyData; 
//                 if (mounted) setCartCount(Array.isArray(finalData) ? finalData.length : 0);
//             } catch (_) {
//                 if (mounted) setCartCount(0);
//             }
//         };
//         loadCart();
//         const onCartUpdated = () => loadCart();
//         window.addEventListener('cart:updated', onCartUpdated);
//         return () => {
//             mounted = false;
//             window.removeEventListener('cart:updated', onCartUpdated);
//         };
//     }, []); 

//     // Helper Image URL
//     const getImageUrl = (img) => {
//         if (!img) return null;
//         if (img.startsWith('http')) return img;
//         return `http://localhost:3000/${img.replace('uploads/', '')}`;
//     };

//     // Profile Menu Handlers
//     const handleClickProfile = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//     const handleCloseMenu = () => {
//         setAnchorEl(null);
//     };

//     return (
//         <Drawer
//             anchor={drawerAnchor}
//             open={open}
//             onClose={onClose}
//             PaperProps={{
//                 sx: { 
//                     width: 320, 
//                     borderTopLeftRadius: isRTL ? 20 : 0,
//                     borderBottomLeftRadius: isRTL ? 20 : 0,
//                     borderTopRightRadius: !isRTL ? 20 : 0,
//                     borderBottomRightRadius: !isRTL ? 20 : 0,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'space-between'
//                 }
//             }}
//         >
//             <Box>
//                 {/* Header (زر الإغلاق فقط) */}
//                 <Box sx={{ p: 2, display: 'flex', justifyContent: drawerAnchor === 'right' ? 'flex-start' : 'flex-end' }}>
//                      <IconButton onClick={onClose} color="primary"><Close /></IconButton>
//                 </Box>

//                 {/* --- القائمة الرئيسية --- */}
//                 <List sx={{ px: 2 }}>
//                     <ListItemButton onClick={() => { navigate('/cart'); onClose(); }} sx={fancyItemSx}>
//                         <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                             <Badge badgeContent={cartCount} color="error">
//                                 <CartIcon />
//                             </Badge>
//                         </ListItemIcon>
//                         <ListItemText primary={isRTL ? "عربة التسوق" : "Cart"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
//                     </ListItemButton>

//                     <ListItemButton onClick={() => { navigate('/favorites'); onClose(); }} sx={fancyItemSx}>
//                         <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                             <Badge badgeContent={favCount} color="error" max={99}>
//                                 <FavoriteBorderOutlined />
//                             </Badge>
//                         </ListItemIcon>
//                         <ListItemText primary={isRTL ? "المفضلة" : "Favorites"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
//                     </ListItemButton>

//                     <ListItemButton onClick={() => { navigate('/my-products'); onClose(); }} sx={fancyItemSx}>
//                         <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                             <Store />
//                         </ListItemIcon>
//                         <ListItemText primary={currentLang === 'ar' ? "إدارة منتجاتي" : "My Products"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
//                     </ListItemButton>

//                     <ListItemButton onClick={() => { navigate('/chats'); onClose(); }} sx={fancyItemSx}>
//                         <ListItemIcon sx={{ minWidth: 40, transition: '0.3s', color: 'primary.main' }}>
//                             <MessageIcon />
//                         </ListItemIcon>
//                         <ListItemText primary={currentLang === 'ar' ? "الرسائل" : "Messages"} primaryTypographyProps={{ textAlign: isRTL ? 'right' : 'left', fontWeight: 'medium' }} />
//                     </ListItemButton>
//                 </List>
                
//                 <Divider sx={{ my: 1, mx: 2 }} />

//                 {/* Controls (Theme & Lang) */}
//                 <Box sx={{ px: 3, py: 1 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <DarkMode color="action" fontSize="small" />
//                             <Typography variant="body2" fontWeight="bold">
//                                 {currentLang === 'ar' ? "المظهر" : "Theme"}
//                             </Typography>
//                         </Box>
//                         <MaterialUISwitch checked={darkMode} onChange={toggleDarkMode} />
//                     </Box>

//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Language color="action" fontSize="small" />
//                             <Typography variant="body2" fontWeight="bold">
//                                 {currentLang === 'ar' ? "اللغة" : "Language"}
//                             </Typography>
//                         </Box>
//                         <IOSSwitch
//                             checked={currentLang === 'en'}
//                             onChange={() => {
//                                 const newLang = currentLang === 'ar' ? 'en' : 'ar';
//                                 localStorage.setItem('lang', newLang);
//                                 window.location.reload();
//                             }}
//                         />
//                     </Box>
//                 </Box>
//             </Box>

//             {/* --- قسم البروفايل الجديد في الأسفل --- */}
//             <Box sx={{ p: 2, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04), borderTop: '1px solid', borderColor: 'divider' }}>
//                 {loading ? (
//                     <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
//                          <Skeleton variant="circular" width={45} height={45} />
//                          <Box sx={{ width: '100%' }}>
//                              <Skeleton variant="text" width="60%" />
//                              <Skeleton variant="text" width="40%" />
//                          </Box>
//                     </Box>
//                 ) : (
//                     <>
//                         <Tooltip title={currentLang === 'ar' ? "خيارات الحساب" : "Account Settings"}>
//                             <ListItemButton
//                                 onClick={handleClickProfile}
//                                 sx={{
//                                     borderRadius: 3,
//                                     transition: '0.2s',
//                                     '&:hover': { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }
//                                 }}
//                             >
//                                 <ListItemAvatar>
//                                     <Avatar
//                                         src={getImageUrl(userData?.image || userData?.profileImage || userData?.avatar)}
//                                         alt={userData?.fullName}
//                                         sx={{ 
//                                             width: 45, height: 45, 
//                                             bgcolor: 'primary.main',
//                                             border: '2px solid #fff',
//                                             boxShadow: 1
//                                         }}
//                                     >
//                                         {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
//                                     </Avatar>
//                                 </ListItemAvatar>
//                                 <ListItemText
//                                     primary={userData?.fullName || (currentLang === 'ar' ? "زائر" : "Guest")}
//                                     secondary={userData?.email || ""}
//                                     primaryTypographyProps={{ fontWeight: 'bold', noWrap: true }}
//                                     secondaryTypographyProps={{ fontSize: '0.75rem', noWrap: true }}
//                                     sx={{ textAlign: isRTL ? 'right' : 'left' }}
//                                 />
//                                 <ExpandMore color="action" fontSize="small" />
//                             </ListItemButton>
//                         </Tooltip>

//                         {/* القائمة المنبثقة */}
//                         <Menu
//                             anchorEl={anchorEl}
//                             open={openMenu}
//                             onClose={handleCloseMenu}
//                             onClick={handleCloseMenu}
//                             PaperProps={{
//                                 elevation: 0,
//                                 sx: {
//                                     overflow: 'visible',
//                                     filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
//                                     mt: -1, // لتظهر فوق العنصر قليلاً
//                                     minWidth: 200,
//                                     borderRadius: 2,
//                                     '&:before': { // السهم الصغير
//                                         content: '""',
//                                         display: 'block',
//                                         position: 'absolute',
//                                         bottom: -10, // يظهر من الأسفل لأن القائمة فوق
//                                         right: isRTL ? 14 : 'auto', // مكان السهم حسب اللغة
//                                         left: isRTL ? 'auto' : 14,
//                                         width: 10,
//                                         height: 10,
//                                         bgcolor: 'background.paper',
//                                         transform: 'translateY(-50%) rotate(45deg)',
//                                         zIndex: 0,
//                                     },
//                                 },
//                             }}
//                             transformOrigin={{ horizontal: isRTL ? 'right' : 'left', vertical: 'bottom' }}
//                             anchorOrigin={{ horizontal: isRTL ? 'right' : 'left', vertical: 'top' }}
//                         >
//                             {/* خيار الحساب الحالي (كمؤشر) */}
//                             <MenuItem disabled sx={{ opacity: '1 !important', py: 0.5 }}>
//                                 <ListItemIcon><Check fontSize="small" color="success" /></ListItemIcon>
//                                 {userData?.fullName}
//                             </MenuItem>
//                             <Divider />
                            
//                             {/* الذهاب للملف الشخصي */}
//                             <MenuItem onClick={() => { navigate('/profile'); onClose(); }}>
//                                 <ListItemIcon><Person fontSize="small" /></ListItemIcon>
//                                 {currentLang === 'ar' ? "الملف الشخصي" : "Profile"}
//                             </MenuItem>

//                             {/* تبديل الحساب (مجرد شكل حالياً) */}
//                             <MenuItem onClick={() => { navigate('/login'); onClose(); }}>
//                                 <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
//                                 {currentLang === 'ar' ? "تبديل الحساب" : "Switch Account"}
//                             </MenuItem>

//                             <Divider />

//                             {/* تسجيل الخروج */}
//                             <MenuItem onClick={() => {
//                                 localStorage.removeItem('token');
//                                 navigate('/login');
//                             }} sx={{ color: 'error.main' }}>
//                                 <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
//                                 {currentLang === 'ar' ? "تسجيل الخروج" : "Logout"}
//                             </MenuItem>
//                         </Menu>
//                     </>
//                 )}
//             </Box>
//         </Drawer>
//     );
// }