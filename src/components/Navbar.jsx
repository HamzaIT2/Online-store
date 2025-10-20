import { AppBar, Toolbar, Typography, IconButton, Box, Button, Divider, Menu, MenuItem, Avatar } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import TranslateIcon from "@mui/icons-material/Translate";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { t, toggleLang } from "../i18n";
import { useState } from "react";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
  const canSell = !!token && (userType === 'seller' || userType === 'both');
  const location = useLocation();
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const [anchorProfile, setAnchorProfile] = useState(null);
  const openProfile = Boolean(anchorProfile);
  const handleOpenProfile = (event) => setAnchorProfile(event.currentTarget);
  const handleCloseProfile = () => setAnchorProfile(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <AppBar
      position="static"
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
        </Box>

        {/* Center: Site name */}
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, textAlign: 'center' }} component={RouterLink} to="/" color="inherit">
          {t('site_name')}
        </Typography>

        {/* Left: Add Product (if seller) + Profile + Theme + Lang */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
          {canSell && (
            <Button component={RouterLink} to="/add-product" color="inherit" variant={isActive('/add-product') ? 'contained' : 'text'}
              sx={{ backgroundColor: isActive('/add-product') ? 'rgba(255,255,255,0.18)' : 'transparent' }}>
              {t('add_product')}
            </Button>
          )}

          {/* Profile menu icon */}
          <IconButton color="inherit" onClick={handleOpenProfile} size="small" aria-haspopup="true" aria-controls={openProfile ? 'profile-menu' : undefined}>
            {token ? (
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.2)' }}>P</Avatar>
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
              <>
                <MenuItem onClick={() => { handleCloseProfile(); navigate('/login'); }}>{t('login')}</MenuItem>
                <MenuItem onClick={() => { handleCloseProfile(); navigate('/register'); }}>{t('register')}</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => { handleCloseProfile(); navigate('/profile'); }}>{t('profile')}</MenuItem>
                <MenuItem onClick={() => { handleCloseProfile(); navigate('/my-products'); }}>{t('my_products')}</MenuItem>
                <MenuItem onClick={() => { handleCloseProfile(); navigate('/favorites'); }}>{t('favorites')}</MenuItem>
                {canSell && (
                  <MenuItem onClick={() => { handleCloseProfile(); navigate('/add-product'); }}>{t('add_product')}</MenuItem>
                )}
                <Divider />
                <MenuItem onClick={() => { handleCloseProfile(); handleLogout(); }}>{t('logout')}</MenuItem>
              </>
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
  );
}

