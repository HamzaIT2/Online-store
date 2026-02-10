// import { AppBar, Toolbar, Typography, IconButton, Box, Button, Divider, Menu, MenuItem, Avatar, Badge, Container, Tooltip, ListItemIcon, ListItemText, Switch } from "@mui/material";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import TranslateIcon from "@mui/icons-material/Translate";
// import AccountCircle from "@mui/icons-material/AccountCircle";
// import MenuIcon from '@mui/icons-material/Menu';
// import MessageIcon from '@mui/icons-material/Message';
// import ViewListIcon from '@mui/icons-material/ViewList';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import HomeIcon from '@mui/icons-material/Home';
// import CategoryIcon from '@mui/icons-material/Category';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AddBoxIcon from '@mui/icons-material/AddBox';
// import LoginIcon from '@mui/icons-material/Login';
// import HowToRegIcon from '@mui/icons-material/HowToReg';
// import LogoutIcon from '@mui/icons-material/Logout';
// import { useEffect, useState } from "react";
// import { getMyFavorites } from "../api/favoritesAPI";
// import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
// import { useTheme } from "../context/ThemeContext";
// import { t, toggleLang } from "../i18n";
// import { listChats } from "../api/messagesAPI";
// import axiosInstance from "../api/axiosInstance";
// import ContrastIcon from '@mui/icons-material/Contrast';
// import { styled } from '@mui/material/styles';
// import { CartIcon } from "./CartIcon";

// export default function Navbar() {
//   const { darkMode, toggleDarkMode } = useTheme();
//   const navigate = useNavigate();
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
//   const canSell = !!token && (userType === 'seller' || userType === 'both');
//   const location = useLocation();
//   const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

//   const [anchorProfile, setAnchorProfile] = useState(null);
//   const [anchorElNav, setAnchorElNav] = useState(null);
//   const [anchorElUser, setAnchorElUser] = useState(null);
//   const [favCount, setFavCount] = useState(0);
//   const [chatCount, setChatCount] = useState(0);
//   const [cartCount, setCartCount] = useState(4);
//   const [profile, setProfile] = useState(null);
//   const openProfile = Boolean(anchorProfile);

//   const leftLinks = [
//     { label: t('home'), path: '/', icon: <HomeIcon /> },
//     { label: t('categories'), path: '/categories', icon: <CategoryIcon /> },
//     { label: t('cart'), path: '/cart', icon: <ShoppingCartIcon /> },
//     { label: t('my_products') || 'إعلاناتي', path: '/my-products', icon: <ViewListIcon /> },
//     { label: t('favorites'), path: '/favorites', icon: <FavoriteIcon /> },
//     { label: t('my_messages') || 'رسائلي', path: '/chats', icon: <MessageIcon /> },
//     { label: t('add_product') || 'إضافة إعلان', path: '/add-product', icon: <AddBoxIcon />, requiresAuth: true },
//   ];

//   const StyledBadge = styled(Badge)(({ theme }) => ({
//     '& .MuiBadge-badge': {
//       right: -3,
//       top: 13,
//       border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
//       padding: '0 4px',
//     },
//   }));

//   const handleOpenProfile = (event) => setAnchorProfile(event.currentTarget);
//   const handleCloseProfile = () => setAnchorProfile(null);
//   const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
//   const handleCloseNavMenu = () => setAnchorElNav(null);
//   const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
//   const handleCloseUserMenu = () => setAnchorElUser(null);

//   // Close mobile menu when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (anchorElNav && !anchorElNav.contains(event.target)) {
//         handleCloseNavMenu();
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [anchorElNav]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/');
//     window.location.reload();
//   };
//   const handleAddProductNav = () => {
//     try {
//       const keys = ['token', 'access_token', 'jwt', 'authToken'];
//       let t = null;
//       if (typeof window !== 'undefined') {
//         for (const k of keys) { const v = localStorage.getItem(k); if (v && String(v).trim() && v !== 'null' && v !== 'undefined') { t = v; break; } }
//       }
//       if (t) navigate('/add-product'); else navigate('/login');
//     } catch {
//       navigate('/login');
//     }
//   };

