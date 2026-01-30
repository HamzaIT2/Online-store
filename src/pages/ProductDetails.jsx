// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Box, Container, Typography, CircularProgress, Card, CardMedia, CardContent, Button, Grid, Rating, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
// import axiosInstance from "../api/axiosInstance";
// import { createOrGetChat } from "../api/messagesAPI";
// import FavoriteToggle from "../components/FavoriteToggle";
// import { t } from "../i18n";

// export default function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userRating, setUserRating] = useState(0);
//   const [summary, setSummary] = useState({ ratingAverage: 0, ratingCount: 0 });
//   const [rateOpen, setRateOpen] = useState(false);
//   const [pendingRating, setPendingRating] = useState(0);
//   const [rateComment, setRateComment] = useState("");
//   const [rateTxnId, setRateTxnId] = useState("");
//   const [rateError, setRateError] = useState("");

//   const getSellerUserId = (p) => {
//     if (!p) return undefined;
//     return (
//       p?.seller?.userId ||
//       p?.seller?.id ||
//       p?.user?.userId ||
//       p?.user?.id ||
//       p?.sellerId ||
//       p?.userId ||
//       p?.ownerId
//     );
//   };


//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axiosInstance.get(`/products/${id}`);
//         setProduct(res.data);
//       } catch (err) {
//         setError(t('error_loading_product'));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     if (!product) return;
//     const ur = Number(product.userRating ?? product.myRating ?? 0);
//     setUserRating(isNaN(ur) ? 0 : ur);
//     const sellerId = getSellerUserId(product);
//     if (sellerId) {
//       axiosInstance.get(`/reviews/user/${sellerId}/summary`).then((res) => {
//         const s = res?.data || {};
//         setSummary({ ratingAverage: Number(s.ratingAverage || 0), ratingCount: Number(s.ratingCount || 0) });
//       }).catch((e) => {
//         // If no summary found (404), default to zeros silently
//         setSummary({ ratingAverage: 0, ratingCount: 0 });
//       });
//     }
//   }, [product]);



//   // Normalize image source (accept both string and object image entries)
//   const images = Array.isArray(product?.images) ? product.images : [];
//   const getSrc = (img) => {
//     if (!img) return "/placeholder.svg";
//     let src = null;
//     if (typeof img === 'string') src = img;
//     else src = img?.imageUrl || img?.url || img?.image_url || img?.path || img?.filename || null;
//     if (!src) return "/placeholder.svg";
//     const hasProtocol = /^https?:\/\//i.test(src);
//     if (hasProtocol) return src;
//     try {
//       const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
//       if (src.startsWith("/uploads") || src.startsWith("uploads/")) {
//         const path = src.startsWith("/") ? src : `/${src}`;
//         return apiOrigin ? `${apiOrigin}${path}` : path;
//       }
//     } catch (e) {
//       // ignore and return src as-is
//     }
//     return src;
//   };

//   const primaryIndex = images.findIndex((i) => i?.isPrimary === true);
//   const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
//   useEffect(() => {
//     const idx = Array.isArray(product?.images) ? images.findIndex((i) => i?.isPrimary === true) : -1;
//     setSelectedIndex(idx >= 0 ? idx : 0);
//   }, [product]);
//   const mainImage = getSrc(images[selectedIndex]);

//   if (loading)
//     return (
//       <Container sx={{ textAlign: "center", mt: 6 }}>
//         <CircularProgress />
//       </Container>
//     );

//   if (error)
//     return (
//       <Typography color="error" align="center" sx={{ mt: 4 }}>
//         {error}
//       </Typography>
//     );

//   if (!product) return null;

//   const conditionKeyMap = {
//     new: 'condition_new',
//     like_new: 'condition_like_new',
//     good: 'condition_good',
//     fair: 'condition_fair',
//     poor: 'condition_poor',
//   };

