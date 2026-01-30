// import { useState } from "react";

// import { Container, TextField, Button, Typography, Box, InputAdornment, IconButton } from "@mui/material";

// import Visibility from "@mui/icons-material/Visibility";
// import LoginIcon from '@mui/icons-material/Login';
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import { Link, Link as RouterLink } from 'react-router-dom';
// import { loginUser } from "../api/authAPI";
// import GoogleIcon from "@mui/icons-material/Google";
// import FacebookIcon from "@mui/icons-material/Facebook";
// import MailOutlineIcon from '@mui/icons-material/MailOutline';
// import { t } from "../i18n";
// import PasswordIcon from '@mui/icons-material/PasswordOutlined';
// import Divider from "@mui/material/Divider";
// import { useSignIn } from "@clerk/clerk-react";

// export default function Login() {

//   const { signIn, isLoaded } = useSignIn();

//   const [email, setEmail] = useState("");

//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const handleSocialLogin = async (strategy) => {
//     if (!isLoaded) return;
//     try {
//       await signIn.authenticateWithRedirect({
//         strategy: strategy, // 'oauth_google' or 'oauth_facebook'
//         redirectUrl: "/sso-callback", // صفحة وسيطة (سأشرحها في الخطوة التالية)
//         redirectUrlComplete: "/",     // الصفحة التي يذهب لها بعد النجاح
//       });
//     } catch (err) {
//       console.error("OAuth Error:", err);
//     }
//   }




//   const handleLogin = async (e) => {

//     // window.location.href = "http://localhost:3000/auth/google";
//     e.preventDefault();

//     try {

//       const res = await axios.post('http://localhost:3000/api/v1/auth/login', {
//       email: formData.email,
//       password: formData.password
//     });
//     const token = res.data.token;


//       localStorage.setItem("token", token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       navigate("/home");



//       if (!localStorage.getItem('userType')) {

//         try { localStorage.setItem('userType', 'buyer'); } catch { }

//       }
//       if (!email || !/\S+@\S+\.\S+/.test(email)) {
//         setEmailError(true);
//         setEmailErrorMessage('Please enter a valid email address.'); // رسالة الخطأ
//         isValid = false;
//       }

//       window.location.href = "/";

//     } catch (err) {
//       const errorMsg = err.response?.data?.message;


//     if (errorMsg === 'PENDING_VERIFICATION') {


//       navigate('/verify-otp', { state: { email: formData.email } });
//        }else{
//         setError(t('error_loading_product'));
//        }



//     }

//   };



//   return (

//     <Container maxWidth="xs" sx={{ mt: 3, boxShadow: 20, border: 1, borderRadius: 8, p: 2 }}>

//       <Typography variant="h5" sx={{ mb: 6, fontWeight: 700, mt: 5 }}>

//         {t('login_title')}
//         <LoginIcon sx={{ ml: 1 }} />

//       </Typography>

//       <Box component="form" onSubmit={handleLogin}>

//         <TextField

//           id="email"
//           type="email"
//           required

//           fullWidth
//           placeholder={t('login_email')}

//           value={email}

//           onChange={(e) => setEmail(e.target.value)}

//           sx={{ mb: 2, border: 1, borderRadius: 4 }}

//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <MailOutlineIcon />
//               </InputAdornment>
//             ),
//           }}


//         />


//         <TextField
//           required
//           fullWidth
//           variant="outlined"
//           placeholder={t('login_password')}

//           type={showPassword ? 'text' : 'password'}

//           value={password}

//           onChange={(e) => setPassword(e.target.value)}

//           sx={{ mb: 3, border: 1, borderRadius: 4 }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <PasswordIcon sx={{ opacity: 0.6 }} />
//               </InputAdornment>
//             ),

//             endAdornment: (

//               <InputAdornment position="start" sx={{ mr: 0.5 }} >


//                 <IconButton onClick={() => setShowPassword((v) => !v)} edge="end"
//                   aria-label="toggle password visibility"
//                   sx={{ transform: "translateY(-1px)" }}
//                 >

//                   {showPassword ? <VisibilityOff sx={{ opacity: 0.6 }} /> : <Visibility sx={{ opacity: 0.6 }} />}

//                 </IconButton >


//               </InputAdornment>


//             ),

