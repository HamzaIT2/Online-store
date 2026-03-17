
// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   Box, Paper, Typography, Avatar, TextField, IconButton, List, ListItemButton,
//   ListItemAvatar, ListItemText, Divider, useMediaQuery, Container, CircularProgress
// } from "@mui/material";
// import {
//   Send as SendIcon, Image as ImageIcon, AttachFile,
//   ArrowBack, MoreVert, Circle as CircleIcon
// } from '@mui/icons-material';
// import { styled, useTheme } from '@mui/material/styles';
// import { listChats, getChatMessages, sendMessage } from "../api/messagesAPI";
// import axiosInstance from "../api/axiosInstance";
// import { t } from "../i18n";

// // --- تنسيق المكونات (Styled Components) ---

// // الحاوية الرئيسية
// const ChatLayout = styled(Paper)(({ theme }) => ({
//   display: 'flex',
//   height: 'calc(100vh - 100px)', // ارتفاع متناسب مع الشاشة
//   overflow: 'hidden',
//   borderRadius: theme.shape.borderRadius * 2,
//   border: `1px solid ${theme.palette.divider}`,
//   marginTop: theme.spacing(4),
// }));

// // القائمة الجانبية (تم إصلاح تمرير isOpen)
// const Sidebar = styled(Box, { shouldForwardProp: (prop) => prop !== 'isOpen' })(({ theme, isOpen }) => ({
//   width: 350,
//   backgroundColor: theme.palette.background.paper,
//   borderRight: `1px solid ${theme.palette.divider}`,
//   display: 'flex',
//   flexDirection: 'column',
//   [theme.breakpoints.down('md')]: {
//     width: '100%',
//     display: isOpen ? 'flex' : 'none', // إخفاء القائمة عند فتح المحادثة في الموبايل
//   },
// }));

// // منطقة الدردشة (تم إصلاح تمرير isOpen)
// const ChatArea = styled(Box, { shouldForwardProp: (prop) => prop !== 'isOpen' })(({ theme, isOpen }) => ({
//   flex: 1,
//   display: 'flex',
//   flexDirection: 'column',
//   backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f0f2f5',
//   backgroundImage: theme.palette.mode === 'light' ? 'url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png")' : 'none',
//   [theme.breakpoints.down('md')]: {
//     display: !isOpen ? 'flex' : 'none',
//   },
// }));

// // فقاعة الرسالة (تم إصلاح تمرير isMe)
// const MessageBubble = styled(Box, { shouldForwardProp: (prop) => prop !== 'isMe' })(({ theme, isMe }) => ({
//   maxWidth: '75%',
//   padding: '10px 16px',
//   borderRadius: 18,
//   position: 'relative',
//   fontSize: '0.95rem',
//   marginBottom: 8,
//   wordBreak: 'break-word',
//   // ألوان مختلفة للمرسل والمستقبل
//   backgroundColor: isMe ? theme.palette.primary.main : theme.palette.background.paper,
//   color: isMe ? '#fff' : theme.palette.text.primary,
//   alignSelf: isMe ? 'flex-end' : 'flex-start',
//   boxShadow: theme.shadows[1],
//   // شكل الذيل
//   borderTopRightRadius: isMe ? 0 : 18,
//   borderTopLeftRadius: isMe ? 18 : 0,
// }));

// export default function Chats() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const location = useLocation();

//   const [chats, setChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [draft, setDraft] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // 1. معرفة المستخدم الحالي
//   useEffect(() => {
//     const fetchMe = async () => {
//       try {
//         const res = await axiosInstance.get('/users/profile');
//         setCurrentUserId(res.data?.id || res.data?.userId);
//       } catch (e) { console.error(e); }
//     };
//     fetchMe();
//   }, []);

//   // 2. تحميل قائمة المحادثات
//   useEffect(() => {
//     const loadChats = async () => {
//       try {
//         const res = await listChats();
//         const list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
//         setChats(list);

