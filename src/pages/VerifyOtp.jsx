// import React, { useState } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

// const VerifyOtp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // نأخذ الإيميل تلقائياً إذا جاء من صفحة التسجيل
//   const [email, setEmail] = useState(location.state?.email || '');
//   const [code, setCode] = useState('');
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:3000/api/v1/auth/verify-email', { email, code });
//       localStorage.setItem('token', res.data.token);
//       setMessage('تم تفعيل الحساب بنجاح! جاري التوجيه لتسجيل الدخول...');
//       setTimeout(() => navigate('/home'), 2000);

//     } catch (err) {
//         if(err.response?.status === 401 && err.response?.data?.message === 'Please verify your email'){
//           navigate('/verify-otp', { state: { email: credentials.email } });
//         } else{
//             setError(err.response?.data?.message || 'الكود غير صحيح');
//         }

//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box sx={{ mt: 8, textAlign: 'center' }}>
//         <Typography variant="h5">تفعيل الحساب</Typography>
//         <Typography variant="body2" sx={{ mb: 3 }}>
//            أدخل الرمز المرسل إلى {email}
//         </Typography>

//         {error && <Alert severity="error">{error}</Alert>}
//         {message && <Alert severity="success">{message}</Alert>}

//         <form onSubmit={handleSubmit}>
//           {/* إذا لم يكن الإيميل موجوداً، اطلب إدخاله */}
//           {!location.state?.email && (
//              <TextField fullWidth label="البريد الإلكتروني" value={email} onChange={(e)=>setEmail(e.target.value)} margin="normal" />
//           )}

//           <TextField 
//             fullWidth 
//             label="رمز التحقق (OTP)" 
//             value={code} 
//             onChange={(e)=>setCode(e.target.value)} 
//             margin="normal" 
//             required 
//           />
//           <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>تفعيل</Button>
//         </form>
//       </Box>
//     </Container>
//   );
// };

// export default VerifyOtp;
//================================================================================================================
// import React, { useState, useEffect } from 'react';
// import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import axiosInstance from "../api/axiosInstance";
// const VerifyOtp = () => {
//     const location = useLocation();
//     const navigate = useNavigate();

//     // استلام الإيميل من الصفحة السابقة (Register أو Login)
//     const [email, setEmail] = useState(location.state?.email || '');
//     const [code, setCode] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [timer, setTimer] = useState(60); // عداد 60 ثانية لإعادة الإرسال
//     // أضف هذا السطر بجانب تعريفات otp و timer
//     const [canResend, setCanResend] = useState(false);
//     // تشغيل العداد التنازلي
//     useEffect(() => {
//         let interval;
//         if (timer > 0) {
//             interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//         } else {
//             setCanResend(true);
//         }
//         return () => clearInterval(interval);
//     }, [timer]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const res = await axios.post('http://localhost:3000/api/v1/auth/verify-email', {
//                 email,
//                 code
//             });
//             const verificationCode = otp.join("");
//             const storedEmail = localStorage.getItem('pendingEmail');
//             if (!storedEmail) {
//                 setError("لا يوجد بريد إلكتروني، يرجى إعادة تسجيل الدخول.");
//                 return;
//             }

//             if (verificationCode.length < 6) {
//                 setError("يرجى إدخال الرمز كاملاً.");
//                 return;
//             }


//             // ✅ حفظ التوكن ليدخل المستخدم مباشرة
//             if (res.data.token) {
//                 localStorage.setItem('token', res.data.token);
//             }

//             // ✅ التوجه للرئيسية
//             navigate('/home');

//         } catch (err) {
//             setError(err.response?.data?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
//         } finally {
//             setLoading(false);
//         }
//     };

//     //   const handleResend = async () => {
//     //     try {
//     //       setTimer(60); // إعادة ضبط العداد
//     //       await axios.post('http://localhost:3000/api/v1/auth/forgot-password', { email });
//     //       // ملاحظة: نستخدم forgot-password هنا لأنها تولد كود جديد وترسله
//     //       alert('تم إرسال رمز جديد إلى بريدك الإلكتروني');
//     //     } catch (err) {
//     //       setError('فشل في إعادة إرسال الرمز');
//     //     }
//     //   };

//     const handleResend = async () => {
//         try {
//             // 1. جلب الإيميل من الذاكرة (لأن المتغير email قد لا يكون معرفاً داخل الدالة)
//             const storedEmail = localStorage.getItem('pendingEmail');

//             if (!storedEmail) {
//                 setError("Email not found. Please login again.");
//                 return;
//             }

//             // 2. الاتصال بالمسار الجديد الذي أنشأناه (resend-code)
//             // لاحظ: نستخدم axiosInstance ليأخذ الرابط الأساسي (baseURL) تلقائياً
//             await axiosInstance.post('http://localhost:3000/api/v1/auth/resend-code', {
//                 email: storedEmail
//             });