//   return (
//     <Container sx={{ mt: 5, direction: "rtl" }}>
//       <Card sx={{ p: 2, boxShadow: 3 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={5}>
//             <CardMedia
//               component="img"
//               image={mainImage}
//               alt={product.title}
//               sx={{
//                 width: "100%",
//                 height: 350,
//                 objectFit: "cover",
//                 borderRadius: 2,
//               }}
//             />
//             {images && images.length > 1 && (
//               <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
//                 {images.map((img, idx) => {
//                   const src = getSrc(img);
//                   const selected = idx === selectedIndex;
//                   return (
//                     <Box key={idx} sx={{ border: selected ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 1, cursor: 'pointer' }} onClick={() => setSelectedIndex(idx)}>
//                       <img src={src} alt={`${product.title} ${idx + 1}`} style={{ width: 92, height: 64, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
//                     </Box>
//                   );
//                 })}
//               </Box>
//             )}
//           </Grid>

//           <Grid item xs={12} md={7}>
//             <CardContent>
//               <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
//                 {product.title}
//               </Typography>

//               <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//                   <Typography variant="h6" color="primary" fontWeight="bold">
//                     {product.price?.toLocaleString()} {t('currency_iqd')}
//                   </Typography>
//                   <Rating
//                     value={Number(Math.round(userRating || summary.ratingAverage || 0))}
//                     precision={1}
//                     size="small"
//                     onChange={(_, newValue) => {
//                       if (!newValue) return;
//                       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//                       if (!token) { navigate('/login'); return; }
//                       setPendingRating(Math.round(newValue));
//                       setRateError("");
//                       setRateOpen(true);
//                     }}
//                   />
//                   {Boolean(summary.ratingCount) && (
//                     <Typography variant="body2" color="text.secondary">({summary.ratingCount})</Typography>
//                   )}
//                 </Box>
//                 {product.productId && <FavoriteToggle productId={product.productId} />}
//               </Box>

//               <Typography variant="body1" sx={{ mb: 2 }}>
//                 {product.description || t('no_description')}
//               </Typography>

//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 {t('category')}: {product.category?.nameAr || product.category?.name || t('unknown')}
//               </Typography>

//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 {t('province')}: {product.province?.nameAr || product.province?.name || t('unknown')}
//               </Typography>

//               <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                 {t('condition')}: {t(conditionKeyMap[product.condition] || '') || t('unknown')}
//               </Typography>

//               <Box sx={{ mt: 3, p: 2, borderTop: "1px solid #ccc" }}>
//                 <Typography variant="subtitle1" fontWeight="bold">
//                   {t('seller_info')}:
//                 </Typography>
//                 <Typography>{t('seller_name')}: {product.seller?.fullName}</Typography>
//                 <Typography>{t('seller_phone')}: {product.seller?.phoneNumber}</Typography>
//               </Box>

//               <Box sx={{ mt: 3 }}>
//                 <Button
//                   variant="contained"
//                   color="error"
//                   onClick={async () => {
//                     try {
//                       const sellerId = product?.sellerId || product?.userId || product?.ownerId || product?.seller?.id || product?.user?.id;
//                       if (!sellerId) { navigate('/chats'); return; }
//                       const res = await createOrGetChat({ sellerId, productId: product?.productId || product?.id });
//                       const payload = res?.data ?? res;
//                       const chat = payload?.data ?? payload ?? {};
//                       const chatId = chat?.id || chat?.chatId || payload?.id || payload?.chatId;
//                       if (chatId) navigate(`/chats?chatId=${chatId}`); else navigate('/chats');
//                     } catch (_) {
//                       navigate('/chats');
//                     }
//                   }}
//                 >
//                   {t('contact_seller')}
//                 </Button>
//               </Box>
//             </CardContent>
//           </Grid>
//         </Grid>
//       </Card>