//   useEffect(() => {
//     let mounted = true;
//     const loadCount = async () => {
//       try {
//         const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//         if (!token) { if (mounted) setFavCount(0); return; }
//         const res = await getMyFavorites();
//         const data = res && (res.data ?? res) ? (res.data ?? res) : [];
//         let products = [];
//         if (Array.isArray(data)) products = data.map(f => f.product || f).filter(Boolean);
//         else if (Array.isArray(data.items)) products = data.items.map(f => f.product || f).filter(Boolean);
//         else if (Array.isArray(data.data)) products = data.data.map(f => f.product || f).filter(Boolean);
//         if (mounted) setFavCount(products.length);
//       } catch (e) {
//         // ignore
//       }
//     };
//     loadCount();
//     const onUpdated = () => loadCount();
//     window.addEventListener('favorites:updated', onUpdated);
//     return () => { mounted = false; window.removeEventListener('favorites:updated', onUpdated); };
//   }, []);

//   // Load chats count for "My Messages" badge
//   useEffect(() => {
//     let mounted = true;
//     const loadChats = async () => {
//       try {
//         if (!token) { if (mounted) setChatCount(0); return; }
//         const res = await listChats();
//         const data = res?.data ?? res;
//         const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.data) ? data.data : []));
//         if (mounted) setChatCount(items.length || 0);
//       } catch (_) {
//         if (mounted) setChatCount(0);
//       }
//     };
//     loadChats();
//     return () => { mounted = false; };
//   }, [token]);

//   useEffect(() => {
//     let mounted = true;
//     const loadProfile = async () => {
//       try {
//         if (!token) { if (mounted) setProfile(null); return; }
//         const res = await axiosInstance.get('/users/profile');
//         if (mounted) setProfile(res?.data || null);
//       } catch (_) {
//         if (mounted) setProfile(null);
//       }
//     };
//     loadProfile();
//     return () => { mounted = false; };
//   }, [token]);

//   // Load cart count
//   useEffect(() => {
//     let mounted = true;
//     const loadCart = () => {
//       try {
//         const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
//         if (mounted) setCartCount(Array.isArray(cartData) ? cartData.length : 0);
//       } catch (_) {
//         if (mounted) setCartCount(0);
//       }
//     };
//     loadCart();
//     const onCartUpdated = () => loadCart();
//     window.addEventListener('cart:updated', onCartUpdated);
//     return () => {
//       mounted = false;
//       window.removeEventListener('cart:updated', onCartUpdated);
//     };
//   }, []);

//   const resolveAvatar = () => {
//     if (!profile) return undefined;
//     const img = profile.avatar || profile.avatarUrl || profile.image || profile.photo || profile.picture;
//     if (!img) return undefined;
//     const hasProtocol = /^https?:\/\//i.test(img);
//     if (hasProtocol) return img;
//     try {
//       const origin = new URL(axiosInstance.defaults.baseURL).origin;
//       return origin + (String(img).startsWith('/') ? img : `/${img}`);
//     } catch {
//       return img;
//     }
//   };

//   return (
//     <AppBar position="static" sx={{ 
//       backgroundColor: darkMode ? '#0d1b2a' : '#0d1b2a',
//       boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
//     }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>

//           {/* MOBILE: Menu Icon (Left) */}
//           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleOpenNavMenu}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>