//           }}
//           error={password.length > 0 && password.length < 10}
//           helperText={password.length > 0 && password.length < 10 ? "At least 10 characters" : ""}

//         />

//         {error && <Typography color="error">{error}</Typography>}

//         <Typography sx={{ textAlign: 'left' }}>
//           {t('new_reg4')}
//           <Link

//             component={RouterLink}
//             to="/forgot-password"
//             variant="body2"
//             sx={{ fontWeight: 'bold' }}
//           >
//             {t('new_reg3')}
//           </Link>
//         </Typography>

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           sx={{
//             py: 1.1,
//             fontWeight: 900,
//             borderRadius: 7,
//           }}
//         >

//           {t('login_submit')}

//         </Button>

//         <Divider sx={{ my: 6, fontSize: 16 }}>OR</Divider>

//         <Button
//           type="button"
//           color=""
//           sx={{ mt: 1 }}
//           fullWidth
//           variant="outlined"
//           onClick={() => handleSocialLogin('oauth_google')}
//           startIcon={<GoogleIcon />}

//         >

//           {t('sign_in_with_google')}

//           {/* <GoogleIcon sx={{ ml: 4 }} /> */}
//         </Button>
//         <Button
//           type="button"
//           color=""
//           sx={{ mt: 1 }}
//           fullWidth
//           variant="outlined"
//           onClick={() => handleSocialLogin('oauth_facebook')}
//           startIcon={<FacebookIcon />}

//         >

//           {t('sign_in_with_facebook')}

//           {/* <FacebookIcon sx={{ ml: 2 }} /> */}
//         </Button>

//         <Typography sx={{ textAlign: 'center', mt: 2 }}>
//           {t('new_reg')}
//           <Link

//             component={RouterLink}
//             to="/register"
//             variant="body2"
//             sx={{ fontWeight: 'bold' }}
//           >
//             {t('new_reg1')}
//           </Link>
//         </Typography>





//       </Box>



//     </Container>

//   );

// }



//===========================================================================

// import * as React from 'react';

// import Box from '@mui/material/Box';

// import Button from '@mui/material/Button';

// import Checkbox from '@mui/material/Checkbox';

// import CssBaseline from '@mui/material/CssBaseline';

// import FormControlLabel from '@mui/material/FormControlLabel';

// import Divider from '@mui/material/Divider';

// import FormLabel from '@mui/material/FormLabel';

// import FormControl from '@mui/material/FormControl';

// import Link from '@mui/material/Link';

// import TextField from '@mui/material/TextField';

// import Typography from '@mui/material/Typography';

// import Stack from '@mui/material/Stack';

// import MuiCard from '@mui/material/Card';

// import { styled } from '@mui/material/styles';

// import ForgotPassword from './components/ForgotPassword';

// import AppTheme from '../shared-theme/AppTheme';

// import ColorModeSelect from '../shared-theme/ColorModeSelect';

// import { GoogleIcon, FacebookIcon, SitemarkIcon } from './components/CustomIcons';



// const Card = styled(MuiCard)(({ theme }) => ({

//   display: 'flex',

//   flexDirection: 'column',

//   alignSelf: 'center',

//   width: '100%',

//   padding: theme.spacing(4),

//   gap: theme.spacing(2),

//   margin: 'auto',

//   [theme.breakpoints.up('sm')]: {

//     maxWidth: '450px',

//   },

//   boxShadow:

//     'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',

//   ...theme.applyStyles('dark', {

//     boxShadow:

//       'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',

//   }),

// }));



// const SignInContainer = styled(Stack)(({ theme }) => ({

//   height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',

//   minHeight: '100%',

//   padding: theme.spacing(2),

//   [theme.breakpoints.up('sm')]: {

//     padding: theme.spacing(4),

//   },

//   '&::before': {

//     content: '""',

//     display: 'block',

//     position: 'absolute',

//     zIndex: -1,

//     inset: 0,

//     backgroundImage:

//       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',

//     backgroundRepeat: 'no-repeat',

//     ...theme.applyStyles('dark', {

//       backgroundImage:

//         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',

//     }),

//   },

// }));



// export default function SignIn(props) {

//   const [emailError, setEmailError] = React.useState(false);

//   const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

//   const [passwordError, setPasswordError] = React.useState(false);

//   const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

//   const [open, setOpen] = React.useState(false);



//   const handleClickOpen = () => {

//     setOpen(true);

//   };



//   const handleClose = () => {

//     setOpen(false);

//   };



//   const handleSubmit = (event) => {

//     if (emailError || passwordError) {

//       event.preventDefault();

//       return;

//     }

//     const data = new FormData(event.currentTarget);

//     console.log({

//       email: data.get('email'),

//       password: data.get('password'),

//     });

//   };



//   const validateInputs = () => {

//     const email = document.getElementById('email');

//     const password = document.getElementById('password');



//     let isValid = true;



//     if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {

//       setEmailError(true);

//       setEmailErrorMessage('Please enter a valid email address.');

//       isValid = false;

//     } else {

//       setEmailError(false);

//       setEmailErrorMessage('');

//     }



//     if (!password.value || password.value.length < 6) {

//       setPasswordError(true);

//       setPasswordErrorMessage('Password must be at least 6 characters long.');

//       isValid = false;

//     } else {

//       setPasswordError(false);

//       setPasswordErrorMessage('');

//     }



//     return isValid;

//   };



//   return (

//     <AppTheme {...props}>

//       <CssBaseline enableColorScheme />

//       <SignInContainer direction="column" justifyContent="space-between">

//         <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />

//         <Card variant="outlined">

//           <SitemarkIcon />

//           <Typography

//             component="h1"

//             variant="h4"

//             sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}

//           >

//             Sign in

//           </Typography>

//           <Box

//             component="form"

//             onSubmit={handleSubmit}

//             noValidate

//             sx={{

//               display: 'flex',

//               flexDirection: 'column',

//               width: '100%',

//               gap: 2,

//             }}

//           >

//             <FormControl>

//               <FormLabel htmlFor="email">Email</FormLabel>

//               <TextField

//                 error={emailError}

//                 helperText={emailErrorMessage}

//                 id="email"

//                 type="email"

//                 name="email"

//                 placeholder="your@email.com"

//                 autoComplete="email"

//                 autoFocus

//                 required

//                 fullWidth

//                 variant="outlined"

//                 color={emailError ? 'error' : 'primary'}

//               />

//             </FormControl>

//             <FormControl>

//               <FormLabel htmlFor="password">Password</FormLabel>

//               <TextField

//                 error={passwordError}

//                 helperText={passwordErrorMessage}

//                 name="password"

//                 placeholder="••••••"

//                 type="password"

//                 id="password"

//                 autoComplete="current-password"

//                 autoFocus

//                 required

//                 fullWidth

//                 variant="outlined"

//                 color={passwordError ? 'error' : 'primary'}

//               />

//             </FormControl>

//             <FormControlLabel

//               control={<Checkbox value="remember" color="primary" />}

//               label="Remember me"

//             />

//             <ForgotPassword open={open} handleClose={handleClose} />

//             <Button

//               type="submit"

//               fullWidth

//               variant="contained"

//               onClick={validateInputs}

//             >

//               Sign in

//             </Button>

//             <Link

//               component="button"

//               type="button"

//               onClick={handleClickOpen}

//               variant="body2"

//               sx={{ alignSelf: 'center' }}

//             >

//               Forgot your password?

//             </Link>

//           </Box>

//           <Divider>or</Divider>

//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

//             <Button

//               fullWidth

//               variant="outlined"

//               onClick={() => alert('Sign in with Google')}

//               startIcon={<GoogleIcon />}

//             >

//               Sign in with Google

//             </Button>

//             <Button

//               fullWidth

//               variant="outlined"

//               onClick={() => alert('Sign in with Facebook')}

//               startIcon={<FacebookIcon />}

//             >

//               Sign in with Facebook

//             </Button>

//             <Typography sx={{ textAlign: 'center' }}>

//               Don&apos;t have an account?{' '}

//               <Link

//                 href="/material-ui/getting-started/templates/sign-in/"

//                 variant="body2"

//                 sx={{ alignSelf: 'center' }}

//               >

//                 Sign up

//               </Link>

//             </Typography>

//           </Box>

//         </Card>

//       </SignInContainer>

//     </AppTheme>

//   );

// }



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

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError(""); // تصفير الخطأ القديم

  //   try {
  //     // ✅ تصحيح: استخدام المتغيرات email و password مباشرة بدلاً من formData
  //     const res = await axios.post('http://localhost:3000/api/v1/auth/login', {
  //       email: email,
  //       password: password
  //     });

  //     console.log("Login Response:", res.data);

  //     const user = res.data.user || res.data.data?.user; // محاولة التقاط بيانات المستخدم
  //     const isVerified = user?.isVerified;

      


  //     if (user && isVerified === false) {
  //       // 🛑 الحالة الأولى: الحساب غير مفعل
  //       // نحفظ الإيميل مؤقتاً لنستخدمه في صفحة الكود
  //       localStorage.setItem('pendingEmail', email);

  //       // توجيه لصفحة التحقق
  //       navigate('/verify-code');

  //     } else {
  //       // ✅ الحالة الثانية: الحساب مفعل وجاهز (أو الباك اند لا يرسل حالة التفعيل)

  //       // حفظ التوكن والبيانات
  //       localStorage.setItem('token', res.data.token);
  //       localStorage.setItem('userId', user?.id || user?._id);
  //       localStorage.setItem('userType', user?.type || 'buyer');
  //       localStorage.setItem('userName', user?.name);

  //       // توجيه للصفحة الرئيسية
  //       window.dispatchEvent(new Event("storage")); // تحديث الهيدر
  //       navigate('/');
  //     }

  //     const token = res.data.token;

  //     // 1. حفظ التوكن
  //     localStorage.setItem("token", token);

  //     // 2. تحديث الهيدر فوراً
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  //     // 3. حفظ نوع المستخدم (اختياري حسب منطقك)
  //     if (!localStorage.getItem('userType')) {
  //       localStorage.setItem('userType', 'buyer');
  //     }

  //     // 4. ✅ الانتقال للصفحة الرئيسية بدون إعادة تحميل (SPA)
  //     navigate("/home");

  //   } catch (err) {
  //     console.error(err);
  //     const errorMsg = err.response?.data?.message;

  //     if (errorMsg === 'PENDING_VERIFICATION') {
  //       // ✅ نمرر الإيميل لصفحة التفعيل
  //       navigate('/verify-otp', { state: { email: email } });
  //     } else {
  //       setError(errorMsg || t('error_loading_product') || "Login failed");
  //     }
  //   }
  // };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   // 1. التحقق من الحقول
  //   if (!email || !password) {
  //     setError(t("fill_all_fields") || "Please fill all fields");
  //     return;
  //   }

  //   try {
  //     // 2. إرسال الطلب للسيرفر
  //     const res = await axiosInstance.post("/auth/login", {
  //       email: email,
  //       password: password,
  //     });

  //     // 🛑 هذا السطر هو الذي كان ينقصك أو في مكان خطأ
  //     // هنا نستخرج بيانات اليوزر من الرد القادم من السيرفر
  //     const userData = res.data.user; 
  //     const token = res.data.token;

  //     console.log("User Data:", userData); // للتأكد أن البيانات وصلت

  //     // 3. فحص هل المستخدم مفعل؟
  //     // (نتأكد من وجود userData أولاً لتجنب الأخطاء)
  //     const isVerified = userData && (userData.isVerified === true || userData.is_verified === true || userData.isVerified === 1);

  //     if (!isVerified) {
  //       // --- حالة الحساب غير مفعل ---
  //       console.log("Account needs verification.");
  //       localStorage.setItem('pendingEmail', email); // نحفظ الإيميل
  //       navigate('/verify-code'); // نرسله لصفحة الكود
  //     } else {
  //       // --- حالة الحساب مفعل وجاهز ---
  //       console.log("Login Successful.");
        
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("userId", userData.id || userData._id);
  //       localStorage.setItem("userType", userData.type || userData.role || "buyer");
  //       localStorage.setItem("userName", userData.name);

  //       if (userData.language) {
  //         localStorage.setItem("lang", userData.language);
  //       }

  //       window.dispatchEvent(new Event("storage")); // تحديث الهيدر
  //       navigate("/"); // الذهاب للرئيسية
  //     }

  //   } catch (err) {
  //     console.error("Login Error:", err);
  //     // التعامل مع الخطأ
  //     const msg = err.response?.data?.message || err.message;
  //     setError(t("login_failed") || msg);
  //   }
  // };


  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   // 1. التحقق من الحقول
  //   if (!email || !password) {
  //     setError(t("fill_all_fields") || "Please fill all fields");
  //     return;
  //   }

  //   try {
  //     // 2. محاولة تسجيل الدخول
  //     // تأكد أنك تستخدم axiosInstance أو axios حسب استيرادك في الأعلى
  //     // هنا سأستخدم axiosInstance كما في Home.jsx، إذا لم يعمل غيره لـ axios
  //     const res = await axiosInstance.post("/auth/login", {
  //       email: email,
  //       password: password,
  //     });

  //     // --- إذا وصلنا هنا، يعني أن الحساب مفعل والدخول نجح ---
  //     console.log("Login Successful:", res.data);
      
  //     const userData = res.data.user || res.data.data?.user;
  //     const token = res.data.token;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("userId", userData?.id || userData?._id);
  //     localStorage.setItem("userType", userData?.type || "buyer");
  //     localStorage.setItem("userName", userData?.name);

  //     window.dispatchEvent(new Event("storage"));
  //     navigate("/");

  //   } catch (err) {
  //     console.error("Login Error Catch:", err);
      
  //     // --- 🛑 المنطقة السحرية: التعامل مع الحساب غير المفعل ---
      
  //     // 1. الحصول على رسالة الخطأ وكود الحالة
  //     const status = err.response?.status;
  //     const errorMsg = (err.response?.data?.message || err.message || "").toLowerCase();
      
  //     console.log(`Error Status: ${status}, Message: ${errorMsg}`);

  //     // 2. المنطق الجديد:
  //     // إذا كان الخطأ 401 (غير مصرح) 
  //     // أو 400 (طلب خاطئ)
  //     // والرسالة تحتوي على كلمة تدل على التفعيل (verify, active, code)
  //     if (
  //       (status === 401 || status === 400) && 
  //       (errorMsg.includes("verify") || errorMsg.includes("activ") || errorMsg.includes("code"))
  //     ) {
  //       console.log("Account unverified detected inside catch block! Redirecting...");
  //       localStorage.setItem('pendingEmail', email); // حفظ الإيميل
  //       navigate('/verify-code'); // 🚀 توجيه إجباري لصفحة الكود
  //       return;
  //     }

  //     // إذا كان خطأ آخر (مثل كلمة مرور خطأ فعلاً)
  //     setError(t("login_failed") || errorMsg);
  //   }
  // };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!email || !password) {
  //     setError(t("fill_all_fields") || "Please fill all fields");
  //     return;
  //   }

  //   try {
  //     const res = await axiosInstance.post("/auth/login", {
  //       email: email,
  //       password: password,
  //     });

  //     console.log("Login Successful:", res.data);
      
  //     const userData = res.data.user || res.data.data?.user;
  //     const token = res.data.token;

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("userId", userData?.id || userData?._id);
  //     localStorage.setItem("userType", userData?.type || "buyer");
  //     localStorage.setItem("userName", userData?.name);

  //     window.dispatchEvent(new Event("storage"));
  //     navigate("/");

  //   } catch (err) {
  //     console.error("Login Error Catch:", err);
      
  //     // 1. استخراج الرسالة
  //     // (نحولها لنص .toString() لتجنب المشاكل اذا كانت مصفوفة)
  //     const rawMessage = err.response?.data?.message || err.message || "";
      
  //     // 2. توحيد الأحرف إلى صغيرة (lowercase) للمقارنة السهلة
  //     const errorMsg = rawMessage.toString().toLowerCase();

  //     console.log("Processed Error Message:", errorMsg); // للتأكد

  //     // 3. الشرط المعدل: نفحص هل الرسالة تحتوي على pending_verification
  //     if (errorMsg.includes('pending_verification')) {
        
  //       console.log("Account needs verification! Redirecting to OTP page...");
        
  //       // حفظ الإيميل
  //       localStorage.setItem('pendingEmail', email);
        
  //       // التوجيه
  //       navigate('/verify-code');
  //       return;
  //     }

  //     setError(t("login_failed") || rawMessage);
  //   }
  // };



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
      
      const userData = res.data.user || res.data.data?.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData?.id || userData?._id);
      localStorage.setItem("userType", userData?.type || "buyer");
      localStorage.setItem("userName", userData?.name);

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
    <Container maxWidth="xs" sx={{ mt: 3, boxShadow: 20, border: 1, borderRadius: 8, p: 2 }}>
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
