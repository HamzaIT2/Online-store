import { memo, useCallback, useMemo } from 'react';
import { Box, Typography, CircularProgress, Avatar, useTheme, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon, Send as SendIcon } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const MessageBubble = memo(({ message, isMe, userAvatar, userName, onRetry, theme }) => {
  const isFailed = message.status === 'failed';
  const isSending = message.status === 'sending';
  const isTemp = message.isTemp;

  const messageContent = useMemo(() => {
    if (message.type === 'image' || message.imageUrl) {
      return (
        <Box>
          <img
            alt="صورة"
            src={message.imageUrl || message.content || message.text}
            style={{
              maxWidth: '100%',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'block'
            }}
            onClick={() => window.open(message.imageUrl || message.content || message.text, '_blank')}
          />
          {message.text && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {message.text}
            </Typography>
          )}
        </Box>
      );
    }

    // ✅ Handle multiple field names for message content
    const text = message.text || message.content || message.message || '';

    // Check if text contains a URL
    const urlMatch = text.match(/(https?:\/\/[^\s]+|\/?uploads\/[^\s]+)/i);
    if (urlMatch) {
      const url = urlMatch[1];
      return (
        <Typography
          variant="body2"
          component="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: isMe ? '#fff' : theme.palette.primary.main,
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }}
        >
          {url}
        </Typography>
      );
    }

    return (
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.5,
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        {text}
      </Typography>
    );
  }, [message, isMe, theme]);

  const formatTime = useCallback((timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ar', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  }, []);

  const senderGradient = useMemo(() => {
    const isDark = theme.palette.mode === 'dark';
    return isDark
      ? "linear-gradient(135deg, #0b1d39 0%, #0f2b66 50%, #143873 100%)"
      : "linear-gradient(135deg, #0f2b66 0%, #154384 50%, #1b4f99 100%)";
  }, [theme]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        mb: 1.5,
        alignItems: 'flex-end',
        gap: 1,
        opacity: isTemp ? 0.7 : 1
      }}
    >
      {!isMe && (
        <Avatar
          src={userAvatar}
          sx={{
            width: 32,
            height: 32,
            bgcolor: userAvatar ? 'transparent' : theme.palette.primary.main,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            border: userAvatar ? `1px solid ${theme.palette.divider}` : 'none',
            flexShrink: 0
          }}
        >
          {!userAvatar && userName?.charAt(0)?.toUpperCase()}
        </Avatar>
      )}

      <Box sx={{ maxWidth: '70%', minWidth: 0 }}>
        {!isMe && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              mb: 0.5,
              ml: 1,
              display: 'block',
              fontSize: '0.7rem',
              fontWeight: 500
            }}
          >
            {userName}
          </Typography>
        )}

        <Box sx={{
          background: isMe ? senderGradient : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)'),
          color: isMe ? '#fff' : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : theme.palette.text.primary),
          px: 2,
          py: 1.2,
          borderRadius: 3,
          borderTopLeftRadius: isMe ? 16 : 4,
          borderTopRightRadius: isMe ? 4 : 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          boxShadow: isMe
            ? '0 4px 12px rgba(20,56,115,0.3)'
            : theme.palette.mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.2)'
              : '0 2px 8px rgba(0,0,0,0.08)',
          border: isMe ? 'none' : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: isMe
              ? '0 6px 16px rgba(20,56,115,0.4)'
              : theme.palette.mode === 'dark'
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.12)',
          }
        }}>
          {messageContent}

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMe ? 'space-between' : 'flex-end',
            mt: 0.5,
            gap: 1
          }}>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                fontSize: '0.65rem',
                textAlign: isMe ? 'left' : 'right'
              }}
            >
              {formatTime(message.createdAt)}
              {isSending && ' • جاري الإرسال...'}
              {isFailed && ' • فشل الإرسال'}
            </Typography>

            {isFailed && isMe && (
              <Tooltip title="إعادة الإرسال">
                <IconButton
                  size="small"
                  onClick={() => onRetry?.(message.id)}
                  sx={{
                    color: 'inherit',
                    opacity: 0.7,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <RefreshIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {isMe && (
        <Avatar
          src={userAvatar}
          sx={{
            width: 32,
            height: 32,
            bgcolor: userAvatar ? 'transparent' : theme.palette.primary.main,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            border: userAvatar ? `1px solid ${theme.palette.divider}` : 'none',
            flexShrink: 0
          }}
        >
          أنا
        </Avatar>
      )}
    </Box>
  );
});

MessageBubble.displayName = 'MessageBubble';

const DateSeparator = memo(({ date, theme }) => {
  const formatDate = useCallback((date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar', {
        day: 'numeric',
        month: 'short'
      });
    }
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      my: 2,
      position: 'relative'
    }}>
      <Typography
        variant="caption"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          color: 'text.secondary',
          fontWeight: 500,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
        }}
      >
        {formatDate(date)}
      </Typography>
    </Box>
  );
});