//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'start',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'start',
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{ 
//                 display: { xs: 'block', md: 'none' },
//                 '& .MuiPaper-root': {
//                   bgcolor: darkMode ? '#1a2f4a' : '#fff',
//                   color: darkMode ? '#fff' : '#000',
//                   minWidth: 200,
//                 }
//               }}
//             >
//               {leftLinks
//                 .filter(link => !link.requiresAuth || token)
//                 .map((link) => (
//                   <MenuItem 
//                     key={link.path} 
//                     onClick={() => {
//                       navigate(link.path);
//                       handleCloseNavMenu();
//                     }}
//                     sx={{
//                       '&:hover': {
//                         bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
//                       }
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
//                       {link.icon}
//                     </ListItemIcon>
//                     <ListItemText>{link.label}</ListItemText>
//                   </MenuItem>
//                 ))}

//               {!token && (
//                 <>
//                   <Divider sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />
//                   <MenuItem 
//                     onClick={() => {
//                       navigate('/login');
//                       handleCloseNavMenu();
//                     }}
//                     sx={{
//                       '&:hover': {
//                         bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
//                       }
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
//                       <LoginIcon />
//                     </ListItemIcon>
//                     <ListItemText>{t('login')}</ListItemText>
//                   </MenuItem>
//                   <MenuItem 
//                     onClick={() => {
//                       navigate('/register');
//                       handleCloseNavMenu();
//                     }}
//                     sx={{
//                       '&:hover': {
//                         bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
//                       }
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
//                       <HowToRegIcon />
//                     </ListItemIcon>
//                     <ListItemText>{t('register')}</ListItemText>
//                   </MenuItem>
//                 </>
//               )}

//               {token && (
//                 <>
//                   <Divider sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />
//                   <MenuItem 
//                     onClick={() => {
//                       navigate('/profile');
//                       handleCloseNavMenu();
//                     }}
//                     sx={{
//                       '&:hover': {
//                         bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
//                       }
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
//                       <AccountCircleIcon />
//                     </ListItemIcon>
//                     <ListItemText>{t('profile')}</ListItemText>
//                   </MenuItem>
//                   <MenuItem 
//                     onClick={() => {
//                       handleLogout();
//                       handleCloseNavMenu();
//                     }}
//                     sx={{
//                       '&:hover': {
//                         bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
//                       }
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
//                       <LogoutIcon />
//                     </ListItemIcon>
//                     <ListItemText>{t('logout')}</ListItemText>
//                   </MenuItem>
//                 </>
//               )}
//             </Menu>

//           </Box>

//           {/* CENTER: Logo */}
//           <Typography
//             variant="h5"
//             noWrap
//             component={RouterLink}
//             to="/"
//             sx={{
//               display: 'flex',
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.1rem',
//               color: 'inherit',
//               textDecoration: 'underline',
//               textUnderlineOffset: '4px',
//               flexGrow: 0,
//             }}
//           >
//             Aldowar
//           </Typography>

//           {/* CENTER: Navigation Links */}
//           <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end', alignItems: 'center', gap: 3 }}>
//             <Button
//               component={RouterLink} to="/"
//               color="inherit"
//               sx={{ textTransform: 'none', fontWeight: 600 }}>
//               {t('home')}
//             </Button>

//             <Button
//               component={RouterLink}
//               to="/categories"
//               variant="contained"
//               sx={{
//                 textTransform: 'none',
//                 backgroundColor: '#34495e',
//                 fontWeight: 600,
//                 borderRadius: 2,
//                 '&:hover': {
//                   backgroundColor: '#2c3e50',
//                 },
//               }}
//             >
//               {t('categories')}
//             </Button>

//             <Button component={RouterLink} to="/cart" color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>{t('cart')}</Button>
//           </Box>

//           {/* DESKTOP: Right Side Navigation */}
//           <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
//             <Button onClick={handleAddProductNav} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>{t('add_product') || 'Add Listing'}</Button>

//             <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 28, alignSelf: 'center', mx: 1 }} />

//             {/* Cart Icon */}
//             <Tooltip title={t('cart')}>
//               <IconButton component={RouterLink} to="/cart" color="inherit">
//                 <StyledBadge badgeContent={cartCount} color="error">
//                   <CartIcon size={24} />
//                 </StyledBadge>
//               </IconButton>
//             </Tooltip>

//             <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 28, alignSelf: 'center', mx: 1 }} />

//             {/* User Dropdown */}
//             <Tooltip title={t('account_settings') || "Account settings"}>
//               <IconButton onClick={handleOpenUserMenu} color="inherit" sx={{ p: 0 }}>
//                 {token && profile ? (
//                   <Avatar
//                     src={resolveAvatar()}
//                     sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}
//                   >
//                     {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
//                   </Avatar>
//                 ) : (
//                   <AccountCircleIcon fontSize="large" />
//                 )}
//               </IconButton>
//             </Tooltip>

//             <Menu
//               sx={{ mt: '45px' }}
//               id="menu-appbar"
//               anchorEl={anchorElUser}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'end',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'end',
//               }}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//               PaperProps={{
//                 sx: {
//                   width: 220,
//                   maxWidth: '100%',
//                 },
//               }}
//             >
//               <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
//                 <ListItemIcon>
//                   <AccountCircleIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>{t('profile')}</ListItemText>
//               </MenuItem>

//               <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/chats'); }}>
//                 <ListItemIcon>
//                   <MessageIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>{t('my_messages')}</ListItemText>
//               </MenuItem>

//               <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/my-products'); }}>
//                 <ListItemIcon>
//                   <ViewListIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>{t('my_products')}</ListItemText>
//               </MenuItem>

//               <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/favorites'); }}>
//                 <ListItemIcon>
//                   <FavoriteIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>{t('favorites')}</ListItemText>
//               </MenuItem>

//               <Divider />

//               <MenuItem onClick={() => { handleCloseUserMenu(); toggleLang(); }}>
//                 <ListItemIcon>
//                   <TranslateIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>{t('language')}</ListItemText>
//               </MenuItem>

//               <MenuItem>
//                 <ListItemIcon>
//                   <ContrastIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText>{t('theme')}</ListItemText>
//                 <Switch
//                   size="small"
//                   checked={darkMode}
//                   onChange={toggleDarkMode}
//                 />
//               </MenuItem>

//               {token && [
//                 <Divider key="divider-logout" />,
//                 <MenuItem key="logout" onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
//                   <ListItemIcon>
//                     <AccountCircleIcon fontSize="small" />
//                   </ListItemIcon>
//                   <ListItemText>{t('logout')}</ListItemText>
//                 </MenuItem>
//               ]}

//               {!token && [
//                 <Divider key="divider-login" />,
//                 <MenuItem key="login" onClick={() => { handleCloseUserMenu(); navigate('/login'); }}>
//                   <ListItemText>{t('login')}</ListItemText>
//                 </MenuItem>,
//                 <MenuItem key="register" onClick={() => { handleCloseUserMenu(); navigate('/register'); }}>
//                   <ListItemText>{t('register')}</ListItemText>
//                 </MenuItem>
//               ]}
//             </Menu>
//           </Box>

//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

//---------------------------------------------------------------------------------------old-----------------------------------------------------------------------------------------

import { AppBar, Toolbar, Typography, IconButton, Box, Button, Divider, Menu, MenuItem, Avatar, Badge, Container, Tooltip, ListItemIcon, ListItemText, Switch, TextField , InputAdornment} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import TranslateIcon from "@mui/icons-material/Translate";

import MenuIcon from '@mui/icons-material/Menu';
import MessageIcon from '@mui/icons-material/Message';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from "react";
import { getMyFavorites } from "../api/favoritesAPI";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { t, toggleLang } from "../i18n";
import { listChats } from "../api/messagesAPI";
import axiosInstance from "../api/axiosInstance";
import ContrastIcon from '@mui/icons-material/Contrast';
import { styled } from '@mui/material/styles';
import { CartIcon } from "./CartIcon";
import ProfileDrawer from "./ProfileSidebar";

import SearchIcon from '@mui/icons-material/Search';

import TuneIcon from '@mui/icons-material/Tune';






export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
  // const canSell = !!token && (userType === 'seller' || userType === 'both'); // Unused variable
  const location = useLocation();
  // const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path)); // Unused variable

  const [anchorProfile, setAnchorProfile] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [favCount, setFavCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [cartCount, setCartCount] = useState(4);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // const openProfile = Boolean(anchorProfile); // Unused variable

  const leftLinks = [
    { label: t('home'), path: '/', icon: <HomeIcon /> },
    { label: t('categories'), path: '/categories', icon: <CategoryIcon /> },
    { label: t('cart'), path: '/cart', icon: <ShoppingCartIcon /> },
    { label: t('my_products') || 'إعلاناتي', path: '/my-products', icon: <ViewListIcon /> },
    { label: t('favorites'), path: '/favorites', icon: <FavoriteIcon /> },
    { label: t('my_messages') || 'رسائلي', path: '/chats', icon: <MessageIcon /> },
    { label: t('add_product') || 'إضافة إعلان', path: '/add-product', icon: <AddBoxIcon />, requiresAuth: true },
  ];

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
      padding: '0 4px',
    },
  }));

  // const handleOpenProfile = (event) => setAnchorProfile(event.currentTarget); // Unused
  // const handleCloseProfile = () => setAnchorProfile(null); // Unused
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);



  






  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anchorElNav && !anchorElNav.contains(event.target)) {
        handleCloseNavMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorElNav]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };
  const handleAddProductNav = () => {
    try {
      const keys = ['token', 'access_token', 'jwt', 'authToken'];
      let t = null;
      if (typeof window !== 'undefined') {
        for (const k of keys) { const v = localStorage.getItem(k); if (v && String(v).trim() && v !== 'null' && v !== 'undefined') { t = v; break; } }
      }
      if (t) navigate('/add-product'); else navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadCount = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) { if (mounted) setFavCount(0); return; }
        const res = await getMyFavorites();
        const data = res && (res.data ?? res) ? (res.data ?? res) : [];
        let products = [];
        if (Array.isArray(data)) products = data.map(f => f.product || f).filter(Boolean);
        else if (Array.isArray(data.items)) products = data.items.map(f => f.product || f).filter(Boolean);
        else if (Array.isArray(data.data)) products = data.data.map(f => f.product || f).filter(Boolean);
        if (mounted) setFavCount(products.length);
      } catch (e) {
        // ignore
      }
    };
    loadCount();
    const onUpdated = () => loadCount();
    window.addEventListener('favorites:updated', onUpdated);
    return () => { mounted = false; window.removeEventListener('favorites:updated', onUpdated); };
  }, []);

  // Load chats count for "My Messages" badge
  useEffect(() => {
    let mounted = true;
    const loadChats = async () => {
      try {
        if (!token) { if (mounted) setChatCount(0); return; }
        const res = await listChats();
        const data = res?.data ?? res;
        const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.data) ? data.data : []));
        if (mounted) setChatCount(items.length || 0);
      } catch (_) {
        if (mounted) setChatCount(0);
      }
    };
    loadChats();
    return () => { mounted = false; };
  }, [token]);

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      try {
        if (!token) { if (mounted) setProfile(null); return; }
        const res = await axiosInstance.get('/users/profile');
        if (mounted) setProfile(res?.data || null);
      } catch (_) {
        if (mounted) setProfile(null);
      }
    };
    loadProfile();
    return () => { mounted = false; };
  }, [token]);

  // Load cart count
  useEffect(() => {
    let mounted = true;
    const loadCart = () => {
      try {
        const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
        if (mounted) setCartCount(Array.isArray(cartData) ? cartData.length : 0);
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
  }, []);

  const resolveAvatar = () => {
    if (!profile) return undefined;
    const img = profile.avatar || profile.avatarUrl || profile.image || profile.photo || profile.picture;
    if (!img) return undefined;
    const hasProtocol = /^https?:\/\//i.test(img);
    if (hasProtocol) return img;
    try {
      const origin = new URL(axiosInstance.defaults.baseURL).origin;
      return origin + (String(img).startsWith('/') ? img : `/${img}`);
    } catch {
      return img;
    }
  };

  return (
    <AppBar position="fixed" sx={{
      top: 0,
      zIndex: 1100,
      backgroundColor: darkMode ? '#0d1b2a' : '#0d1b2a',
      boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* MOBILE: Menu Icon (Left) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'start',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'start',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  bgcolor: darkMode ? '#1a2f4a' : '#fff',
                  color: darkMode ? '#fff' : '#000',
                  minWidth: 200,
                }
              }}
            >
              {leftLinks
                .filter(link => !link.requiresAuth || token)
                .map((link) => (
                  <MenuItem
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      handleCloseNavMenu();
                    }}
                    sx={{
                      '&:hover': {
                        bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText>{link.label}</ListItemText>
                  </MenuItem>
                ))}

              {/* ------------ FIX: Changed Fragments <> to Arrays [] ------------ */}
              {!token && [
                <Divider key="mob-div-1" sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />,
                <MenuItem
                  key="mob-login"
                  onClick={() => {
                    navigate('/login');
                    handleCloseNavMenu();
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText>{t('login')}</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="mob-register"
                  onClick={() => {
                    navigate('/register');
                    handleCloseNavMenu();
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                    <HowToRegIcon />
                  </ListItemIcon>
                  <ListItemText>{t('register')}</ListItemText>
                </MenuItem>
              ]}

              {token && [
                <Divider key="mob-div-2" sx={{ borderColor: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }} />,
                <MenuItem
                  key="mob-profile"
                  onClick={() => {
                    navigate('/profile');
                    handleCloseNavMenu();
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText>{t('profile')}</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="mob-logout"
                  onClick={() => {
                    handleLogout();
                    handleCloseNavMenu();
                  }}
                  sx={{
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: darkMode ? '#fff' : '#000' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText>{t('logout')}</ListItemText>
                </MenuItem>
              ]}
              {/* ----------------------------------------------------------------- */}

            </Menu>



          </Box>

          {/* CENTER: Logo */}
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              flexGrow: 0,
            }}
          >
            {t('site_name')}
          </Typography>

          {/* CENTER: Navigation Links */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end', alignItems: 'center', gap: 3 }}>
            <Button
              component={RouterLink} to="/"
              color="inherit"
              sx={{ textTransform: 'none', fontWeight: 600 }}>
              {t('home')}
            </Button>

            <Button
              component={RouterLink}
              to="/categories"
              variant=""
              sx={{
                textTransform: 'none',

                fontWeight: 600,

              }}
            >
              {t('categories')}
            </Button>

            <Button component={RouterLink} to="/cart" color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>{t('cart')}</Button>

             <Box 
             sx={{
              
                bgcolor: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 2,
                p: 0,
                mx: 12,
                flexGrow: 1, 
                maxWidth: 600, 
                
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                
            }}
             
             >
                 <Tooltip 
                 
                 
                 title="تصفية النتائج">
                     <IconButton
                     sx={{
                      ml:2,
                      color: '#000000',
                      bgcolor: '#ffffff',
                      '&:hover': {
                        bgcolor: '#ff0000'
                      }
                     }}
                     onClick={() => setOpenFilterDrawer(true)} size="small"
                     >
                        <TuneIcon  />
                     </IconButton>
                </Tooltip>
                <Divider orientation="vertical" flexItem sx={{ bgcolor: '#ffffff', height: 30, alignSelf: 'center' }} />

              <TextField
              sx={{
                mr:2,
                ml:2,
              }}
              variant="standard"
              placeholder={t('search_placeholder')}
              fullWidth
              value={searchTerm}
              onChange={ (q) => setSearchTerm(q.target.value) }
              onKeyDown={ (e) => { 
                if (e.key === 'Enter') {
                  const trimmedSearch = searchTerm.trim();
                  if (trimmedSearch) {
                    navigate(`/?q=${encodeURIComponent(trimmedSearch)}`);
                  } else {
                    navigate('/');
                  }
                }
              }}
              InputProps={{
                disableUnderline: true,
                 endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="#000000" />
               </InputAdornment>
                    ),
                }}
              />

             </Box>
           
          </Box>

          {/* DESKTOP: Right Side Navigation */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
            
            
            
            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 28, alignSelf: 'center', mx: 1 }} />
            <Button onClick={handleAddProductNav} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>{t('add_product') || 'Add Listing'}</Button>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 28, alignSelf: 'center', mx: 1 }} />

            {/* Cart Icon */}
            <Tooltip title={t('cart')}>
              <IconButton component={RouterLink} to="/cart" color="inherit">
                <StyledBadge badgeContent={cartCount} color="error">
                  <CartIcon size={24} />
                </StyledBadge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)', height: 28, alignSelf: 'center', mx: 1 }} />

            {/* User Dropdown */}
            <Tooltip title={t('account_settings') || "Account settings"}>
              <IconButton onClick={handleOpenUserMenu} color="inherit" sx={{ p: 0 }}>
                {token && profile ? (
                  <Avatar
                    src={resolveAvatar()}
                    sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}
                  >
                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                  </Avatar>
                ) : (
                  <AccountCircleIcon fontSize="large" />
                )}
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'end',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'end',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  width: 220,
                  maxWidth: '100%',
                },
              }}
            >
              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('profile')}</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/chats'); }}>
                <ListItemIcon>
                  <MessageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('my_messages')}</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/my-products'); }}>
                <ListItemIcon>
                  <ViewListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('my_products')}</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/favorites'); }}>
                <ListItemIcon>
                  <FavoriteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('favorites')}</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem onClick={() => { handleCloseUserMenu(); toggleLang(); }}>
                <ListItemIcon>
                  <TranslateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('language')}</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContrastIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('theme')}</ListItemText>
                <Switch
                  size="small"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
              </MenuItem>

              {token && [
                <Divider key="divider-logout" />,
                <MenuItem key="logout" onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('logout')}</ListItemText>
                </MenuItem>
              ]}

              {!token && [
                <Divider key="divider-login" />,
                <MenuItem key="login" onClick={() => { handleCloseUserMenu(); navigate('/login'); }}>
                  <ListItemText>{t('login')}</ListItemText>
                </MenuItem>,
                <MenuItem key="register" onClick={() => { handleCloseUserMenu(); navigate('/register'); }}>
                  <ListItemText>{t('register')}</ListItemText>
                </MenuItem>
              ]}
            </Menu>
          </Box>

          <IconButton onClick={() => setIsDrawerOpen(true)}>
            <Avatar src="/path-to-image.jpg" alt="User" />
          </IconButton>

        </Toolbar>
      </Container>
      <ProfileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AppBar>

  );
}


