import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, Paper, InputBase, useTheme, Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Send as SendIcon } from '@mui/icons-material';
import {t} from '../../i18n';

export default function ChatWindow({ selectedChat, messages, onSendMessage, isMobile, onBack, messagesEndRef, onlineUsers = [] }) {
  const theme = useTheme();
  const [messageInput, setMessageInput] = useState('');

  // Move useEffect inside the component body, BEFORE the return
  useEffect(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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

  const isUserOnline = (chat) => {
    const userId = chat?.otherUserId || chat?.userId || chat?.sellerId || chat?.buyerId || chat?.otherUser?.id || chat?.user?.id;
    return userId && onlineUsers.includes(userId.toString());
  };

  const isMessageFromMe = (message) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const myId = Number(localStorage.getItem('userId')) || Number(currentUser.userId) || Number(currentUser.id);
    const senderId = Number(message.senderId);
    return senderId === myId;
  };

  if (!selectedChat) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: theme.palette.background.default, ...(isMobile ? { width: '100%' } : { width: '70%' }) }}>
        <Typography variant="h6" color="text.secondary">{t('selectConversation')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.default, ...(isMobile ? { width: '100%' } : { width: '70%' }) }}>
      
      {/* Chat Header */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: theme.palette.background.paper, borderBottom: `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
        {isMobile && <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>}
        <Badge color="success" variant={isUserOnline(selectedChat) ? "dot" : "standard"} overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Avatar src={selectedChat?.avatar} sx={{ width: 40, height: 40 }} />
        </Badge>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {selectedChat?.name || selectedChat?.otherUserName || `${t('conversation')} #${selectedChat?.id}`}
          </Typography> 
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages?.map((message) => {
          const isMe = isMessageFromMe(message);
          return (
            <Box key={message.id || Math.random()} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', width: '100%' }}>
              <Paper sx={{
                p: 1.5,
                maxWidth: '70%',
                bgcolor: isMe ? theme.palette.primary.main : theme.palette.background.paper,
                color: isMe ? theme.palette.primary.contrastText : theme.palette.text.primary,
                borderRadius: isMe ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
                boxShadow: 1
              }}>
                <Typography variant="body2">{message.text}</Typography>
              </Paper>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}`, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InputBase
            fullWidth
            placeholder={t('writeMessage')}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ flex: 1, p: 1, bgcolor: theme.palette.action.hover, borderRadius: 2 }}
          />
          <Fab color="primary" size="small" onClick={handleSendMessage} disabled={!messageInput.trim()} sx={{ boxShadow: 'none' }}>
            <SendIcon />
          </Fab>
        </Box>
      </Paper>
    </Box>
  );
}