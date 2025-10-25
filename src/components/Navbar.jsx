import { AppBar, Toolbar, Typography, IconButton, Box, Button, Divider, Menu, MenuItem, Avatar, Badge } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Brightness4, Brightness7 } from "@mui/icons-material";
import TranslateIcon from "@mui/icons-material/Translate";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import { getMyFavorites } from "../api/favoritesAPI";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { t, toggleLang } from "../i18n";
import { listChats } from "../api/messagesAPI";
import axiosInstance from "../api/axiosInstance";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
  const canSell = !!token && (userType === 'seller' || userType === 'both');
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const [anchorProfile, setAnchorProfile] = useState(null);
  const [favCount, setFavCount] = useState(0);
  const [chatCount, setChatCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const openProfile = Boolean(anchorProfile);
  const handleOpenProfile = (event) => setAnchorProfile(event.currentTarget);
  const handleCloseProfile = () => setAnchorProfile(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };
  const handleAddProductNav = () => {
    try {
      const keys = ['token','access_token','jwt','authToken'];
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
    <>
    <AppBar
      position="fixed"
      color="default"
      sx={{
        background: darkMode
          ? "linear-gradient(90deg, #0b1d39 0%, #0f2b66 50%, #143873 100%)"
          : "linear-gradient(90deg, #0f2b66 0%, #154384 50%, #1b4f99 100%)",
        color: "#fff",
        boxShadow: "0 6px 18px rgba(11,29,57,0.20)",
      }}
    >
      <Toolbar sx={{ px: 3, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
        {/* Right: الرئيسية - الفئات - السلة */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', justifyContent: 'flex-start' }}>
          <Button component={RouterLink} to="/" color="inherit"
            variant={isActive('/') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/') ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >{t('home')}</Button>
          <Button component={RouterLink} to="/categories" color="inherit"
            variant={isActive('/categories') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/categories') ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >{t('categories')}</Button>
          <Button component={RouterLink} to="/cart" color="inherit"
            variant={isActive('/cart') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/cart') ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >{t('cart')}</Button>
          <Button component={RouterLink} to="/my-products" color="inherit"
            variant={isActive('/my-products') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/my-products') ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >{t('my_products') || 'إعلاناتي'}</Button>
          <Button component={RouterLink} to="/favorites" color="inherit"
            variant={isActive('/favorites') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/favorites') ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >
            <Badge badgeContent={favCount} color="error" overlap="circular">
              <FavoriteIcon sx={{ color: '#fff', verticalAlign: 'middle', mr: 1 }} />
            </Badge>
          </Button>
          
        </Box>

        {/* Center: Site name */}
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, textAlign: 'center' }} component={RouterLink} to="/" color="inherit">
          {t('site_name')}
        </Typography>

        {/* Left: Add Product (if seller) + Messages + Profile + Theme + Lang */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button onClick={handleAddProductNav} color="inherit" variant={isActive('/add-product') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/add-product') ? 'rgba(255,255,255,0.18)' : 'transparent' }}>
            {t('add_product') || 'إضافة إعلان'}
          </Button>

          {/* My Messages near profile */}
          <Button component={RouterLink} to="/chats" color="inherit"
            variant={isActive('/chats') ? 'contained' : 'text'}
            sx={{ backgroundColor: isActive('/chats') ? 'rgba(255,255,255,0.18)' : 'transparent' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#fff' }}>{t('messages') || 'My Messages'}</Typography>
              {!!chatCount && (
                <Box sx={{
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  px: 1,
                  lineHeight: 1.6,
                  borderRadius: 10,
                  fontSize: 12,
                  minWidth: 22,
                  textAlign: 'center'
                }}>
                  {chatCount}
                </Box>
              )}
            </Box>
          </Button>

          {/* Profile menu icon */}
          <IconButton color="inherit" onClick={handleOpenProfile} size="small" aria-haspopup="true" aria-controls={openProfile ? 'profile-menu' : undefined}>
            {token ? (
              <Avatar src={resolveAvatar()} sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.2)' }}>P</Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorProfile}
            open={openProfile}
            onClose={handleCloseProfile}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {!token ? (
              [
                <MenuItem key="login" onClick={() => { handleCloseProfile(); navigate('/login'); }}>{t('login')}</MenuItem>,
                <MenuItem key="register" onClick={() => { handleCloseProfile(); navigate('/register'); }}>{t('register')}</MenuItem>
              ]
            ) : (
              [
                <MenuItem key="profile" onClick={() => { handleCloseProfile(); navigate('/profile'); }}>{t('profile')}</MenuItem>,
                <MenuItem key="my-products" onClick={() => { handleCloseProfile(); navigate('/my-products'); }}>{t('my_products')}</MenuItem>,
                <MenuItem key="favorites" onClick={() => { handleCloseProfile(); navigate('/favorites'); }}>{t('favorites')}</MenuItem>,
                <MenuItem key="chats" onClick={() => { handleCloseProfile(); navigate('/chats'); }}>{t('my_messages') || 'My Messages'}</MenuItem>,
                canSell && (
                  <MenuItem key="add-product" onClick={() => { handleCloseProfile(); navigate('/add-product'); }}>{t('add_product')}</MenuItem>
                ),
                <Divider key="divider" />,
                <MenuItem key="logout" onClick={() => { handleCloseProfile(); handleLogout(); }}>{t('logout')}</MenuItem>,
              ]
            )}
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.25)' }} />
          <IconButton onClick={toggleDarkMode} color="inherit" size="small">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton onClick={toggleLang} color="inherit" size="small">
            <TranslateIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
    <Toolbar />
    </>
  );
}