//--------------------------------===========================================================================------------------------



// import { AppBar, Toolbar, Typography, IconButton, Box, TextField, Avatar, Badge, Container, Tooltip } from "@mui/material";
// import { Search, ShoppingCart, Tune, Menu as MenuIcon } from "@mui/icons-material"; // Tune هي أيقونة الفلتر
// import { useState, useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import ProfileDrawer from "../components/ProfileSidebar";
// import FilterDrawer from "../pages/FilterDrawer"; // استدعاء ملف الفلتر الذي أرسلته
// import { t } from "../i18n";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
  
//   // States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [cartCount, setCartCount] = useState(0);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false); // للتحكم في فتح الفلتر

//   // 1. مزامنة نص البحث مع الرابط عند التحميل
//   useEffect(() => {
//     setSearchTerm(searchParams.get("search") || "");
//   }, [searchParams]);

//   // 2. تحديث عداد السلة
//   useEffect(() => {
//     const loadCart = () => {
//       try {
//         const storedUser = localStorage.getItem('user');
//         let uid = 'guest';
//         if(storedUser) uid = JSON.parse(storedUser).id || 'guest';
//         const isRTL = localStorage.getItem('lang') === 'ar';
//         const data = JSON.parse(localStorage.getItem(isRTL ? `cart_user_${uid}` : 'cart') || '[]');
//         setCartCount(Array.isArray(data) ? data.length : 0);
//       } catch (_) { setCartCount(0); }
//     };
//     loadCart();
//     window.addEventListener('cart:updated', loadCart);
//     return () => window.removeEventListener('cart:updated', loadCart);
//   }, []);

