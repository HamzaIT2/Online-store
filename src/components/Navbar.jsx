
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Divider, Menu, MenuItem, Avatar, Badge, Container, Tooltip, ListItemIcon, ListItemText, Switch, TextField, InputAdornment } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import TranslateIcon from "@mui/icons-material/Translate";
import MenuIcon from '@mui/icons-material/Menu';
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
import { Link as RouterLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { t, toggleLang } from "../i18n";
import axiosInstance from "../api/axiosInstance";
import ContrastIcon from '@mui/icons-material/Contrast';
import { styled } from '@mui/material/styles';
import { CartIcon } from "./CartIcon";
import ProfileDrawer from "./ProfileSidebar";
import FilterDrawer from "../pages/FilterDrawer";
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userType = typeof window !== 'undefined' ? (localStorage.getItem('userType') || 'buyer') : 'buyer';
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [favCount, setFavCount] = useState(0);
  const [cartCount, setCartCount] = useState(4);
  const [profile, setProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const leftLinks = [
    { label: t('home'), path: '/', icon: <HomeIcon /> },
    { label: t('categories'), path: '/categories', icon: <CategoryIcon /> },
    { label: t('cart'), path: '/cart', icon: <ShoppingCartIcon /> },
    { label: t('my_products') || 'إعلاناتي', path: '/my-products', icon: <ViewListIcon /> },
    { label: t('favorites'), path: '/favorites', icon: <FavoriteIcon /> },
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


  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);


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
    // Clear authentication
    localStorage.removeItem('token');

    // Clear user-specific data
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    localStorage.removeItem('user');

    // Clear any additional auth tokens
    const authKeys = ['access_token', 'jwt', 'authToken'];
    authKeys.forEach(key => localStorage.removeItem(key));

    // Navigate and refresh
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
   
        const data = res?.data || [];
        let products = [];
        if (Array.isArray(data)) {
          products = data.map(f => f.product || f).filter(Boolean);
        } else if (Array.isArray(res)) {
   
          products = res.map(f => f.product || f).filter(Boolean);
        }
        if (mounted) setFavCount(products.length);
      } catch (error) {
     
        if (error?.response?.status !== 401) {
          console.warn('Failed to load favorites count:', error?.response?.status);
        }
        if (mounted) setFavCount(0);
      }
    };
    loadCount();
    const onUpdated = () => loadCount();
    window.addEventListener('favorites:updated', onUpdated);
    return () => { mounted = false; window.removeEventListener('favorites:updated', onUpdated); };
  }, []);
  useEffect(() => {
    const uploadPendingAvatar = async () => {
    

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser?.userId || storedUser?.id;
      if (!userId) return;

      // فتح قاعدة بيانات المتصفح لقراءة الملف الأصلي
      const dbRequest = indexedDB.open("AvatarDB", 1);
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("images")) return;

        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        const getRequest = store.get("pendingAvatar");

        getRequest.onsuccess = async () => {
          const file = getRequest.result; // جلب ملف الصورة الحقيقي مباشرة!
          if (!file) {
          
            return;
          }

        
          try {
            const fd = new FormData();
            fd.append('avatar', file);

            const token = localStorage.getItem('token');
            const avatarRes = await axiosInstance.post(`/users/${userId}/avatar`, fd, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
              }
            });

            

            if (avatarRes?.data) {
              const updatedAvatar = avatarRes.data.avatar || avatarRes.data.profileImage;
              if (updatedAvatar) {
                storedUser.profileImage = updatedAvatar;
                storedUser.avatar = updatedAvatar;
                localStorage.setItem('user', JSON.stringify(storedUser));
              }
            }

        
            store.delete("pendingAvatar");
          

            window.location.reload(); 

          } catch (error) {
            console.error("❌ خطأ أثناء رفع الصورة للسيرفر:", error);
          }
        };
      };
    };

    // تأخير خفيف لضمان استقرار بيانات تسجيل الدخول بعد الـ OTP
    setTimeout(() => {
      uploadPendingAvatar();
    }, 600);

  }, [location.pathname]);
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        // 1. تحقق من وجود التوكن أولاً
        const token = localStorage.getItem('token'); // أو حسب مكان تخزين التوكن عندك
        if (!token) {
          if (mounted) setProfile(null);
          return;
        }

        // 2. قراءة فورية من الـ localStorage لمنع ظهور الحرف واختفاء الصورة عند الـ Refresh
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
          try {
            const parsed = JSON.parse(storedUser);
            if (mounted && parsed) {
              setProfile(parsed);
            }
          } catch (e) {
            console.error("Error parsing user from localStorage", e);
          }
        }

        // 3. جلب البيانات الحديثة من السيرفر في الخلفية بنفس أسلوب Profile.jsx
        const res = await axiosInstance.get('/users/profile');

        // التعامل مع الاستجابة المرنة (سواء كانت الكائن مباشرة أو داخل data)
        const p = res?.data || res || {};

        if (mounted && p) {
          // استخراج بيانات المستخدم النهائي
          const userData = p.user || p.data || p;

          setProfile(userData);

          // حفظ النسخة الجديدة في الـ localStorage لتكون جاهزة للتحديث القادم
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Failed to load profile in Navbar:", error);
      }
    };

    // تشغيل الدالة عند تحميل المكون
    loadProfile();

    // الاستماع للحدث عند تعديل البروفايل من صفحة البروفايل
    const onProfileUpdated = () => loadProfile();
    window.addEventListener('profile:updated', onProfileUpdated);

    return () => {
      mounted = false;
      window.removeEventListener('profile:updated', onProfileUpdated);
    };
  }, []);

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
    const img = profile?.profileImage || profile?.avatar || profile?.avatarUrl || profile?.image || profile?.photo || profile?.picture;
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

  const handleApplyFilters = (filterData) => {
    const params = new URLSearchParams(searchParams);

    // Include current search term if it exists
    const currentSearch = searchParams.get('q') || '';
    if (currentSearch.trim()) {
      params.set('search', currentSearch.trim());
    } else {
      params.delete('search');
    }

    // Apply clean filter payload - only include non-null values
    if (filterData.provinceId !== null && filterData.provinceId !== undefined) {
      params.set('provinceId', filterData.provinceId);
    } else {
      params.delete('provinceId');
    }

    if (filterData.condition !== null && filterData.condition !== undefined) {
      params.set('condition', filterData.condition);
    } else {
      params.delete('condition');
    }

    if (filterData.minPrice !== null && filterData.minPrice !== undefined) {
      params.set('minPrice', filterData.minPrice);
    } else {
      params.delete('minPrice');
    }

    if (filterData.maxPrice !== null && filterData.maxPrice !== undefined) {
      params.set('maxPrice', filterData.maxPrice);
    } else {
      params.delete('maxPrice');
    }

    // Navigate to updated URL
    const newUrl = params.toString();
    navigate(`/?${newUrl}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <AppBar position="fixed" sx={{
      top: 0,
      zIndex: 1100,
      backgroundColor: 'rgba(26, 54, 93, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 56 }}>

       
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

         
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ color: '#ffffff' }}
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
                    bgcolor: '#ffffff',
                    color: '#1a365d',
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(26, 54, 93, 0.1)',
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
                          bgcolor: 'rgba(255, 107, 53, 0.1)',
                          color: '#ff6b35'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: '#1a365d' }}>
                        {link.icon}
                      </ListItemIcon>
                      <ListItemText>{link.label}</ListItemText>
                    </MenuItem>
                  ))}

                {!token && [
                  <Divider key="mob-div-1" sx={{ borderColor: 'rgba(26, 54, 93, 0.1)' }} />,
                  <MenuItem
                    key="mob-login"
                    onClick={() => {
                      navigate('/login');
                      handleCloseNavMenu();
                    }}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(49, 130, 206, 0.1)',
                        color: '#3182ce'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#1a365d' }}>
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
                        bgcolor: 'rgba(255, 107, 53, 0.1)',
                        color: '#ff6b35'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#1a365d' }}>
                      <HowToRegIcon />
                    </ListItemIcon>
                    <ListItemText>{t('register')}</ListItemText>
                  </MenuItem>
                ]}

                {token && [
                  <Divider key="mob-div-2" sx={{ borderColor: 'rgba(26, 54, 93, 0.1)' }} />,
                  <MenuItem
                    key="mob-profile"
                    onClick={() => {
                      navigate('/profile');
                      handleCloseNavMenu();
                    }}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(255, 107, 53, 0.1)',
                        color: '#ff6b35'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#1a365d' }}>
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
                        bgcolor: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: '#1a365d' }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>{t('logout')}</ListItemText>
                  </MenuItem>
                ]}
              </Menu>
            </Box>

         
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: '#ffffff',
                textDecoration: 'none',
                display: { xs: 'none', md: 'flex' }
              }}
            >
              {t('site_name')}
            </Typography>
          </Box>

      
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            mx: 3
          }}>

           
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                component={RouterLink} to="/"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#ffffff',
                  '&:hover': { color: '#ff6b35' }
                }}
              >
                {t('home')}
              </Button>

              <Button
                component={RouterLink}
                to="/categories"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#ffffff',
                  '&:hover': { color: '#ff6b35' }
                }}
              >
                {t('categories')}
              </Button>
            </Box>

     
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                bgcolor: '#ffffff',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                px: 1.5,
                width: 350,
                height: 40,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderColor: '#ff6b35'
                }
              }}
            >
              <Tooltip title="تصفية النتائج">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.currentTarget.blur();
                    setIsFilterOpen(true);
                  }}
                  sx={{
                    color: '#3182ce',
                    '&:hover': {
                      bgcolor: 'rgba(49, 130, 206, 0.1)',
                      color: '#2c5282'
                    }
                  }}
                >
                  <TuneIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

              <TextField
                variant="standard"
                placeholder={t('search_placeholder')}
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const trimmedSearch = searchTerm.trim();
                    if (trimmedSearch) {
                      navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
                    } else {
                      navigate('/');
                    }
                  }
                }}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '14px', borderColor: '#ff6b35', color: '#ff6b35' }
                }}
              />

              <InputAdornment position="end" sx={{ ml: 1 }}>
                <SearchIcon fontSize="small" sx={{ color: '#ff6b35' }} />
              </InputAdornment>
            </Box>
          </Box>

          {/* RIGHT SIDE: Cart + Add Product */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

           
            <Tooltip title={t('cart')}>
              <IconButton
                component={RouterLink}
                to="/cart"
                size="small"
                sx={{
                  color: '#ffffff',
                  '&:hover': { color: '#ff6b35' }
                }}
              >
                <StyledBadge badgeContent={cartCount} color="error">
                  <CartIcon size={20} />
                </StyledBadge>
              </IconButton>
            </Tooltip>

         
            <Button
              onClick={handleAddProductNav}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: '#ff6b35',
                borderRadius: 2,
                px: 2,
                py: 1,
                display: { xs: 'none', md: 'flex' },
                '&:hover': {
                  backgroundColor: '#e55a2b',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                }
              }}
            >
              {t('add_product') || 'Add Listing'}
            </Button>

          
            <Tooltip title={t('account_settings') || "Account settings"}>
              <IconButton
                onClick={() => setIsDrawerOpen(true)}
                sx={{ p: 0 }}
              >
                {token && profile ? (
                  <Avatar
                    src={resolveAvatar()}
                    sx={{
                      width: 45,
                      height: 45,
                      bgcolor: 'rgba(255,255,255,0.2)',

                    }}
                  >
                    {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                  </Avatar>
                ) : (
                  <AccountCircleIcon
                    fontSize="medium"
                    sx={{
                      color: '#ffffff',
                      '&:hover': { color: '#ff6b35' }
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>

            
            <Menu
              sx={{ mt: '40px' }}
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
                  bgcolor: '#ffffff',
                  color: '#1a365d',
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid rgba(26, 54, 93, 0.1)',
                },
              }}
            >
              <MenuItem
                onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 107, 53, 0.1)',
                    color: '#ff6b35'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#1a365d' }}>
                  <AccountCircleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('profile')}</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => { handleCloseUserMenu(); navigate('/my-products'); }}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 107, 53, 0.1)',
                    color: '#ff6b35'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#1a365d' }}>
                  <ViewListIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('my_products')}</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => { handleCloseUserMenu(); navigate('/favorites'); }}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 107, 53, 0.1)',
                    color: '#ff6b35'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#1a365d' }}>
                  <FavoriteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('favorites')}</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => { handleCloseUserMenu(); toggleLang(); }}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(49, 130, 206, 0.1)',
                    color: '#3182ce'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#1a365d' }}>
                  <TranslateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('language')}</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon sx={{ color: '#1a365d' }}>
                  <ContrastIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('theme')}</ListItemText>
                <Switch
                  size="small"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff6b35',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 107, 53, 0.3)',
                    },
                  }}
                />
              </MenuItem>

              {token && [
                <Divider key="divider-logout" />,
                <MenuItem
                  key="logout"
                  onClick={() => { handleCloseUserMenu(); handleLogout(); }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#1a365d' }}>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('logout')}</ListItemText>
                </MenuItem>
              ]}

              {!token && [
                <Divider key="divider-login" />,
                <MenuItem
                  key="login"
                  onClick={() => { handleCloseUserMenu(); navigate('/login'); }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(49, 130, 206, 0.1)',
                      color: '#3182ce'
                    }
                  }}
                >
                  <ListItemText>{t('login')}</ListItemText>
                </MenuItem>,
                <MenuItem
                  key="register"
                  onClick={() => { handleCloseUserMenu(); navigate('/register'); }}
                  sx={{
                    '&:hover': {
                      bgcolor: 'rgba(255, 107, 53, 0.1)',
                      color: '#ff6b35'
                    }
                  }}
                >
                  <ListItemText>{t('register')}</ListItemText>
                </MenuItem>
              ]}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
      <ProfileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <FilterDrawer
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </AppBar>
  );
}