DateSeparator.displayName = 'DateSeparator';

const TypingIndicator = memo(({ users, theme }) => {
  if (!users || users.size === 0) return null;

  const typingText = users.size === 1 ? 'يكتب الآن...' : 'يكتبون الآن...';

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2,
      py: 1,
      color: 'text.secondary',
      fontSize: '0.85rem',
      fontStyle: 'italic'
    }}>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Box sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.secondary',
          animation: 'typing 1.4s infinite ease-in-out',
          animationDelay: '0s'
        }} />
        <Box sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.secondary',
          animation: 'typing 1.4s infinite ease-in-out',
          animationDelay: '0.2s'
        }} />
        <Box sx={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'text.secondary',
          animation: 'typing 1.4s infinite ease-in-out',
          animationDelay: '0.4s'
        }} />
      </Box>
      {typingText}
    </Box>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

const OptimizedChatThread = memo(({
  messages,
  loading,
  error,
  currentUserId,
  userCache = {},
  typingUsers = new Set(),
  onRetryMessage,
  messagesEndRef,
  theme
}) => {
  const groupMessagesByDate = useCallback((messages) => {
    const groups = {};
    messages.forEach(msg => {
      const date = new Date(msg.createdAt || msg.created_at || msg.timestamp || msg.date || Date.now());
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: date,
          messages: []
        };
      }
      groups[dateKey].messages.push(msg);
    });
    return Object.values(groups);
  }, []);

  const getInitials = useCallback((name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);

  const resolveUserAvatar = useCallback((message) => {
    const senderId = message.senderId || message.sender_id || message.fromUserId;

    if (senderId && userCache[senderId]) {
      const user = userCache[senderId];
      const avatar = user.avatar || user.profileImage || user.photo || user.image ||
        user.avatarUrl || user.imageUrl || user.photoUrl || user.pictureUrl;

      if (avatar) return avatar;
    }

    const user = message.sender || message.user || message.fromUser;
    if (!user) return null;

    return user.avatar || user.profileImage || user.photo || user.image ||
      user.avatarUrl || user.imageUrl || user.photoUrl || user.pictureUrl;
  }, [userCache]);

  const getUserName = useCallback((message) => {
    const senderId = message.senderId || message.sender_id || message.fromUserId;

    if (senderId && userCache[senderId]) {
      const user = userCache[senderId];
      return user.fullName || user.username || user.name || 'مستخدم';
    }

    const user = message.sender || message.user || message.fromUser;
    if (user) {
      return user.fullName || user.username || user.name || 'مستخدم';
    }
    return message.senderName || message.fromName || 'مستخدم';
  }, [userCache]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">جاري تحميل الرسائل...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}>
        <Typography color="error" textAlign="center">حدث خطأ في تحميل الرسائل</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">{error}</Typography>
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate(messages || []);





  return (
    <Box sx={{
      p: 2,
      height: '100%',
      overflowY: 'auto',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
        : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    }}>
      {(!messages || messages.length === 0) && (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
          color: 'text.secondary'
        }}>
          <Typography variant="h6">لا توجد رسائل بعد</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            ابدأ المحادثة بإرسال رسالة
          </Typography>
        </Box>
      )}

      {messageGroups.map((group, groupIdx) => (
        <Box key={groupIdx}>
          <DateSeparator date={group.date} theme={theme} />

          {group.messages.map((message, idx) => {
            // ✅ Fix isMe logic with String() comparison to prevent type mismatch
            const isMe = String(message.senderId || message.sender_id || message.fromUserId) === String(currentUserId);
            const userAvatar = resolveUserAvatar(message);
            const userName = getUserName(message);

            console.log('Rendering message:', {
              id: message.id,
              text: message.text || message.content,
              senderId: message.senderId,
              currentUserId: currentUserId,
              senderIdType: typeof message.senderId,
              currentUserIdType: typeof currentUserId,
              isMe
            });

            return (
              <MessageBubble
                key={message.id || `${message.chatId || 'c'}-${message.createdAt || Date.now()}-${idx}`}
                message={message}
                isMe={isMe}
                userAvatar={userAvatar}
                userName={userName}
                onRetry={onRetryMessage}
                theme={theme}
              />
            );
          })}
        </Box>
      ))}

      <TypingIndicator users={typingUsers} theme={theme} />

      <div ref={messagesEndRef} />

      <style jsx>{`
        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </Box>
  );
});

OptimizedChatThread.displayName = 'OptimizedChatThread';

export default OptimizedChatThread;