//   // 3. دالة تطبيق البحث والفلترة (تحديث الرابط)
//   const updateURL = (newParams) => {
//     const params = new URLSearchParams(searchParams);
    
//     // دمج الباراميترات الجديدة
//     Object.keys(newParams).forEach(key => {
//       if (newParams[key] !== undefined && newParams[key] !== "" && newParams[key] !== null) {
//         params.set(key, newParams[key]);
//       } else {
//         params.delete(key);
//       }
//     });

//     navigate(`/?${params.toString()}`);
//   };

//   // عند الضغط على Enter في البحث
//   const handleSearch = () => {
//     updateURL({ search: searchTerm });
//   };

//   // عند تطبيق الفلاتر من الـ FilterDrawer
//   const handleApplyFilter = (filterData) => {
//     // filterData تأتي من ملف FilterDrawer وتحتوي على (priceRange, condition, province...)
//     updateURL({
//       minPrice: filterData.minPrice || filterData.priceRange?.[0],
//       maxPrice: filterData.maxPrice || filterData.priceRange?.[1],
//       condition: filterData.condition === 'all' ? '' : filterData.condition,
//       provinceId: filterData.province || filterData.provinceId, // تأكد من الاسم في FilterDrawer
//     });
//   };

//   return (
//     <>
//       <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
//         <Container maxWidth="xl">
//           <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 2 }}>
            
