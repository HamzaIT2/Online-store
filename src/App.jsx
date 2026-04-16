import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { useTheme } from "./context/ThemeContext";
import { getLang } from "./i18n";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import MyProducts from "./pages/MyProducts";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import AddProduct from "./pages/AddProduct";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import MyPurchases from "./pages/MyPurchases";
// import Chats from "./pages/Chats";
import PaymentSuccess from "./pages/PaymentSuccess";
// لاحقاً نضيف باقي الصفحات هنا (Register, Home, MyProducts ...)
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import VerifyOTP from "./pages/VerifyOTP";
import ParticlesBackground from "./components/ParticlesBackground";
import HeroSlider from "./components/HeroSlider";
import Footer from "./components/Footer";
import Offers from "./pages/Offers";
import EditProduct from "./pages/EditProduct";
import ScrollToTop from "./components/ScrollToTop";
import ChatLayout from "./components/chat/ChatLayout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
export default function App() {
  const { darkMode } = useTheme();
  const lang = getLang();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#0f2b66", contrastText: "#ffffff" },
      secondary: { main: "#0b1d39", contrastText: "#ffffff" },
      background: {
        default: darkMode ? "#0a1424" : "#eef3ff",
        paper: darkMode ? "#0f1a30" : "#ffffff",
      },
      text: { primary: darkMode ? "#e6efff" : "#0d1933" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            direction: (lang === 'ar' || lang === 'ku') ? "rtl" : "ltr",
            fontFamily: "Cairo, sans-serif",
            // backgroundImage: darkMode
            //   ? "linear-gradient(180deg, #0a1424 0%, #0b1320 100%)"
            //   : "linear-gradient(180deg, #eef3ff 0%, #e3ebff 100%)",
            // backgroundAttachment: 'fixed',
            backgroundColor: 'transparent'
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, textTransform: 'none', fontWeight: 600, letterSpacing: 0.2 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 14, boxShadow: '0 8px 24px rgba(11,29,57,0.18)' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { minWidth: 200 },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <ParticlesBackground />
      <CssBaseline />

      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MuiThemeProvider>
  );

  function AppContent() {
    const location = useLocation();

    // صفحات المصادقة التي لا نريد أن يظهر فيها الفوتر
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-code'];
    const isAuthPage = authPages.includes(location.pathname);

    return (
      <>
        <ScrollToTop />
        {!isAuthPage && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-code" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route
            path="/sso-callback"
            element={<AuthenticateWithRedirectCallback />}
          />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/categories/:id" element={<ProtectedRoute><CategoryDetails /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/my-purchases" element={<ProtectedRoute><MyPurchases /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatLayout /></ProtectedRoute>} />
          {/* <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} /> */}
          <Route path="/payment/zain-cash/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />

          {/* توجيه أي مسار غير معروف إلى الرئيسية */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isAuthPage && <Footer />}
      </>
    );
  }
}
