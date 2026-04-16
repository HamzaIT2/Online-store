import React, { useState, useEffect, useMemo, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Paper,
  InputBase,
  useTheme,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon,
  Info as InfoIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatDateLabel = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|bmp|svg)$/i;
const isImageFile = (url, mimeType) => {
  if (mimeType?.startsWith?.('image/')) return true;
  if (typeof url === 'string') return IMAGE_EXTENSIONS.test(url.split('?')[0]);
  return false;
};

const resolveAttachmentUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const baseURL = axiosInstance.defaults.baseURL || '';
    const origin = baseURL ? new URL(baseURL, window.location.origin).origin : window.location.origin;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${path}`;
  } catch {
    return url;
  }
};

export default function ChatWindow({
  selectedChat,
  messages,
  onSendMessage,
  onFileUpload,
  isMobile,
  onBack,
  messagesEndRef,
  onlineUsers = []
}) {
  const theme = useTheme();
  const [messageInput, setMessageInput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const messagesContainerRef = useRef(null);

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files?.length && onFileUpload) {
      onFileUpload(Array.from(files));
    }
    e.target.value = '';
  };

  const isUserOnline = (chat) => {
    const userId = chat?.otherUserId ?? chat?.userId ?? chat?.sellerId ?? chat?.buyerId ?? chat?.otherUser?.id ?? chat?.user?.id;
    if (!userId) return false;
    const onlineStr = (onlineUsers || []).map(id => String(id));
    return onlineStr.includes(String(userId));
  };

  // Auto-scroll to bottom when messages change (scrolls only the messages container)
  useEffect(() => {
    if (messagesEndRef?.current && messagesContainerRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, messagesEndRef]);

  const handleSendMessage = () => {
    if (messageInput.trim() && onSendMessage) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '؟';
  };

  const getConversationName = (chat) => {
    return chat?.name || chat?.otherUserName || chat?.title || `محادثة #${chat?.id}`;
  };

  const getConversationAvatar = (chat) => {
    return chat?.avatar || chat?.otherUserAvatar || chat?.imageUrl;
  };

  const isMessageFromMe = (message) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const myId = Number(localStorage.getItem('userId')) || Number(currentUser.userId) || Number(currentUser.id) || Number(currentUser._id);
    const senderId = Number(message.senderId);
    return senderId === myId;
  };

  // Group messages with date separators
  const messagesWithSeparators = useMemo(() => {
    const result = [];
    let lastDate = null;
    (messages || []).forEach((msg) => {
      const msgDate = msg.createdAt || msg.timestamp;
      const msgDateStr = msgDate ? new Date(msgDate).toDateString() : '';
      if (msgDateStr && msgDateStr !== lastDate) {
        lastDate = msgDateStr;
        result.push({ type: 'separator', date: msgDate });
      }
      result.push({ type: 'message', ...msg });
    });
    return result;
  }, [messages]);

  if (!selectedChat) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.background.default,
          ...(isMobile ? { width: '100%' } : { width: '70%' })
        }}
      >
        <Typography variant="h6" color="text.secondary">
          اختر محادثة لبدء الدردشة
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.default,
        ...(isMobile ? { width: '100%' } : { width: '70%' })
      }}
    >
      {/* Chat Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRadius: 0
        }}
      >
        {isMobile && (
          <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Badge
          color={isUserOnline(selectedChat) ? 'success' : 'default'}
          variant="dot"
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Avatar src={getConversationAvatar(selectedChat)} sx={{ width: 40, height: 40 }}>
            {getInitials(getConversationName(selectedChat))}
          </Avatar>
        </Badge>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {getConversationName(selectedChat)}
          </Typography>
          <Typography variant="caption" color={isUserOnline(selectedChat) ? 'success.main' : 'text.secondary'}>
            {isUserOnline(selectedChat) ? 'متصل الآن' : 'غير متصل'}
          </Typography>
        </Box>
        <IconButton color="primary" onClick={() => setSnackbar({ open: true, message: 'Calling feature coming soon...' })}>
          <PhoneIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => setSnackbar({ open: true, message: 'Video call feature coming soon...' })}>
          <VideocamIcon />
        </IconButton>
        <IconButton color="primary"><InfoIcon /></IconButton>
        <IconButton><MoreVertIcon /></IconButton>
      </Paper>

      {/* Messages Area */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.02) 0%, transparent 70%)'
        }}
      >
        {messagesWithSeparators.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <Box key={`sep-${item.date}`} sx={{ display: 'flex', justifyContent: 'center', py: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    fontWeight: 500
                  }}
                >
                  — {formatDateLabel(item.date)} —
                </Typography>
              </Box>
            );
          }
          const message = item;
          const isMe = isMessageFromMe(message);
          return (
            <Box
              key={message.id ? `msg-${message.id}` : message._id ? `msg-${message._id}` : `temp-${index}`}
              sx={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: '75%',
                  '&::before': isMe
                    ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        right: -6,
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid',
                        borderLeftColor: theme.palette.primary.main,
                        borderBottom: '6px solid transparent',
                        borderTop: '6px solid transparent'
                      }
                    : {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        left: -6,
                        width: 0,
                        height: 0,
                        borderRight: '8px solid',
                        borderRightColor: theme.palette.background.paper,
                        borderBottom: '6px solid transparent',
                        borderTop: '6px solid transparent'
                      }
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    px: 2,
                    borderRadius: '18px',
                    borderBottomRightRadius: isMe ? 4 : 18,
                    borderBottomLeftRadius: isMe ? 18 : 4,
                    bgcolor: isMe ? theme.palette.primary.main : theme.palette.background.paper,
                    color: isMe ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: !isMe ? `1px solid ${theme.palette.divider}` : 'none',
                    opacity: message.pending ? 0.85 : 1
                  }}
                >
                  {(message.attachmentUrl || message.imageUrl) && (
                    <Box sx={{ mb: message.text || message.content ? 1 : 0 }}>
                      {isImageFile(message.attachmentUrl || message.imageUrl, message.mimeType) ? (
                        <Box
                          component="img"
                          src={resolveAttachmentUrl(message.attachmentUrl || message.imageUrl)}
                          alt={message.attachmentName || 'Attachment'}
                          sx={{
                            maxWidth: 200,
                            maxHeight: 200,
                            borderRadius: 1,
                            display: 'block',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <Box
                          component="a"
                          href={resolveAttachmentUrl(message.attachmentUrl || message.imageUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'inherit',
                            textDecoration: 'none',
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            bgcolor: 'rgba(0,0,0,0.08)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.12)' }
                          }}
                        >
                          <FileIcon sx={{ fontSize: 20 }} />
                          <Typography variant="caption" noWrap sx={{ maxWidth: 150 }}>
                            {message.attachmentName || 'Download file'}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                  {(message.text || message.content) && (
                    <Typography variant="body2" sx={{ lineHeight: 1.5, pr: 1 }}>
                      {message.text || message.content}
                    </Typography>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      mt: 0.5
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.65rem',
                        opacity: 0.85
                      }}
                    >
                      {formatTime(message.createdAt || message.timestamp)}
                    </Typography>
                    {isMe && (
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        {message.read ? '✓✓' : message.pending ? '⏳' : '✓'}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton component="label" color="primary">
            <AttachIcon />
            <input type="file" hidden multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileInputChange} />
          </IconButton>
          <InputBase
            fullWidth
            placeholder="اكتب رسالتك..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              flex: 1,
              p: 1,
              bgcolor: 'action.hover',
              borderRadius: '24px',
              border: `1px solid ${theme.palette.divider}`,
              '&:focus-within': { borderColor: theme.palette.primary.main }
            }}
          />
          <Fab
            color="primary"
            size="small"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            sx={{ width: 44, height: 44, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            <SendIcon />
          </Fab>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