//       <Dialog open={rateOpen} onClose={() => setRateOpen(false)}>
//         <DialogTitle>{t('rate_seller') || 'قيّم البائع'}</DialogTitle>
//         <DialogContent sx={{ pt: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//             <Typography variant="body2">{t('your_rating') || 'تقييمك'}:</Typography>
//             <Rating value={pendingRating} precision={1} onChange={(_, v) => setPendingRating(Math.round(v || 0))} />
//           </Box>
//           <TextField
//             fullWidth
//             label={t('transaction_id') || 'رقم العملية'}
//             value={rateTxnId}
//             onChange={(e) => setRateTxnId(e.target.value)}
//             type="number"
//             sx={{ mb: 2 }}
//           />
//           <Typography variant="caption" color="text.secondary" sx={{ display:'block', mb: 1 }}>
//             {t('hint_transaction_id') || 'أدخل رقم العملية المكتملة بينك وبين هذا البائع.'} {t('seller_id') || 'معرّف البائع'}: {String(getSellerUserId(product) || '')}
//           </Typography>
//           <TextField
//             fullWidth
//             label={t('comment_optional') || 'تعليق (اختياري)'}
//             value={rateComment}
//             onChange={(e) => setRateComment(e.target.value)}
//             multiline
//             minRows={2}
//           />
//           {rateError && (
//             <Typography color="error" variant="body2" sx={{ mt: 1 }}>{rateError}</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRateOpen(false)}>{t('cancel') || 'إلغاء'}</Button>
//           <Button variant="contained" onClick={async () => {
//             try {
//               const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//               if (!token) { navigate('/login'); return; }
//               const sellerId = getSellerUserId(product);
//               if (!sellerId) { setRateError(t('unknown_seller') || 'لا يوجد بائع'); return; }
//               if (!rateTxnId || Number(rateTxnId) <= 0) { setRateError(t('enter_valid_transaction') || 'أدخل رقم عملية صالح'); return; }
//               if (!pendingRating || pendingRating < 1 || pendingRating > 5) { setRateError(t('enter_valid_rating') || 'أدخل تقييم بين 1 و 5'); return; }
//               const body = {
//                 transactionId: Number(rateTxnId),
//                 reviewedUserId: Number(sellerId),
//                 rating: Number(pendingRating),
//                 comment: rateComment || undefined,
//               };
//               await axiosInstance.post('/reviews', body, { headers: { Authorization: `Bearer ${token}` } });
//               setUserRating(pendingRating);
//               // refresh summary
//               const sum = await axiosInstance.get(`/reviews/user/${sellerId}/summary`);
//               const s = sum?.data || {};
//               setSummary({ ratingAverage: Number(s.ratingAverage || pendingRating || 0), ratingCount: Number(s.ratingCount || (summary.ratingCount + 1) || 1) });
//               setRateOpen(false);
//               setRateComment("");
//               setRateTxnId("");
//               setRateError("");
//             } catch (e) {
//               const status = e?.response?.status;
//               const raw = e?.response?.data;
//               const msg = (typeof raw?.message === 'string' ? raw.message : Array.isArray(raw?.message) ? raw.message.join(' | ') : (raw?.error || e?.message));
//               if (status === 404) setRateError(t('transaction_not_found') || 'لم يتم العثور على العملية');
//               else if (status === 400) setRateError(typeof msg === 'string' ? msg : (t('bad_request') || 'طلب غير صالح'));
//               else setRateError(t('unknown_error') || 'حدث خطأ غير متوقع');
//             }
//           }}>
//             {t('submit') || 'إرسال'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// }
//========================================================================================
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Typography,
//   CircularProgress,
//   Card,
//   CardMedia,
//   CardContent,
//   Button,
//   Rating,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Chip,
//   IconButton,
//   Stack
// } from "@mui/material";
// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import axiosInstance from "../api/axiosInstance";
// import { createOrGetChat } from "../api/messagesAPI";
// import FavoriteToggle from "../components/FavoriteToggle";
// import { t } from "../i18n";
// import { useTheme } from "../context/ThemeContext";

// export default function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { darkMode } = useTheme();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [userRating, setUserRating] = useState(0);
//   const [summary, setSummary] = useState({ ratingAverage: 0, ratingCount: 0 });

//   // Rating Modal States
//   const [rateOpen, setRateOpen] = useState(false);
//   const [pendingRating, setPendingRating] = useState(0);
//   const [rateComment, setRateComment] = useState("");
//   const [rateTxnId, setRateTxnId] = useState("");
//   const [rateError, setRateError] = useState("");

//   // Size Selection State (Mocking for UI as per image)
//   // const [selectedSize, setSelectedSize] = useState(null);
//   // const sizes = [38, 39, 40, 41, 42]; // Example sizes