//             {/* الشعار */}
//             <Typography
//               variant="h6"
//               noWrap
//               component="div"
//               onClick={() => navigate('/')}
//               sx={{ cursor: 'pointer', fontWeight: 'bold', color: 'primary.main', display: { xs: 'none', sm: 'block' } }}
//             >
//               LOGO
//             </Typography>

//             {/* --- منطقة الوسط: البحث + زر الفلتر --- */}
//             <Box sx={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 flexGrow: 1, 
//                 maxWidth: 600, 
//                 bgcolor: 'action.hover', 
//                 borderRadius: 3,
//                 border: '1px solid #e0e0e0',
//                 p: '2px 4px'
//             }}>
//                 {/* زر الفلتر */}
//                 <Tooltip title="تصفية النتائج">
//                     <IconButton onClick={() => setIsFilterOpen(true)} sx={{ p: '10px' }}>
//                         <Tune color="primary" />
//                     </IconButton>
//                 </Tooltip>

//                 {/* حقل الكتابة */}
//                 <TextField
//                     variant="standard"
//                     placeholder={t('search_placeholder') || "ابحث عن منتج..."}
//                     fullWidth
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                     InputProps={{ disableUnderline: true, sx: { ml: 1, flex: 1 } }}
//                 />
                
//                 {/* زر البحث */}
//                 <IconButton onClick={handleSearch} sx={{ p: '10px' }}>
//                     <Search />
//                 </IconButton>
//             </Box>

//             {/* --- الأيقونات الجانبية --- */}
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <IconButton onClick={() => navigate('/cart')}>
//                     <Badge badgeContent={cartCount} color="error">
//                         <ShoppingCart />
//                     </Badge>
//                 </IconButton>
                
//                 <IconButton onClick={() => setIsProfileOpen(true)}>
//                     <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} />
//                 </IconButton>
//             </Box>

//           </Toolbar>
//         </Container>
//       </AppBar>

//       {/* القوائم الجانبية */}
//       <ProfileDrawer open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
//       {/* استدعاء ملف الفلتر وربطه بدالة التحديث */}
//       <FilterDrawer 
//         open={isFilterOpen} 
//         onClose={() => setIsFilterOpen(false)} 
//         onApply={handleApplyFilter} 
//       />
//     </>
//   );
// }