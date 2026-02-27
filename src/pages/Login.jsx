import { useState } from "react";
import { Container, TextField, Button, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import LoginIcon from '@mui/icons-material/Login';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom'; // ✅ إضافة useNavigate
import axios from 'axios'; // ✅ إضافة axios
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { t } from "../i18n";
import PasswordIcon from '@mui/icons-material/PasswordOutlined';
import Divider from "@mui/material/Divider";
import { useSignIn } from "@clerk/clerk-react";
import axiosInstance from "../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate(); // ✅ تعريف التنقل
  const { signIn, isLoaded } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialLogin = async (strategy) => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      console.error("OAuth Error:", err);
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("fill_all_fields") || "Please fill all fields");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      });

      // --- حالة النجاح (الحساب مفعل) ---
      console.log("✅ Login Successful:", res.data);

      const userData = res.data.user || res.data.data?.user || res.data;
      const token = res.data.token || res.data.accessToken;

      localStorage.setItem("token", token);
      const finalUserId = userData.id || userData._id || userData.userId
      localStorage.setItem("userId", finalUserId);
      localStorage.setItem("userType", userData?.type || "buyer");
      localStorage.setItem("userName", userData?.name);
      localStorage.setItem("user", JSON.stringify(userData))
      window.dispatchEvent(new Event("storage"));
      navigate("/");

    } catch (err) {
      // --- حالة الفشل (Catch Block) ---
      console.log("❌ Login Failed. Error Details below:");

      // طباعة تفاصيل الخطأ القادم من السيرفر لمعرفة ماذا يصلنا بالضبط
      if (err.response) {
        console.log("🔹 Status Code:", err.response.status);
        console.log("🔹 Server Data:", err.response.data);
        console.log("🔹 Server Message:", err.response.data.message);
      }

      // استخراج الرسالة بدقة
      const serverMsg = err.response?.data?.message;

      // 🛑 الشرط: فحص دقيق للرسالة كما رأيناها في الباك اند
      if (serverMsg === 'PENDING_VERIFICATION') {

        console.log("⚠️ Account needs verification. Redirecting to /verify-code now...");

        localStorage.setItem('pendingEmail', email); // حفظ الإيميل
        navigate('/verify-code'); // توجيه لصفحة الكود
        return; // إنهاء الدالة هنا
      }

      // محاولة أخرى: ربما الرسالة بأحرف صغيرة؟
      if (serverMsg && serverMsg.toString().toLowerCase().includes('pending_verification')) {
        console.log("⚠️ Account needs verification (lowercase match). Redirecting...");
        localStorage.setItem('pendingEmail', email);
        navigate('/verify-code');
        return;
      }

      // إذا لم يكن خطأ تفعيل، نعرض رسالة الخطأ العادية
      const displayMsg = err.response?.data?.message || err.message || "Login failed";
      setError(t("login_failed") || displayMsg);
    }
  };




  return (
    <Container maxWidth="xs" sx={{ mt: 12, boxShadow: 20, border: 1, borderRadius: 8, p: 2 }}>
      <Typography variant="h5" sx={{ mb: 6, fontWeight: 700, mt: 5 }}>
        {t('login_title')}
        <LoginIcon sx={{ ml: 1 }} />
      </Typography>

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          id="email"
          type="email"
          required
          fullWidth
          placeholder={t('login_email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2, border: 1, borderRadius: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          fullWidth
          variant="outlined"
          placeholder={t('login_password')}
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3, border: 1, borderRadius: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon sx={{ opacity: 0.6 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start" sx={{ mr: 0.5 }} >
                <IconButton onClick={() => setShowPassword((v) => !v)} edge="end"
                  aria-label="toggle password visibility"
                  sx={{ transform: "translateY(-1px)" }}
                >
                  {showPassword ? <VisibilityOff sx={{ opacity: 0.6 }} /> : <Visibility sx={{ opacity: 0.6 }} />}
                </IconButton >
              </InputAdornment>
            ),
          }}
          error={password.length > 0 && password.length < 6} // عدلتها لـ 6 لأنه المنطق الشائع
        />

        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Typography sx={{ textAlign: 'left' }}>
          {t('new_reg4')}
          <Link
            component={RouterLink}
            to="/forgot-password"
            variant="body2"
            sx={{ fontWeight: 'bold' }}
          >
            {t('new_reg3')}
          </Link>
        </Typography>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.1,
            fontWeight: 900,
            borderRadius: 7,
            mt: 2
          }}
        >
          {t('login_submit')}
        </Button>

        <Divider sx={{ my: 4, fontSize: 16 }}>OR</Divider>

        <Button
          type="button"
          sx={{ mt: 1 }}
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('oauth_google')}
          startIcon={<GoogleIcon />}
        >
          {t('sign_in_with_google')}
        </Button>
        <Button
          type="button"
          sx={{ mt: 1 }}
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('oauth_facebook')}
          startIcon={<FacebookIcon />}
        >
          {t('sign_in_with_facebook')}
        </Button>

        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          {t('new_reg')}
          <Link
            component={RouterLink}
            to="/register"
            variant="body2"
            sx={{ fontWeight: 'bold' }}
          >
            {t('new_reg1')}
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