//   const getSellerUserId = (p) => {
//     if (!p) return undefined;
//     return (
//       p?.seller?.userId || p?.seller?.id || p?.user?.userId || p?.user?.id || p?.sellerId || p?.userId || p?.ownerId
//     );
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axiosInstance.get(`/products/${id}`);
//         setProduct(res.data);
//       } catch (err) {
//         setError(t('error_loading_product'));
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     if (!product) return;
//     const ur = Number(product.userRating ?? product.myRating ?? 0);
//     setUserRating(isNaN(ur) ? 0 : ur);
//     const sellerId = getSellerUserId(product);
//     if (sellerId) {
//       axiosInstance.get(`/reviews/user/${sellerId}/summary`).then((res) => {
//         const s = res?.data || {};
//         setSummary({ ratingAverage: Number(s.ratingAverage || 0), ratingCount: Number(s.ratingCount || 0) });
//       }).catch(() => {
//         setSummary({ ratingAverage: 0, ratingCount: 0 });
//       });
//     }
//   }, [product]);

//   // Image Helper
//   const images = Array.isArray(product?.images) ? product.images : [];
//   const getSrc = (img) => {
//     if (!img) return "/placeholder.svg";
//     let src = typeof img === 'string' ? img : (img?.imageUrl || img?.url || img?.path || null);
//     if (!src) return "/placeholder.svg";
//     if (/^https?:\/\//i.test(src)) return src;
//     try {
//       const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
//       const path = src.startsWith("/") ? src : `/${src}`;
//       return `${apiOrigin}${path}`;
//     } catch { return src; }
//   };

//   const primaryIndex = images.findIndex((i) => i?.isPrimary === true);
//   const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);

//   // Image Navigation Handlers
//   const handleNextImage = () => {
//     setSelectedIndex((prev) => (prev + 1) % images.length);
//   };
//   const handlePrevImage = () => {
//     setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   const mainImage = getSrc(images[selectedIndex]);

//   if (loading) return <Container sx={{ textAlign: "center", mt: 6 }}><CircularProgress /></Container>;
//   if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
//   if (!product) return null;

//   return (
//     <Box sx={{
//       bgcolor: darkMode ? '#0d1b2a' : '#f5f5f5',
//       minHeight: '100vh',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       py: 4
//     }}>
//       <Card sx={{
//         bgcolor: darkMode ? '#1a2f4a' : '#ffffff',
//         color: darkMode ? '#fff' : '#000',
//         maxWidth: 450,
//         width: '100%',
//         borderRadius: '30px',
//         boxShadow: darkMode ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
//         position: 'relative'
//       }}>

//         {/* Product Image Section */}
//         <Box sx={{ position: 'relative', m: 2 }}>
//           <CardMedia
//             component="img"
//             image={mainImage}
//             alt={product.title}
//             sx={{
//               height: 320,
//               borderRadius: '24px',
//               objectFit: 'cover',
//               bgcolor: darkMode ? '#0d1b2a' : '#e0e0e0'
//             }}
//           />

//           {/* Image Navigation Arrows (Only if multiple images) */}
//           {images.length > 1 && (
//             <>
//               <IconButton
//                 onClick={handlePrevImage}
//                 sx={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
//               >
//                 <ArrowBackIosNewIcon fontSize="small" />
//               </IconButton>
//               <IconButton
//                 onClick={handleNextImage}
//                 sx={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', color: 'white', bgcolor: 'rgba(0,0,0,0.3)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
//               >
//                 <ArrowForwardIosIcon fontSize="small" />
//               </IconButton>
//             </>
//           )}

//           {/* Favorite Toggle Overlay */}
//           <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
//             <FavoriteToggle productId={product.productId || product.id} />
//           </Box>
//         </Box>

//         <CardContent sx={{ px: 3 }}>
//           {/* Brand/Category Tag & Rating */}
//           <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//             <Chip
//               label={product.category?.nameAr || product.category?.name || "Nike"}
//               sx={{ bgcolor: darkMode ? '#34495e' : '#f0f0f0', color: darkMode ? '#fff' : '#000', fontWeight: 'bold', height: 28 }}
//             />
//             <Stack direction="row" alignItems="center" gap={0.5}>
//               <Typography variant="body2" fontWeight="bold">
//                 ★ {summary.ratingAverage > 0 ? summary.ratingAverage.toFixed(2) : "New"}
//               </Typography>
//               <Typography variant="caption" color={darkMode ? '#aaa' : '#666'}>
//                 ({summary.ratingCount})
//               </Typography>
//             </Stack>
//           </Stack>