//         const params = new URLSearchParams(location.search);
//         const chatId = params.get('chatId');
//         if (chatId) {
//           const target = list.find(c => String(c.id) === chatId || String(c.conversationId) === chatId);
//           if (target) setCurrentChat(target);
//         }
//       } catch (e) { console.error("Load chats error", e); }
//     };
//     loadChats();
//   }, [location.search]);

//   // 3. تحميل الرسائل
//   useEffect(() => {
//     if (!currentChat) return;
//     const loadMsgs = async () => {
//       try {
//         const chatId = currentChat.id || currentChat.conversationId;
//         const res = await getChatMessages(chatId);
//         setMessages(Array.isArray(res.data) ? res.data : (res.data?.items || []));
//         scrollToBottom();
//       } catch (e) { console.error(e); }
//     };
//     loadMsgs();

//     const interval = setInterval(loadMsgs, 3000);
//     return () => clearInterval(interval);
//   }, [currentChat]);

//   const scrollToBottom = () => {
//     setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
//   };

//   // 4. إرسال النص
//   const handleSend = async () => {
//     if (!draft.trim() || !currentChat) return;
//     const chatId = currentChat.id || currentChat.conversationId;

//     const tempMsg = {
//       id: Date.now(),
//       content: draft,
//       senderId: currentUserId,
//       createdAt: new Date().toISOString(),
//       isTemp: true
//     };
//     setMessages(prev => [...prev, tempMsg]);
//     setDraft("");
//     scrollToBottom();

//     try {
//       await sendMessage(chatId, { type: 'text', text: tempMsg.content });
//       const res = await getChatMessages(chatId);
//       setMessages(Array.isArray(res.data) ? res.data : []);
//     } catch (e) {
//       console.error("Send failed", e);
//     }
//   };

//   // 5. رفع الصور
//   const handleFileUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !currentChat) return;

//     const chatId = currentChat.id || currentChat.conversationId;
//     setUploading(true);

//     try {
//       const fd = new FormData();
//       fd.append('file', file);

//       const res = await axiosInstance.post(`/chats/${chatId}/attachments`, fd);
//       const data = res.data || {};
//       const url = data.url || data.imageUrl || data.path;

//       if (url) {
//         await sendMessage(chatId, { type: 'image', imageUrl: url });
//         const refresh = await getChatMessages(chatId);
//         setMessages(Array.isArray(refresh.data) ? refresh.data : []);
//         scrollToBottom();
//       }
//     } catch (error) {
//       console.error("Upload failed", error);
//     } finally {
//       setUploading(false);
//       e.target.value = '';
//     }
//   };

//   const getChatInfo = (chat) => {
//     if (!chat) return { name: "مستخدم", avatar: "" };

//     if (chat.participants && Array.isArray(chat.participants) && currentUserId) {
//       const other = chat.participants.find(p => String(p.id) !== String(currentUserId));
//       if (other) return { name: other.fullName || other.username, avatar: other.avatar || other.profileImage };
//     }

//     return {
//       name: chat.otherUser?.fullName || chat.title || "مستخدم",
//       avatar: chat.otherUser?.avatar || chat.image || ""
//     };
//   };

//   const renderBubble = (msg) => {
//     const isMe = String(msg.senderId) === String(currentUserId);
//     const isImage = msg.type === 'image' || (msg.content && (msg.content.startsWith('http') && msg.content.match(/\.(jpeg|jpg|gif|png|webp)$/i)));


//     const getOtherParty = (chat) => {
//       if (!chat || !currentUserId) return { name: "مستخدم", image: "" };

//       // 1. إذا كانت البيانات تأتي بصيغة Buyer/Seller
//       if (chat.seller && chat.buyer) {
//         // إذا كنت أنا البائع، فالطرف الآخر هو المشتري، والعكس صحيح
//         // نستخدم == للمقارنة لأن الآيدي قد يكون نصاً أو رقماً
//         if (chat.seller.id == currentUserId || chat.sellerId == currentUserId) {
//           return {
//             name: chat.buyer.fullName || chat.buyer.username || "المشتري",
//             image: chat.buyer.profileImage
//           };
//         } else {
//           return {
//             name: chat.seller.fullName || chat.seller.username || "البائع",
//             image: chat.seller.profileImage
//           };
//         }
//       }

