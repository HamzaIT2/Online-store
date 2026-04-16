// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   IconButton,
//   Avatar,
//   Badge,
//   Paper,
//   InputBase,
//   useTheme,
//   Fab,
//   Divider
// } from '@mui/material';
// import {
//   ArrowBack as ArrowBackIcon,
//   Send as SendIcon,
//   EmojiEmotions as EmojiIcon,
//   AttachFile as AttachIcon,
//   MoreVert as MoreVertIcon,
//   Phone as PhoneIcon,
//   Videocam as VideocamIcon,
//   Info as InfoIcon
// } from '@mui/icons-material';

// export default function ChatWindow({
//   selectedChat,
//   messages,
//   onSendMessage,
//   isMobile,
//   onBack,
//   messagesEndRef,
//   onlineUsers = []
// }) {
//   const theme = useTheme();
//   const [messageInput, setMessageInput] = useState('');

//   const handleSendMessage = () => {
//     if (messageInput.trim() && onSendMessage) {
//       onSendMessage(messageInput.trim());
//       setMessageInput('');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp) => {
//     if (!timestamp) return '';

//     const date = new Date(timestamp);
//     return date.toLocaleTimeString('ar', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const getInitials = (name) => {
//     return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '؟';
//   };

//   const getConversationName = (chat) => {
//     return chat?.name || chat?.otherUserName || chat?.title || `محادثة #${chat?.id}`;
//   };

//   const getConversationAvatar = (chat) => {
//     return chat?.avatar || chat?.otherUserAvatar || chat?.imageUrl;
//   };

//   const isUserOnline = (chat) => {
//     // Check various possible user ID fields
//     const userId = chat?.otherUserId ||
//       chat?.userId ||
//       chat?.sellerId ||
//       chat?.buyerId ||
//       chat?.otherUser?.id ||
//       chat?.user?.id;

//     return userId && onlineUsers.includes(userId.toString());
//   };

//   const isMessageFromMe = (message) => {
//     // Get current user from localStorage
//     const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

//     // Strictly use: const isMe = message.senderId === currentUser.userId;
//     const isMe = message.senderId === currentUser.userId;

//     return isMe;
//   };

//   if (!selectedChat) {
//     return (
//       <Box
//         sx={{
//           height: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           bgcolor: theme.palette.background.default,
//           ...(isMobile ? { width: '100%' } : { width: '70%' })
//         }}
//       >
//         <Typography variant="h6" color="text.secondary">
//           اختر محادثة لبدء الدردشة
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         height: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         bgcolor: theme.palette.background.default,
//         ...(isMobile ? { width: '100%' } : { width: '70%' })
//       }}
//     >
//       {/* Chat Header */}
//       <Paper
//         sx={{
//           p: 2,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 2,
//           bgcolor: theme.palette.background.paper,
//           borderBottom: `1px solid ${theme.palette.divider}`,
//           borderRadius: 0
//         }}
//       >
//         {isMobile && (
//           <IconButton onClick={onBack}>
//             <ArrowBackIcon />
//           </IconButton>
//         )}

//         <Badge
//           color="success"
//           variant="dot"
//           overlap="circular"
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//           <Avatar
//             src={getConversationAvatar(selectedChat)}
//             sx={{ width: 40, height: 40 }}
//           >
//             {getInitials(getConversationName(selectedChat))}
//           </Avatar>
//         </Badge>

//         <Box sx={{ flex: 1 }}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//             {getConversationName(selectedChat)}
//           </Typography>
//           <Typography variant="caption" color={isUserOnline(selectedChat) ? 'success.main' : 'text.secondary'}>
//             {isUserOnline(selectedChat) ? 'متصل الآن' : 'غير متصل'}
//           </Typography>
//         </Box>

//         <IconButton color="primary">
//           <PhoneIcon />
//         </IconButton>
//         <IconButton color="primary">
//           <VideocamIcon />
//         </IconButton>
//         <IconButton color="primary">
//           <InfoIcon />
//         </IconButton>
//         <IconButton>
//           <MoreVertIcon />
//         </IconButton>
//       </Paper>

//       {/* Messages Area */}
//       <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
//         {messages?.map((message) => (
//           <Box
//             key={message.id || message._id || Date.now()}
//             sx={{
//               display: 'flex',
//               justifyContent: isMessageFromMe(message) ? 'flex-end' : 'flex-start',
//               maxWidth: '70%'
//             }}
//           >
//             <Paper
//               sx={{
//                 p: 2,
//                 bgcolor: isMessageFromMe(message)
//                   ? theme.palette.primary.main
//                   : theme.palette.background.paper,
//                 color: isMessageFromMe(message)
//                   ? theme.palette.primary.contrastText
//                   : theme.palette.text.primary,
//                 borderRadius: 2,
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                 border: !isMessageFromMe(message)
//                   ? `1px solid ${theme.palette.divider}`
//                   : 'none',
//                 position: 'relative',
//                 opacity: message.pending ? 0.7 : 1
//               }}
//             >
//               <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
//                 {message.text}
//               </Typography>

//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: isMessageFromMe(message) ? 'flex-end' : 'flex-start',
//                   gap: 0.5,
//                   mt: 0.5
//                 }}
//               >
//                 <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
//                   {formatTime(message.createdAt || message.timestamp)}
//                 </Typography>
//                 {isMessageFromMe(message) && (
//                   <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
//                     {message.read ? '✓✓' : message.pending ? '⏳' : '✓'}
//                   </Typography>
//                 )}
//               </Box>
//             </Paper>
//           </Box>
//         ))}
//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Input Area */}
//       <Paper
//         sx={{
//           p: 2,
//           bgcolor: theme.palette.background.paper,
//           borderTop: `1px solid ${theme.palette.divider}`,
//           borderRadius: 0
//         }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <IconButton color="primary">
//             <AttachIcon />
//           </IconButton>

//           <InputBase
//             fullWidth
//             placeholder="اكتب رسالتك..."
//             value={messageInput}
//             onChange={(e) => setMessageInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             sx={{
//               flex: 1,
//               p: 1,
//               bgcolor: theme.palette.action.hover,
//               borderRadius: 2,
//               border: `1px solid ${theme.palette.divider}`,
//               '&:focus-within': {
//                 borderColor: theme.palette.primary.main,
//               }
//             }}
//           />

//           <IconButton color="primary">
//             <EmojiIcon />
//           </IconButton>

//           <Fab
//             color="primary"
//             size="small"
//             onClick={handleSendMessage}
//             disabled={!messageInput.trim()}
//             sx={{
//               width: 40,
//               height: 40,
//               boxShadow: 'none'
//             }}
//           >
//             <SendIcon />
//           </Fab>
//         </Box>
//       </Paper>
//     </Box>
//   );

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (messagesEndRef?.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);
// }


//========================================================================




import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Avatar, Badge, Paper, InputBase, useTheme, Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Send as SendIcon, EmojiEmotions as EmojiIcon, AttachFile as AttachIcon, MoreVert as MoreVertIcon, Phone as PhoneIcon, Videocam as VideocamIcon, Info as InfoIcon } from '@mui/icons-material';

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
        <Typography variant="h6" color="text.secondary">اختر محادثة لبدء الدردشة</Typography>
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
            {selectedChat?.name || selectedChat?.otherUserName || `محادثة #${selectedChat?.id}`}
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
            placeholder="اكتب رسالتك..."
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