//           {/* Title */}
//           <Typography variant="h6" fontWeight="bold" gutterBottom lineHeight={1.2}>
//             {product.title}
//           </Typography>

//           {/* Price */}
//           <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
//             {product.price?.toLocaleString()} <span style={{ fontSize: '1rem' }}>{t('currency_iqd')}</span>
//           </Typography>

//           {/* Action Buttons */}
//           <Stack direction="row" gap={2}>
//             <Button
//               fullWidth
//               variant="contained"
//               onClick={async () => {
//                 try {
//                   const sellerId = getSellerUserId(product);
//                   if (!sellerId) { navigate('/chats'); return; }
//                   const res = await createOrGetChat({ sellerId, productId: product?.productId || product?.id });
//                   const payload = res?.data ?? res;
//                   const chat = payload?.data ?? payload ?? {};
//                   const chatId = chat?.id || chat?.chatId;
//                   if (chatId) navigate(`/chats?chatId=${chatId}`); else navigate('/chats');
//                 } catch (_) { navigate('/chats'); }
//               }}
//               sx={{
//                 bgcolor: darkMode ? '#34495e' : '#0d1b2a',
//                 color: '#fff',
//                 borderRadius: '50px',
//                 py: 1.5,
//                 fontWeight: 'bold',
//                 textTransform: 'none',
//                 fontSize: '1rem',
//                 '&:hover': { bgcolor: darkMode ? '#455a73' : '#1a2f4a' }
//               }}
//             >
//               {t('contact_seller')}
//             </Button>

//             <IconButton
//               sx={{
//                 bgcolor: darkMode ? '#34495e' : '#0d1b2a',
//                 color: '#fff',
//                 borderRadius: '16px',
//                 width: 56,
//                 height: 56,
//                 '&:hover': { bgcolor: darkMode ? '#455a73' : '#1a2f4a' }
//               }}
//             >
//               <ShoppingCartOutlinedIcon />
//             </IconButton>
//           </Stack>

//         </CardContent>
//       </Card>

//       {/* Rating Dialog (Hidden Logic - kept for functionality) */}
//       <Dialog
//         open={rateOpen}
//         onClose={() => setRateOpen(false)}
//         PaperProps={{
//           sx: {
//             bgcolor: darkMode ? '#1a2f4a' : '#ffffff',
//             color: darkMode ? '#fff' : '#000'
//           }
//         }}
//       >
//         <DialogTitle sx={{ color: darkMode ? '#fff' : '#000' }}>{t('rate_seller')}</DialogTitle>
//         <DialogContent sx={{ pt: 1 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//             <Rating value={pendingRating} onChange={(_, v) => setPendingRating(Math.round(v || 0))} />
//           </Box>
//           <TextField
//             fullWidth
//             label={t('transaction_id')}
//             value={rateTxnId}
//             onChange={(e) => setRateTxnId(e.target.value)}
//             sx={{
//               mb: 2,
//               '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
//               '& .MuiOutlinedInput-root': {
//                 borderColor: darkMode ? '#34495e' : '#ccc',
//                 '& fieldset': { borderColor: darkMode ? '#34495e' : '#ccc' },
//                 '&:hover fieldset': { borderColor: darkMode ? '#555' : '#aaa' }
//               },
//               '& .MuiInputBase-input::placeholder': { color: darkMode ? '#888' : '#999', opacity: 1 }
//             }}
//           />
//           <TextField
//             fullWidth
//             label={t('comment_optional')}
//             value={rateComment}
//             onChange={(e) => setRateComment(e.target.value)}
//             multiline
//             minRows={2}
//             sx={{
//               '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
//               '& .MuiOutlinedInput-root': {
//                 borderColor: darkMode ? '#34495e' : '#ccc',
//                 '& fieldset': { borderColor: darkMode ? '#34495e' : '#ccc' },
//                 '&:hover fieldset': { borderColor: darkMode ? '#555' : '#aaa' }
//               }
//             }}
//           />
//           {rateError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{rateError}</Typography>}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRateOpen(false)} sx={{ color: darkMode ? '#aaa' : '#666' }}>{t('cancel')}</Button>
//           <Button
//             variant="contained"
//             sx={{
//               bgcolor: darkMode ? '#34495e' : '#0d1b2a',
//               '&:hover': { bgcolor: darkMode ? '#455a73' : '#1a2f4a' }
//             }}
//             onClick={async () => {
//               try {
//                 const token = localStorage.getItem('token');
//                 const sellerId = getSellerUserId(product);
//                 if (!token || !sellerId) return;