//       // 2. إذا كانت البيانات تأتي مصفوفة Participants (users)
//       if (chat.users && Array.isArray(chat.users)) {
//         const otherUser = chat.users.find(u => u.id != currentUserId && u.userId != currentUserId);
//         if (otherUser) {
//           return {
//             name: otherUser.fullName || otherUser.username || "مستخدم",
//             image: otherUser.profileImage
//           };
//         }
//       }

//       return { name: "مستخدم غير معروف", image: "" };
//     };







//     return (
//       <MessageBubble key={msg.id || Date.now()} isMe={isMe}>
//         {isImage ? (
//           <Box
//             component="img"
//             src={msg.content || msg.imageUrl}
//             sx={{ maxWidth: '100%', borderRadius: 2, cursor: 'pointer', maxHeight: 300 }}
//             onClick={() => window.open(msg.content || msg.imageUrl, '_blank')}
//           />
//         ) : (
//           <Typography variant="body1">{msg.content || msg.text}</Typography>
//         )}
//         <Typography variant="caption" sx={{ display: 'block', textAlign: isMe ? 'left' : 'right', mt: 0.5, opacity: 0.7, fontSize: '0.7rem' }}>
//           {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </Typography>
//       </MessageBubble>
//     );
//   };

//   const currentChatInfo = getChatInfo(currentChat);


//   return (
//     <Container maxWidth="xl" sx={{ p: { xs: 0, md: 2 }, mt: { xs: 8, md: 4 } }}>
//       <ChatLayout elevation={3}>
//         {/* --- القائمة الجانبية --- */}
//         <Sidebar isOpen={!currentChat}>
//           <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
//             <Typography variant="h6" fontWeight="bold">{t('messages') || 'الرسائل'}</Typography>
//           </Box>
//           <List sx={{ flex: 1, overflowY: 'auto' }}>
//             {chats.map(chat => {
//               const info = getChatInfo(chat);
//               return (
//                 <div key={chat.id || chat.conversationId}>
//                   <ListItemButton
//                     selected={currentChat?.id === chat.id}
//                     onClick={() => setCurrentChat(chat)}
//                     sx={{ borderRadius: 0 }}
//                   >
//                     <ListItemAvatar>
//                       <Avatar src={info.avatar} />
//                     </ListItemAvatar>
//                     <ListItemText
//                       primary={info.name}
//                       primaryTypographyProps={{ fontWeight: 'bold' }}
//                       secondary={chat.lastMessage?.content || t('no_messages') || "..."}
//                       secondaryTypographyProps={{ noWrap: true, fontSize: 13 }}
//                     />
//                     {chat.unreadCount > 0 && <CircleIcon color="primary" sx={{ fontSize: 12 }} />}
//                   </ListItemButton>
//                   <Divider component="li" />
//                 </div>
//               );
//             })}
//             {chats.length === 0 && (
//               <Box sx={{ p: 4, textAlign: 'center' }}>
//                 <Typography color="text.secondary">{t('no_chats') || 'لا توجد محادثات'}</Typography>
//               </Box>
//             )}
//           </List>
//         </Sidebar>

//         {/* --- منطقة المحادثة --- */}
//         {currentChat ? (
//           <ChatArea isOpen={!!currentChat}>
//             {/* رأس المحادثة */}
//             <Paper square elevation={1} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 {isMobile && (
//                   <IconButton onClick={() => setCurrentChat(null)}>
//                     <ArrowBack />
//                   </IconButton>
//                 )}
//                 <Avatar src={currentChatInfo.avatar} />
//                 <Box>
//                   <Typography variant="subtitle1" fontWeight="bold">
//                     {currentChatInfo.name}
//                   </Typography>
//                 </Box>
//               </Box>
//               <IconButton><MoreVert /></IconButton>
//             </Paper>

