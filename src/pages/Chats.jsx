import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, Avatar, TextField, IconButton, List, ListItemButton,
  ListItemAvatar, ListItemText, Divider, useMediaQuery, Container, CircularProgress
} from "@mui/material";
import {
  Send as SendIcon, Image as ImageIcon, AttachFile,
  ArrowBack, MoreVert, Circle as CircleIcon
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { listChats, getChatMessages, sendMessage } from "../api/messagesAPI";
import axiosInstance from "../api/axiosInstance";
import { t } from "../i18n";

// --- تنسيق المكونات (Styled Components) ---

// الحاوية الرئيسية
const ChatLayout = styled(Paper)(({ theme }) => ({
  display: 'flex',
  height: 'calc(100vh - 100px)', // ارتفاع متناسب مع الشاشة
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.divider}`,
  marginTop: theme.spacing(4),
}));

// القائمة الجانبية (تم إصلاح تمرير isOpen)
const Sidebar = styled(Box, { shouldForwardProp: (prop) => prop !== 'isOpen' })(({ theme, isOpen }) => ({
  width: 350,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    display: isOpen ? 'flex' : 'none', // إخفاء القائمة عند فتح المحادثة في الموبايل
  },
}));

// منطقة الدردشة (تم إصلاح تمرير isOpen)
const ChatArea = styled(Box, { shouldForwardProp: (prop) => prop !== 'isOpen' })(({ theme, isOpen }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f0f2f5',
  backgroundImage: theme.palette.mode === 'light' ? 'url("https://www.transparenttextures.com/patterns/subtle-white-feathers.png")' : 'none',
  [theme.breakpoints.down('md')]: {
    display: !isOpen ? 'flex' : 'none',
  },
}));

// فقاعة الرسالة (تم إصلاح تمرير isMe)
const MessageBubble = styled(Box, { shouldForwardProp: (prop) => prop !== 'isMe' })(({ theme, isMe }) => ({
  maxWidth: '75%',
  padding: '10px 16px',
  borderRadius: 18,
  position: 'relative',
  fontSize: '0.95rem',
  marginBottom: 8,
  wordBreak: 'break-word',
  // ألوان مختلفة للمرسل والمستقبل
  backgroundColor: isMe ? theme.palette.primary.main : theme.palette.background.paper,
  color: isMe ? '#fff' : theme.palette.text.primary,
  alignSelf: isMe ? 'flex-end' : 'flex-start',
  boxShadow: theme.shadows[1],
  // شكل الذيل
  borderTopRightRadius: isMe ? 0 : 18,
  borderTopLeftRadius: isMe ? 18 : 0,
}));

export default function Chats() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [draft, setDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. معرفة المستخدم الحالي
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axiosInstance.get('/users/profile');
        setCurrentUserId(res.data?.id || res.data?.userId);
      } catch (e) { console.error(e); }
    };
    fetchMe();
  }, []);

  // 2. تحميل قائمة المحادثات
  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await listChats();
        const list = Array.isArray(res.data) ? res.data : (res.data?.items || []);
        setChats(list);

        const params = new URLSearchParams(location.search);
        const chatId = params.get('chatId');
        if (chatId) {
          const target = list.find(c => String(c.id) === chatId || String(c.conversationId) === chatId);
          if (target) setCurrentChat(target);
        }
      } catch (e) { console.error("Load chats error", e); }
    };
    loadChats();
  }, [location.search]);

  // 3. تحميل الرسائل
  useEffect(() => {
    if (!currentChat) return;
    const loadMsgs = async () => {
      try {
        const chatId = currentChat.id || currentChat.conversationId;
        const res = await getChatMessages(chatId);
        setMessages(Array.isArray(res.data) ? res.data : (res.data?.items || []));
        scrollToBottom();
      } catch (e) { console.error(e); }
    };
    loadMsgs();

    const interval = setInterval(loadMsgs, 3000);
    return () => clearInterval(interval);
  }, [currentChat]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // 4. إرسال النص
  const handleSend = async () => {
    if (!draft.trim() || !currentChat) return;
    const chatId = currentChat.id || currentChat.conversationId;

    const tempMsg = {
      id: Date.now(),
      content: draft,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isTemp: true
    };
    setMessages(prev => [...prev, tempMsg]);
    setDraft("");
    scrollToBottom();

    try {
      await sendMessage(chatId, { type: 'text', text: tempMsg.content });
      const res = await getChatMessages(chatId);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Send failed", e);
    }
  };

  // 5. رفع الصور
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentChat) return;

    const chatId = currentChat.id || currentChat.conversationId;
    setUploading(true);

    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await axiosInstance.post(`/chats/${chatId}/attachments`, fd);
      const data = res.data || {};
      const url = data.url || data.imageUrl || data.path;

      if (url) {
        await sendMessage(chatId, { type: 'image', imageUrl: url });
        const refresh = await getChatMessages(chatId);
        setMessages(Array.isArray(refresh.data) ? refresh.data : []);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const getChatInfo = (chat) => {
    if (!chat) return { name: "مستخدم", avatar: "" };

    if (chat.participants && Array.isArray(chat.participants) && currentUserId) {
      const other = chat.participants.find(p => String(p.id) !== String(currentUserId));
      if (other) return { name: other.fullName || other.username, avatar: other.avatar || other.profileImage };
    }

    return {
      name: chat.otherUser?.fullName || chat.title || "مستخدم",
      avatar: chat.otherUser?.avatar || chat.image || ""
    };
  };

  const renderBubble = (msg) => {
    const isMe = String(msg.senderId) === String(currentUserId);
    const isImage = msg.type === 'image' || (msg.content && (msg.content.startsWith('http') && msg.content.match(/\.(jpeg|jpg|gif|png|webp)$/i)));


    const getOtherParty = (chat) => {
      if (!chat || !currentUserId) return { name: "مستخدم", image: "" };

      // 1. إذا كانت البيانات تأتي بصيغة Buyer/Seller
      if (chat.seller && chat.buyer) {
        // إذا كنت أنا البائع، فالطرف الآخر هو المشتري، والعكس صحيح
        // نستخدم == للمقارنة لأن الآيدي قد يكون نصاً أو رقماً
        if (chat.seller.id == currentUserId || chat.sellerId == currentUserId) {
          return {
            name: chat.buyer.fullName || chat.buyer.username || "المشتري",
            image: chat.buyer.profileImage
          };
        } else {
          return {
            name: chat.seller.fullName || chat.seller.username || "البائع",
            image: chat.seller.profileImage
          };
        }
      }

      // 2. إذا كانت البيانات تأتي مصفوفة Participants (users)
      if (chat.users && Array.isArray(chat.users)) {
        const otherUser = chat.users.find(u => u.id != currentUserId && u.userId != currentUserId);
        if (otherUser) {
          return {
            name: otherUser.fullName || otherUser.username || "مستخدم",
            image: otherUser.profileImage
          };
        }
      }

      return { name: "مستخدم غير معروف", image: "" };
    };







    return (
      <MessageBubble key={msg.id || Date.now()} isMe={isMe}>
        {isImage ? (
          <Box
            component="img"
            src={msg.content || msg.imageUrl}
            sx={{ maxWidth: '100%', borderRadius: 2, cursor: 'pointer', maxHeight: 300 }}
            onClick={() => window.open(msg.content || msg.imageUrl, '_blank')}
          />
        ) : (
          <Typography variant="body1">{msg.content || msg.text}</Typography>
        )}
        <Typography variant="caption" sx={{ display: 'block', textAlign: isMe ? 'left' : 'right', mt: 0.5, opacity: 0.7, fontSize: '0.7rem' }}>
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Typography>
      </MessageBubble>
    );
  };

  const currentChatInfo = getChatInfo(currentChat);


  return (
    <Container maxWidth="xl" sx={{ p: { xs: 0, md: 2 }, mt: { xs: 8, md: 4 } }}>
      <ChatLayout elevation={3}>
        {/* --- القائمة الجانبية --- */}
        <Sidebar isOpen={!currentChat}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
            <Typography variant="h6" fontWeight="bold">{t('messages') || 'الرسائل'}</Typography>
          </Box>
          <List sx={{ flex: 1, overflowY: 'auto' }}>
            {chats.map(chat => {
              const info = getChatInfo(chat);
              return (
                <div key={chat.id || chat.conversationId}>
                  <ListItemButton
                    selected={currentChat?.id === chat.id}
                    onClick={() => setCurrentChat(chat)}
                    sx={{ borderRadius: 0 }}
                  >
                    <ListItemAvatar>
                      <Avatar src={info.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={info.name}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                      secondary={chat.lastMessage?.content || t('no_messages') || "..."}
                      secondaryTypographyProps={{ noWrap: true, fontSize: 13 }}
                    />
                    {chat.unreadCount > 0 && <CircleIcon color="primary" sx={{ fontSize: 12 }} />}
                  </ListItemButton>
                  <Divider component="li" />
                </div>
              );
            })}
            {chats.length === 0 && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">{t('no_chats') || 'لا توجد محادثات'}</Typography>
              </Box>
            )}
          </List>
        </Sidebar>

        {/* --- منطقة المحادثة --- */}
        {currentChat ? (
          <ChatArea isOpen={!!currentChat}>
            {/* رأس المحادثة */}
            <Paper square elevation={1} sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isMobile && (
                  <IconButton onClick={() => setCurrentChat(null)}>
                    <ArrowBack />
                  </IconButton>
                )}
                <Avatar src={currentChatInfo.avatar} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {currentChatInfo.name}
                  </Typography>
                </Box>
              </Box>
              <IconButton><MoreVert /></IconButton>
            </Paper>

            {/* جسم الرسائل */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {messages.map(renderBubble)}
              <div ref={messagesEndRef} />
            </Box>

            {/* منطقة الكتابة */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>

                {/* زر الصور */}
                <IconButton color="primary" component="label" disabled={uploading}>
                  {uploading ? <CircularProgress size={24} /> : <ImageIcon />}
                  <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                </IconButton>

                <IconButton color="primary" disabled={uploading}>
                  <AttachFile />
                </IconButton>

                <TextField
                  fullWidth
                  placeholder={t('type_message') || "اكتب رسالتك..."}
                  variant="outlined"
                  size="small"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 6, bgcolor: 'background.default' }
                  }}
                />

                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' }, width: 40, height: 40 }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </ChatArea>
        ) : (
          <ChatArea isOpen={false} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
            <Box textAlign="center">
              <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                {t('select_chat_start') || 'اختر محادثة للبدء'}
              </Typography>
            </Box>
          </ChatArea>
        )}
      </ChatLayout>
    </Container>
  );
}