//                 const body = {
//                   transactionId: Number(rateTxnId),
//                   reviewedUserId: Number(sellerId),
//                   rating: Number(pendingRating),
//                   comment: rateComment || undefined,
//                 };
//                 await axiosInstance.post('/reviews', body, { headers: { Authorization: `Bearer ${token}` } });
//                 setUserRating(pendingRating);
//                 setRateOpen(false);
//               } catch (e) {
//                 setRateError(t('unknown_error'));
//               }
//             }}>
//             {t('submit')}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  Grid,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Divider,
  Paper
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteToggle from "../components/FavoriteToggle";
import { CartIcon } from "../components/CartIcon";
import axiosInstance from "../api/axiosInstance";
import { createOrGetChat } from "../api/messagesAPI";
import { t } from "../i18n";
import { useTheme } from "../context/ThemeContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Data States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [summary, setSummary] = useState({ ratingAverage: 0, ratingCount: 0 });

  // UI States for Selection
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const sizes = [38, 39, 40, 41, 42]; // Example sizes (simulating the 'ml' options)

  // Rating Modal States
  const [rateOpen, setRateOpen] = useState(false);
  const [pendingRating, setPendingRating] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [rateTxnId, setRateTxnId] = useState("");
  const [rateError, setRateError] = useState("");

  const getSellerUserId = (p) => {
    if (!p) return undefined;
    return (
      p?.seller?.userId || p?.seller?.id || p?.user?.userId || p?.user?.id || p?.sellerId || p?.userId || p?.ownerId
    );
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError(t('error_loading_product'));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const ur = Number(product.userRating ?? product.myRating ?? 0);
    setUserRating(isNaN(ur) ? 0 : ur);
    const sellerId = getSellerUserId(product);
    if (sellerId) {
      axiosInstance.get(`/reviews/user/${sellerId}/summary`).then((res) => {
        const s = res?.data || {};
        setSummary({ ratingAverage: Number(s.ratingAverage || 0), ratingCount: Number(s.ratingCount || 0) });
      }).catch(() => {
        setSummary({ ratingAverage: 0, ratingCount: 0 });
      });
    }
  }, [product]);

  // Image Logic
  const images = Array.isArray(product?.images) ? product.images : [];
  const getSrc = (img) => {
    if (!img) return "/placeholder.svg";
    let src = typeof img === 'string' ? img : (img?.imageUrl || img?.url || img?.path || null);
    if (!src) return "/placeholder.svg";
    if (/^https?:\/\//i.test(src)) return src;
    try {
      const apiOrigin = new URL(axiosInstance.defaults.baseURL).origin;
      const path = src.startsWith("/") ? src : `/${src}`;
      return `${apiOrigin}${path}`;
    } catch { return src; }
  };

  const primaryIndex = images.findIndex((i) => i?.isPrimary === true);
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex >= 0 ? primaryIndex : 0);
  const mainImage = getSrc(images[selectedIndex]);

  // Handlers
  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  // Image Navigation
  const handleNextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };
  const handlePrevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Add to cart handler
  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.productId === (product.productId || product.id));

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          productId: product.productId || product.id,
          title: product.title,
          price: product.price,
          images: images.length > 0 ? images : [{ imageUrl: mainImage }],
          quantity: quantity
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart:updated'));
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) return <Container sx={{ textAlign: "center", mt: 6 }}><CircularProgress /></Container>;
  if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
  if (!product) return null;

  return (
    <Box sx={{
      bgcolor: darkMode ? '#0d1b2a' : '#F9FAFB',
      py: 4,
      display: 'flex',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: '28px',
            overflow: 'hidden',
            bgcolor: darkMode ? '#1a2f4a' : '#fff',
            boxShadow: darkMode ? '0px 10px 40px rgba(0,0,0,0.3)' : '0px 10px 40px rgba(0,0,0,0.05)',
            p: { xs: 2, md: 3 }
          }}
        >
          <Grid container spacing={3}>
            {/* Left Side: Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: { xs: 250, md: 350 },
                  borderRadius: '20px',
                  bgcolor: darkMode ? '#0d1b2a' : '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <CardMedia
                  component="img"
                  image={mainImage}
                  alt={product.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                      }}
                    >
                      <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'white',
                        bgcolor: 'rgba(0,0,0,0.4)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </>
                )}

                {/* Thumbnails Overlay */}
                {images.length > 1 && (
                  <Box sx={{ position: 'absolute', bottom: 16, display: 'flex', gap: 1 }}>
                    {images.map((img, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setSelectedIndex(idx)}
                        sx={{
                          width: 10, height: 10, borderRadius: '50%',
                          bgcolor: selectedIndex === idx ? '#FFD700' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          transition: '0.3s'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right Side: Details */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

              {/* Brand / Category */}
              <Typography variant="overline" sx={{
                color: darkMode ? '#aaa' : 'text.secondary',
                letterSpacing: 1,
                fontSize: '0.8rem'
              }}>
                {product.category?.nameAr || product.category?.name || "CATEGORY"}
              </Typography>

              {/* Title */}
              <Typography variant="h5" fontWeight="700" sx={{
                mb: 1,
                color: darkMode ? '#fff' : '#111',
                lineHeight: 1.3
              }}>
                {product.title}
              </Typography>

              {/* Rating */}
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2, cursor: 'pointer' }} onClick={() => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                if (!token) { navigate('/login'); return; }
                setRateOpen(true);
              }}>
                <Rating
                  value={Number(summary.ratingAverage)}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ color: '#FFD700' }}
                />
                <Typography variant="caption" color="text.secondary" fontWeight="500">
                  {summary.ratingAverage.toFixed(1)} ({summary.ratingCount})
                </Typography>
              </Stack>

              {/* Price */}
              <Typography variant="h6" fontWeight="bold" sx={{
                mb: 2,
                color: darkMode ? '#fff' : '#111'
              }}>
                {product.price?.toLocaleString()} <Typography component="span" variant="body1" color={darkMode ? '#aaa' : 'text.secondary'}>{t('currency_iqd')}</Typography>
              </Typography>

              {/* Description */}
              <Typography variant="body2" color={darkMode ? '#ccc' : 'text.secondary'} paragraph sx={{ mb: 3, lineHeight: 1.6, fontSize: '0.95rem' }}>
                {product.description || t('no_description')}
              </Typography>

              <Divider sx={{ mb: 2, borderColor: darkMode ? '#34495e' : '#f0f0f0' }} />

              {/* Options Row: Qty Only */}
              <Box sx={{ mb: 3 }}>
                {/* Quantity Stepper */}
                <Box>
                  <Typography variant="caption" sx={{
                    color: darkMode ? '#aaa' : '#888',
                    mb: 0.5,
                    display: 'block',
                    fontWeight: 'bold',
                    fontSize: '0.75rem'
                  }}>
                    {t('quantity') || 'QTY'}
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: darkMode ? '#34495e' : '#F9FAFB',
                    borderRadius: '16px',
                    px: 0.5,
                    border: `1px solid ${darkMode ? '#455a73' : '#E5E7EB'}`,
                    width: 'fit-content'
                  }}>
                    <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} sx={{ p: 0.5 }}>
                      <RemoveIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    <Typography sx={{ mx: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>{quantity}</Typography>
                    <IconButton size="small" onClick={() => handleQuantityChange(1)} sx={{ p: 0.5 }}>
                      <AddIcon fontSize="small" sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Favorite Button (Styled as grey circle) */}
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: darkMode ? '#34495e' : '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s',
                  flexShrink: 0,
                  '&:hover': { bgcolor: darkMode ? '#455a73' : '#E5E7EB' }
                }}>
                  <FavoriteToggle productId={product.productId || product.id} />
                </Box>

                {/* Main Action Button  */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={async () => {
                    try {
                      const sellerId = getSellerUserId(product);
                      if (!sellerId) { navigate('/chats'); return; }
                      const res = await createOrGetChat({ sellerId, productId: product?.productId || product?.id });
                      const payload = res?.data ?? res;
                      const chat = payload?.data ?? payload ?? {};
                      const chatId = chat?.id || chat?.chatId;
                      if (chatId) navigate(`/chats?chatId=${chatId}`); else navigate('/chats');
                    } catch (_) { navigate('/chats'); }
                  }}
                  sx={{
                    bgcolor: darkMode ? '#34495e' : '#FFD700',
                    color: darkMode ? '#fff' : '#000',
                    fontWeight: 'bold',
                    borderRadius: '24px',
                    height: 48,
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: darkMode ? '#455a73' : '#FFC400', boxShadow: 'none' }
                  }}
                >
                  {t('contact_seller')}
                </Button>

                {/* Cart Button */}
                <Box
                  onClick={handleAddToCart}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: darkMode ? '#34495e' : '#FFD700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    transition: '0.1s',
                    cursor: 'pointer',
                    flexShrink: 0,
                    '&:hover': { bgcolor: darkMode ? '#455a73' : '#FFC400' }
                  }}
                >
                  <CartIcon />
                </Box>
              </Stack>

            </Grid>
          </Grid>
        </Paper>

        {/* Rating Dialog (Hidden Logic - kept for functionality) */}
        <Dialog
          open={rateOpen}
          onClose={() => setRateOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: darkMode ? '#1a2f4a' : '#fff',
              color: darkMode ? '#fff' : '#000'
            }
          }}
        >
          <DialogTitle sx={{ color: darkMode ? '#fff' : '#000' }}>{t('rate_seller')}</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Rating value={pendingRating} onChange={(_, v) => setPendingRating(Math.round(v || 0))} />
            <TextField
              fullWidth
              margin="dense"
              label={t('transaction_id')}
              value={rateTxnId}
              onChange={(e) => setRateTxnId(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
                '& .MuiOutlinedInput-root': {
                  borderColor: darkMode ? '#34495e' : '#ccc',
                  '& fieldset': { borderColor: darkMode ? '#34495e' : '#ccc' },
                  '&:hover fieldset': { borderColor: darkMode ? '#555' : '#aaa' }
                },
                '& .MuiInputBase-input::placeholder': { color: darkMode ? '#888' : '#999', opacity: 1 }
              }}
            />
            <TextField
              fullWidth
              margin="dense"
              label={t('comment_optional')}
              multiline
              rows={2}
              value={rateComment}
              onChange={(e) => setRateComment(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: darkMode ? '#fff' : '#000' },
                '& .MuiOutlinedInput-root': {
                  borderColor: darkMode ? '#34495e' : '#ccc',
                  '& fieldset': { borderColor: darkMode ? '#34495e' : '#ccc' },
                  '&:hover fieldset': { borderColor: darkMode ? '#555' : '#aaa' }
                }
              }}
            />
            {rateError && <Typography color="error" variant="caption">{rateError}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRateOpen(false)} sx={{ color: darkMode ? '#aaa' : '#666' }}>{t('cancel')}</Button>
            <Button
              variant="contained"
              onClick={async () => {
                /* Same rating logic as before */
                try {
                  const token = localStorage.getItem('token');
                  const sellerId = getSellerUserId(product);
                  if (!token || !sellerId) return;
                  await axiosInstance.post('/reviews', {
                    transactionId: Number(rateTxnId), reviewedUserId: Number(sellerId), rating: Number(pendingRating), comment: rateComment
                  }, { headers: { Authorization: `Bearer ${token}` } });
                  setRateOpen(false);
                } catch (e) { setRateError(t('error')); }
              }}
              sx={{
                bgcolor: darkMode ? '#34495e' : '#FFD700',
                color: darkMode ? '#fff' : '#000',
                '&:hover': { bgcolor: darkMode ? '#455a73' : '#FFC400' }
              }}
            >{t('submit')}</Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
}