//             {/* جسم الرسائل */}
//             <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
//               {messages.map(renderBubble)}
//               <div ref={messagesEndRef} />
//             </Box>

//             {/* منطقة الكتابة */}
//             <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

//                 {/* زر الصور */}
//                 <IconButton color="primary" component="label" disabled={uploading}>
//                   {uploading ? <CircularProgress size={24} /> : <ImageIcon />}
//                   <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
//                 </IconButton>

//                 <IconButton color="primary" disabled={uploading}>
//                   <AttachFile />
//                 </IconButton>

//                 <TextField
//                   fullWidth
//                   placeholder={t('type_message') || "اكتب رسالتك..."}
//                   variant="outlined"
//                   size="small"
//                   value={draft}
//                   onChange={(e) => setDraft(e.target.value)}
//                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//                   sx={{
//                     '& .MuiOutlinedInput-root': { borderRadius: 6, bgcolor: 'background.default' }
//                   }}
//                 />

//                 <IconButton
//                   color="primary"
//                   onClick={handleSend}
//                   disabled={!draft.trim()}
//                   sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' }, width: 40, height: 40 }}
//                 >
//                   <SendIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             </Box>
//           </ChatArea>
//         ) : (
//           <ChatArea isOpen={false} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
//             <Box textAlign="center">
//               <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
//                 {t('select_chat_start') || 'اختر محادثة للبدء'}
//               </Typography>
//             </Box>
//           </ChatArea>
//         )}
//       </ChatLayout>
//     </Container>
//   );
// }

//-------------------------------------------------------------==============================================================


import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Divider, TextField, IconButton, Paper, CircularProgress, Typography, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ChatList from "../components/ChatList";
import ChatThread from "../components/ChatThread";
import { listChats, getChatMessages, sendMessage, findExistingChat, createOrGetChat } from "../api/messagesAPI";
import axiosInstance from "../api/axiosInstance";