//             // 3. نجاح
//             alert('تم إرسال رمز جديد إلى بريدك الإلكتروني');
//             setTimer(60); // إعادة ضبط العداد
//             setCanResend(false); // إخفاء الزر مؤقتاً

//         } catch (err) {
//             console.error("Resend Error:", err);
//             // عرض رسالة الخطأ القادمة من الباك اند
//             setError(err.response?.data?.message || 'فشل في إعادة إرسال الرمز');
//         }
//     };

//     return (
//         <Container maxWidth="sm">
//             <Paper elevation={6} sx={{ mt: 10, p: 4, borderRadius: 3, textAlign: 'center' }}>
//                 <Typography variant="h4" fontWeight="700" color="primary" gutterBottom>
//                     تحقق من الإيميل 📧
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
//                     أدخل الرمز المكون من 6 أرقام المرسل إلى: <br />
//                     <strong>{email}</strong>
//                 </Typography>

//                 {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//                 <form onSubmit={handleSubmit}>
//                     <TextField
//                         fullWidth
//                         label="رمز التحقق (OTP)"
//                         variant="outlined"
//                         value={code}
//                         onChange={(e) => setCode(e.target.value)}
//                         inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' } }}
//                         required
//                         sx={{ mb: 3 }}
//                     />

//                     <Button
//                         fullWidth
//                         variant="contained"
//                         size="large"
//                         type="submit"
//                         disabled={loading || code.length < 4}
//                         sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
//                     >
//                         {loading ? 'جاري التحقق...' : 'تفعيل الحساب والدخول'}
//                     </Button>
//                 </form>

//                 <Box sx={{ mt: 3 }}>
//                     <Typography variant="body2" sx={{ mb: 1 }}>
//                         لم يصلك الرمز؟
//                     </Typography>
//                     <Button
//                         disabled={!canResend}
//                         onClick={handleResend}
//                         variant="text"
//                         style={{ opacity: canResend ? 1 : 0.5 }}
//                     >
//                         {canResend ? 'إعادة إرسال الرمز الآن' : `إعادة الإرسال بعد ${timer} ثانية`}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default VerifyOtp;



//====================================================================-----------------------------------------------------------------


import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from "../api/axiosInstance"; // تأكد من المسار

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // استلام الإيميل
    const [email, setEmail] = useState(location.state?.email || '');
    // نستخدم متغير نصي واحد لأنك تستخدم TextField واحد
    const [code, setCode] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // تشغيل العداد التنازلي
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const storedEmail = localStorage.getItem('pendingEmail');

        if (!storedEmail) {
            setError("لا يوجد بريد إلكتروني، يرجى إعادة تسجيل الدخول.");
            setLoading(false);
            return;
        }

        // استخدام code مباشرة بدلاً من otp.join
        if (code.length < 6) {
            setError("يرجى إدخال الرمز كاملاً.");
            setLoading(false);
            return;
        }

        try {
            // الإرسال باستخدام axiosInstance والمسار الصحيح
            const res = await axiosInstance.post('/auth/verify-email', {
                email: storedEmail,
                code: code // إرسال الكود كما هو
            });

            // ✅ حفظ التوكن
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

            }

            localStorage.removeItem('pendingEmail');

            // ✅ التوجه للرئيسية
            alert("تم التفعيل بنجاح!");
            window.location.href = '/home'

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            // استخدم الإيميل من location.state أولاً، ثم من localStorage
            const emailToUse = location.state?.email || localStorage.getItem('pendingEmail');

            if (!emailToUse) {
                setError("Email not found. Please login again.");
                return;
            }

            console.log('Resending code to email:', emailToUse);

            await axiosInstance.post('/auth/resend-code', {
                email: emailToUse
            });

            alert('تم إرسال رمز جديد إلى بريدك الإلكتروني');
            setTimer(60);
            setCanResend(false);

        } catch (err) {
            console.error("Resend Error:", err);
            setError(err.response?.data?.message || 'فشل في إعادة إرسال الرمز');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ mt: 10, p: 4, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="700" color="primary" gutterBottom>
                    تحقق من الإيميل 📧
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    أدخل الرمز المكون من 6 أرقام المرسل إلى: <br />
                    <strong>{email || localStorage.getItem('pendingEmail')}</strong>
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="رمز التحقق (OTP)"
                        variant="outlined"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        // منع إدخال أكثر من 6 أرقام
                        inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' } }}
                        required
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        type="submit"
                        disabled={loading || code.length < 6}
                        sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        {loading ? 'جاري التحقق...' : 'تفعيل الحساب والدخول'}
                    </Button>
                </form>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        لم يصلك الرمز؟
                    </Typography>
                    <Button
                        disabled={!canResend}
                        onClick={handleResend}
                        variant="text"
                        style={{ opacity: canResend ? 1 : 0.5 }}
                    >
                        {canResend ? 'إعادة إرسال الرمز الآن' : `إعادة الإرسال بعد ${timer} ثانية`}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VerifyOtp;