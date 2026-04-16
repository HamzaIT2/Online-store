import { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress, Avatar, useTheme } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function ChatThread({ messages, loading, error, currentUserId }) {
  const theme = useTheme();
  const bottomRef = useRef(null);
  const isDark = theme.palette.mode === 'dark';
  const [userCache, setUserCache] = useState({});

  // Fetch user data when messages change
  useEffect(() => {
    const fetchUserData = async () => {
      const newCache = { ...userCache };
      const userIds = new Set();

      // Collect all unique sender IDs
      messages.forEach(msg => {
        const senderId = msg.senderId || msg.sender_id || msg.fromUserId || msg.sender?.id || msg.user?.id || msg.fromUser?.id;
        if (senderId && senderId !== currentUserId) {
          userIds.add(senderId);
        }
      });

      // Fetch user data for each unique sender
      for (const userId of userIds) {
        if (!newCache[userId]) {


          // Try multiple endpoints based on your API
          const endpoints = [
            `/users/${userId}`,
            `/users?page=1&limit=20`
          ];

          for (const endpoint of endpoints) {
            try {

              const response = await axiosInstance.get(endpoint);


              let userData = response.data;

              // If it's a list endpoint, find the user in the list
              if (endpoint.includes('page=') && userData.users && Array.isArray(userData.users)) {
                userData = userData.users.find(user =>
                  user.id === userId ||
                  user.userId === userId ||
                  user.uid === userId
                );

              }

              if (userData) {
                newCache[userId] = userData;
                break; // Success, stop trying other endpoints
              }
            } catch (error) {

            }
          }
        }
      }

      setUserCache(newCache);
    };

    if (messages && messages.length > 0) {
      fetchUserData();
    }
  }, [messages, currentUserId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  if (!messages) messages = [];

  const senderGradient = isDark
    ? "linear-gradient(135deg, #0b1d39 0%, #0f2b66 50%, #143873 100%)"
    : "linear-gradient(135deg, #0f2b66 0%, #154384 50%, #1b4f99 100%)";

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
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
  };

  const groupMessagesByDate = (messages) => {
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
  };

  const resolveUserAvatar = (msg) => {
    const senderId = msg.senderId || msg.sender_id || msg.fromUserId;

    // Try to get user from cache first
    if (senderId && userCache[senderId]) {
      const user = userCache[senderId];


      const avatar = user.avatar || user.profileImage || user.photo || user.image ||
        user.avatarUrl || user.imageUrl || user.photoUrl || user.pictureUrl;

      if (avatar) {

        return processAvatarUrl(avatar);
      }
    }

    // Fallback to message data
    const user = msg.sender || msg.user || msg.fromUser;



    if (!user) return null;

    const avatar = user.avatar || user.profileImage || user.photo || user.image ||
      user.avatarUrl || user.imageUrl || user.photoUrl || user.pictureUrl;



    if (!avatar) return null;

    return processAvatarUrl(avatar);
  };

  const processAvatarUrl = (candidate) => {
    try {
      const str = String(candidate);
      const hasProtocol = /^https?:\/\//i.test(str);
      if (hasProtocol) return str;

      const origin = new URL(axiosInstance.defaults.baseURL).origin;
      if (str.startsWith('/')) return origin + str;

      return origin + '/' + str.replace(/^\.\//, '');
    } catch (error) {

    }
    return candidate;
  };

  const getUserName = (msg) => {
    const senderId = msg.senderId || msg.sender_id || msg.fromUserId;

    // Try to get user from cache first
    if (senderId && userCache[senderId]) {
      const user = userCache[senderId];
      return user.fullName || user.username || user.name || 'مستخدم';
    }

    // Fallback to message data
    const user = msg.sender || msg.user || msg.fromUser;
    if (user) {
      return user.fullName || user.username || user.name || 'مستخدم';
    }
    return msg.senderName || msg.fromName || 'مستخدم';
  };

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
        <Typography variant="body2" color="text.secondary" textAlign="center">{String(error)}</Typography>
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <Box sx={{
      p: 2,
      height: '100%',
      overflowY: 'auto',
      background: isDark
        ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
        : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
    }}>
      {messageGroups.map((group, groupIdx) => (
        <Box key={groupIdx}>
          {/* Date separator */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            my: 2,
            position: 'relative'
          }}>
            <Typography
              variant="caption"
              sx={{
                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                color: 'text.secondary',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
              }}
            >
              {formatDate(group.date)}
            </Typography>
          </Box>

          {/* Messages in this group */}
          {group.messages.map((msg, idx) => {
            const isString = (typeof msg === 'string');
            const msgData = isString ? { text: msg } : msg || {};
            const nestedText = msgData.message?.text ?? msgData.content?.text ?? msgData.body?.text ?? msgData.data?.text ?? msgData.payload?.text ?? msgData.content?.message ?? msgData.payload?.message;
            let msgText = (msgData.text ?? msgData.content ?? nestedText ?? msgData.message ?? msgData.body ?? msgData.msg ?? "");
            const nestedImg = msgData.message?.imageUrl ?? msgData.message?.image_url ?? msgData.content?.imageUrl ?? msgData.content?.image_url ?? msgData.data?.imageUrl ?? msgData.data?.image_url;
            let imgUrl = (msgData.imageUrl ?? msgData.image_url ?? msgData.image ?? msgData.url ?? msgData.fileUrl ?? msgData.attachmentUrl ?? msgData.mediaUrl ?? msgData.attachment?.url ?? nestedImg ?? null);
            const ts = (msgData.createdAt ?? msgData.created_at ?? msgData.timestamp ?? msgData.date ?? Date.now());
            const sender = (msgData.senderId ?? msgData.sender_id ?? msgData.fromUserId ?? msgData.sender?.id);
            const isMe = sender === currentUserId;

            // If there's no explicit image field, but text contains a URL, extract it
            if (!imgUrl && typeof msgText === 'string') {
              const s = msgText.trim();
              const urlMatch = s.match(/(https?:\/\/[^\s]+|\/?uploads\/[^\s]+)/i);
              let candidate = urlMatch ? urlMatch[1] : null;
              if (candidate && !candidate.startsWith('http') && !candidate.startsWith('/')) candidate = '/' + candidate;
              if (candidate) {
                const looksLikeImg = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(candidate) || candidate.startsWith('/uploads/') || candidate.includes('/uploads/');
                if (looksLikeImg) imgUrl = candidate;
              }
            }

            if (!imgUrl && (!msgText || (typeof msgText !== 'string'))) {
              try {
                for (const [k, v] of Object.entries(msgData)) {
                  if (typeof v === 'string' && v.trim()) { msgText = v; break; }
                  if (v && typeof v === 'object') {
                    for (const [k2, v2] of Object.entries(v)) {
                      if (typeof v2 === 'string' && v2.trim()) { msgText = v2; break; }
                    }
                  }
                  if (msgText) break;
                }
              } catch { }
            }

            // Normalize uploads path to absolute URL
            let finalImg = imgUrl;
            if (finalImg && !/^https?:\/\//i.test(finalImg)) {
              try {
                const origin = new URL(axiosInstance.defaults.baseURL).origin;
                finalImg = origin + (finalImg.startsWith('/') ? finalImg : `/${finalImg}`);
              } catch { }
            }

            // If not image, but text contains a URL, make it clickable
            let finalLink = null;
            if (!finalImg && typeof msgText === 'string') {
              const urlMatch = msgText.match(/(https?:\/\/[^\s]+|\/?uploads\/[^\s]+)/i);
              if (urlMatch) {
                finalLink = urlMatch[1];
                if (finalLink && !finalLink.startsWith('http') && !finalLink.startsWith('/')) finalLink = '/' + finalLink;
                if (!/^https?:\/\//i.test(finalLink)) {
                  try {
                    const origin = new URL(axiosInstance.defaults.baseURL).origin;
                    finalLink = origin + (finalLink.startsWith('/') ? finalLink : `/${finalLink}`);
                  } catch { }
                }
              }
            }

            const userAvatar = resolveUserAvatar(msgData);
            const userName = getUserName(msgData);

            return (
              <Box
                key={msgData.id ?? `${msgData.chatId || 'c'}-${ts}-${idx}`}
                sx={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                  alignItems: 'flex-end',
                  gap: 1
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
                    {!userAvatar && getInitials(userName)}
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
                    background: isMe ? senderGradient : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)'),
                    color: isMe ? '#fff' : (isDark ? 'rgba(255,255,255,0.9)' : theme.palette.text.primary),
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    borderTopLeftRadius: isMe ? 16 : 4,
                    borderTopRightRadius: isMe ? 4 : 16,
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    boxShadow: isMe
                      ? '0 4px 12px rgba(20,56,115,0.3)'
                      : isDark
                        ? '0 2px 8px rgba(0,0,0,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.08)',
                    border: isMe ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: isMe
                        ? '0 6px 16px rgba(20,56,115,0.4)'
                        : isDark
                          ? '0 4px 12px rgba(0,0,0,0.3)'
                          : '0 4px 12px rgba(0,0,0,0.12)',
                    }
                  }}>
                    {(msgData.type === 'image' || finalImg) ? (
                      <Box>
                        <img
                          alt="صورة"
                          src={finalImg}
                          style={{
                            maxWidth: '100%',
                            borderRadius: 8,
                            cursor: 'pointer',
                            display: 'block'
                          }}
                          onClick={() => window.open(finalImg, '_blank')}
                        />
                        {msgText && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {String(msgText)}
                          </Typography>
                        )}
                      </Box>
                    ) : finalLink ? (
                      <Typography
                        variant="body2"
                        component="a"
                        href={finalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: isMe ? '#fff' : theme.palette.primary.main,
                          textDecoration: 'underline',
                          wordBreak: 'break-all'
                        }}
                      >
                        {finalLink}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {String(msgText)}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.7,
                        fontSize: '0.65rem',
                        mt: 0.5,
                        display: 'block',
                        textAlign: isMe ? 'left' : 'right'
                      }}
                    >
                      {formatTime(ts)}
                    </Typography>
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
                    {!userAvatar && getInitials('أنا')}
                  </Avatar>
                )}
              </Box>
            );
          })}
        </Box>
      ))}

      <div ref={bottomRef} />
    </Box>
  );
}