export default function Chats() {
    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [errorChats, setErrorChats] = useState("");

    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [errorMsgs, setErrorMsgs] = useState("");
    const [currentUserId, setCurrentUserId] = useState(null);

    const [draft, setDraft] = useState("");
    const [uploading, setUploading] = useState(false);
    const unreadCountMap = useMemo(() => ({}), []);

    // Start or continue conversation
    const startConversation = async (sellerId, productId) => {
        try {
            const userId = localStorage.getItem('userId');

            if (!currentUserId) {
                console.error('No current user found');
                return;
            }

            // First try to find existing chat
            const existingChatResponse = await findExistingChat(currentUserId, sellerId, productId);

            if (existingChatResponse.data && existingChatResponse.data.conversationId) {
                // Open existing conversation
                setCurrentChat(existingChatResponse.data);
                loadMessages(existingChatResponse.data.conversationId);
            } else {
                // Create new conversation
                const newChatResponse = await createOrGetChat({ sellerId, productId });
                setCurrentChat(newChatResponse.data);
                loadMessages(newChatResponse.data.conversationId);
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
            setErrorChats('فشل في بدء المحادثة');
        }
    };

    // Load messages for a specific chat
    const loadMessages = async (chatId) => {
        setLoadingMsgs(true);
        setErrorMsgs("");
        try {
            const res = await getChatMessages(chatId);
            const data = res?.data ?? res;
            const rows = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.data) ? data.data : []));
            setMessages(rows);
        } catch (e) {
            setErrorMsgs("Failed to load messages");
        } finally {
            setLoadingMsgs(false);
        }
    };

    // Load current user id for alignment/context
    useEffect(() => {
        let mounted = true;
        const loadMe = async () => {
            try {
                const res = await axiosInstance.get('/users/profile');
                const me = res?.data || {};
                if (mounted) setCurrentUserId(me.id || me.userId || me.uid || null);
            } catch (_) { if (mounted) setCurrentUserId(null); }
        };
        loadMe();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoadingChats(true);
            try {
                const res = await listChats();
                const data = res?.data ?? res;
                const rows = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : (Array.isArray(data?.data) ? data.data : []));
                setChats(rows);
                // Try select by chatId from query string first
                if (rows.length) {
                    const params = new URLSearchParams(location.search);
                    const qId = params.get('chatId');
                    const target = qId ? rows.find(r => String(r.id) === String(qId) || String(r.chatId) === String(qId)) : null;
                    setCurrentChat(target || (!currentChat ? rows[0] : currentChat));
                }
            } catch (e) {
                setErrorChats('Failed to load chats');
            } finally {
                setLoadingChats(false);
            }
        };
        load();
    }, [location.search]);

    useEffect(() => {
        const loadMsgs = async () => {
            if (!currentChat?.id && !currentChat?.conversationId) return;
            const chatId = currentChat?.id || currentChat?.conversationId;
            await loadMessages(chatId);
        };
        loadMsgs();
    }, [currentChat]);

    const handleSend = async () => {
        const text = draft.trim();
        if (!text || !currentChat?.id) return;

        console.log('Sending message:', {
            chatId: currentChat.id,
            text: text,
            currentUserId: currentUserId
        });

        setDraft("");
        try {
            const res = await sendMessage(currentChat.id, { type: 'text', text });
            console.log('Message sent successfully:', res);
            const saved = (res?.data?.data ?? res?.data ?? res) || null;
            if (saved && typeof saved === 'object') {
                console.log('Message saved to state:', saved);
                setMessages((m) => [...m, saved]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            console.error('Error response:', error.response?.data);
            // revert draft on failure
            setDraft(text);
        }
    };

    const handleSendLocation = async () => {
        if (!currentChat?.id) return;
        try {
            if (!('geolocation' in navigator)) return;
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const { latitude, longitude } = pos.coords;
                const url = `https://maps.google.com/?q=${latitude},${longitude}`;
                try {
                    const res = await sendMessage(currentChat.id, { type: 'text', text: url });
                    const saved = (res?.data?.data ?? res?.data ?? res) || null; if (saved && typeof saved === 'object') setMessages((m) => [...m, saved]);
                } catch (_) { }
            });
        } catch (_) { }
    };

    const tryUpload = async (file) => {
        if (!currentChat?.id) throw new Error('no_chat');
        const ep = `/chats/${currentChat.id}/attachments`;
        const fd = new FormData();
        fd.append('file', file);
        const res = await axiosInstance.post(ep, fd);
        const data = res?.data || {};
        let path = data.url || data.imageUrl || data.path || data.filename || "";
        if (!path) throw new Error('upload_failed');
        if (!/^https?:\/\//i.test(path)) {
            const origin = new URL(axiosInstance.defaults.baseURL).origin;
            path = origin + (String(path).startsWith('/') ? path : `/${path}`);
        }
        return path;
    };

    const handlePickFile = async (e, asImage) => {
        const f = e.target.files && e.target.files[0];
        if (!f || !currentChat?.id) return;
        setUploading(true);
        try {
            const url = await tryUpload(f);
            const payload = asImage ? { type: 'image', imageUrl: url } : { type: 'text', text: url };
            const res = await sendMessage(currentChat.id, payload);
            const saved = (res?.data?.data ?? res?.data ?? res) || null;
            if (saved && typeof saved === 'object') setMessages((m) => [...m, saved]);
        } catch (_) {
            // noop for now
        } finally {
            setUploading(false);
            // reset input value so same file can be selected again
            e.target.value = '';
        }
    };

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: 2,
            p: 2,
            mt: 8,
            height: 'calc(100vh - 200px)',
            background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}>
            {/* Chat List Sidebar */}
            <Paper
                elevation={3}
                sx={{
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <Box sx={{
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.02)'
                        : 'rgba(255,255,255,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            💬 المحادثات
                        </Typography>
                    </Box>
                </Box>

                {/* Chat List */}
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <ChatList
                        chats={chats}
                        loading={loadingChats}
                        error={errorChats}
                        selectedId={currentChat?.id}
                        onSelect={setCurrentChat}
                        unreadCountMap={unreadCountMap}
                        currentUserId={currentUserId}
                    />
                </Box>
            </Paper>

            {/* Chat Area */}
            <Paper
                elevation={3}
                sx={{
                    height: '100%',
                    overflow: 'hidden',
                    borderRadius: 3,
                    background: theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                }}
            >
                {/* Chat Header */}
                {currentChat && (
                    <Box sx={{
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        background: theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.02)'
                            : 'rgba(255,255,255,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {currentChat.otherUserName || currentChat.sellerName || currentChat.buyerName || 'محادثة'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {currentChat.participants?.length > 1 ? `${currentChat.participants.length} مشاركين` : 'مشارك واحد'}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Messages Area */}
                <Box sx={{
                    flex: 1,
                    overflow: 'hidden',
                    display: currentChat ? 'flex' : 'none'
                }}>
                    <ChatThread
                        messages={messages}
                        loading={loadingMsgs}
                        error={errorMsgs}
                        currentUserId={currentUserId}
                    />
                </Box>

                {/* Empty State */}
                {!currentChat && (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 4
                    }}>
                        <Box sx={{ fontSize: '4rem', mb: 2 }}>💬</Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                            مرحباً!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            اختر محادثة من القائمة لبدء الدردشة
                        </Typography>
                    </Box>
                )}

                {/* Input Area */}
                {currentChat && (
                    <>
                        <Divider />
                        <Box sx={{
                            p: 2,
                            background: theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.02)'
                                : 'rgba(255,255,255,0.5)',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 1,
                                borderRadius: 3,
                                background: theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(255,255,255,0.8)',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.2s ease-in-out',
                                '&:focus-within': {
                                    borderColor: theme.palette.primary.main,
                                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
                                }
                            }}>
                                <input
                                    id="chat-image-input"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handlePickFile(e, true)}
                                />
                                <input
                                    id="chat-file-input"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handlePickFile(e, false)}
                                />

                                <IconButton
                                    title="أرسل صورة"
                                    color="primary"
                                    onClick={() => document.getElementById('chat-image-input')?.click()}
                                    disabled={uploading}
                                    sx={{
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main + '15',
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    <ImageIcon />
                                </IconButton>

                                <IconButton
                                    title="أرفق ملف"
                                    color="primary"
                                    onClick={() => document.getElementById('chat-file-input')?.click()}
                                    disabled={uploading}
                                    sx={{
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main + '15',
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    <AttachFileIcon />
                                </IconButton>

                                <IconButton
                                    title="أرسل موقعي"
                                    color="primary"
                                    onClick={handleSendLocation}
                                    sx={{
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.main + '15',
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                >
                                    <MyLocationIcon />
                                </IconButton>

                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="اكتب رسالتك هنا..."
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                            fontSize: '0.95rem',
                                            '&::placeholder': {
                                                color: theme.palette.text.secondary,
                                                opacity: 0.7,
                                            }
                                        }
                                    }}
                                    sx={{ flex: 1 }}
                                />

                                <IconButton
                                    color="primary"
                                    onClick={handleSend}
                                    disabled={uploading || !draft.trim()}
                                    sx={{
                                        bgcolor: draft.trim() ? theme.palette.primary.main : 'transparent',
                                        color: draft.trim() ? '#fff' : theme.palette.primary.main,
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            bgcolor: draft.trim() ? theme.palette.primary.dark : theme.palette.primary.main + '15',
                                            transform: draft.trim() ? 'scale(1.1)' : 'scale(1.05)',
                                        },
                                        '&:disabled': {
                                            bgcolor: 'transparent',
                                            color: theme.palette.action.disabled,
                                        }
                                    }}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Box>

                            {uploading && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mt: 1,
                                    color: 'text.secondary'
                                }}>
                                    <CircularProgress size={16} />
                                    <Typography variant="caption">جاري الرفع...</Typography>
                                </Box>
                            )}
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
