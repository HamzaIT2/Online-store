import { useEffect, useState } from "react";
import { List, ListItemButton, ListItemText, CircularProgress, Box, Badge, ListItemAvatar, Avatar, Typography, useTheme } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function ChatList({ chats, loading, error, selectedId, onSelect, unreadCountMap, currentUserId }) {
  const theme = useTheme();
  const [userCache, setUserCache] = useState({});

  // Fetch user data when chats change
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return; // Don't make API calls for guests

      const newCache = { ...userCache };

      for (const chat of chats) {
        // Try multiple possible user ID fields
        let userId = chat.otherUserId || chat.sellerId || chat.buyerId ||
          chat.otherUser?.id || chat.user?.id || chat.seller?.id || chat.buyer?.id ||
          chat.participants?.find(p => p.id !== currentUserId)?.id;

        console.log('Trying to fetch user for chat ID:', chat.id, 'with user ID:', userId);

        // If no user ID found in chat data, try to get it from messages
        if (!userId) {
          try {
            console.log('No user ID in chat data, fetching messages to find user...');
            const messagesResponse = await axiosInstance.get(`/chats/${chat.id}/messages?limit=10`);
            const messages = Array.isArray(messagesResponse.data) ? messagesResponse.data :
              (messagesResponse.data?.data || messagesResponse.data?.items || []);

            // Find a message from another user (not current user)
            const otherUserMessage = messages.find(msg => {
              const senderId = msg.senderId || msg.sender_id || msg.fromUserId;
              return senderId && senderId !== currentUserId;
            });

            if (otherUserMessage) {
              userId = otherUserMessage.senderId || otherUserMessage.sender_id || otherUserMessage.fromUserId;
              console.log('Found user ID from messages:', userId);

              // Also try to get user data from the message itself
              const user = otherUserMessage.sender || otherUserMessage.user || otherUserMessage.fromUser;
              if (user && (user.avatar || user.profileImage || user.photo || user.image)) {
                console.log('Found user data directly in message:', user);
                newCache[userId] = user;
                continue; // Skip to next chat since we have user data
              }
            }
          } catch (error) {
            console.log('Failed to get messages for user ID extraction:', error);
          }
        }

        if (userId && !newCache[userId]) {
          // Try multiple endpoints based on your API
          const endpoints = [
            `/users/${userId}`,
            `/users?page=1&limit=20`
          ];

          for (const endpoint of endpoints) {
            try {
              console.log('Trying endpoint:', endpoint);
              const response = await axiosInstance.get(endpoint);
              console.log('Success with endpoint:', endpoint, 'data:', response.data);

              let userData = response.data;

              // If it's a list endpoint, find the user in the list
              if (endpoint.includes('page=') && userData.users && Array.isArray(userData.users)) {
                userData = userData.users.find(user =>
                  user.id === userId ||
                  user.userId === userId ||
                  user.uid === userId ||
                  user.id === chat.userId
                );
                console.log('Found user in list:', userData);
              }

              if (userData) {
                newCache[userId] = userData;
                break; // Success, stop trying other endpoints
              }
            } catch (error) {
              console.log('Failed endpoint:', endpoint, 'error:', error.response?.status || error.message);
            }
          }
        }
      }

      setUserCache(newCache);
    };

    if (chats && chats.length > 0) {
      fetchUserData();
    }
  }, [chats]);

  useEffect(() => { }, [chats]);
  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress size={32} /></Box>;
  if (error) return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>{String(error)}</Box>;
  if (!chats?.length) return <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>لا توجد محادثات</Box>;

  const resolveAvatar = (c) => {
    // Try to get user from cache first - check multiple possible ID fields
    const userId = c.otherUserId || c.sellerId || c.buyerId || c.userId;
    const user = userId ? userCache[userId] : null;

    if (user) {
      console.log('Found user in cache:', user);
      const avatar = user.avatar || user.profileImage || user.photo || user.image ||
        user.avatarUrl || user.imageUrl || user.photoUrl || user.pictureUrl;

      if (avatar) {
        console.log('Found avatar in user data:', avatar);
        return processAvatarUrl(avatar);
      }
    }

    // Try common flat fields
    const flat = (
      c.otherUserAvatar || c.avatar || c.userAvatar || c.avatarUrl || c.imageUrl ||
      c.profileImage || c.photoUrl || c.pictureUrl || c.image || c.photo
    );

    // Try nested otherUser fields
    const ou = c.otherUser || c.user || c.seller || c.buyer || {};
    const nested = (
      ou.avatar || ou.image || ou.avatarUrl || ou.imageUrl || ou.profileImage ||
      ou.photo || ou.photoUrl || ou.pictureUrl ||
      (ou.profile ? (ou.profile.avatar || ou.profile.imageUrl || ou.profile.photoUrl) : null)
    );

    // Try participants array (pick the one that's not me if flag exists)
    let fromParticipants = null;
    if (Array.isArray(c.participants) && c.participants.length) {
      const other = c.participants.find(p => p && (p.isCurrentUser === false || p.me === false || p.role === 'other')) || c.participants.find(Boolean);
      if (other) {
        fromParticipants = other.avatar || other.avatarUrl || other.imageUrl || other.profileImage ||
          other.photoUrl || other.pictureUrl || other.image || other.photo;
      }
    }

    const candidate = flat || nested || fromParticipants || null;
    console.log('Final avatar candidate:', candidate);

    if (!candidate) return undefined;

    return processAvatarUrl(candidate);
  };

  const processAvatarUrl = (candidate) => {
    try {
      const str = String(candidate);
      const hasProtocol = /^https?:\/\//i.test(str);
      if (hasProtocol) return str;

      const origin = new URL(axiosInstance.defaults.baseURL).origin;
      if (str.startsWith('/')) return origin + str;

      // Common relative paths like "uploads/...", "files/...", "public/..."
      return origin + '/' + str.replace(/^\.\//, '');
    } catch (error) {
      console.log('Avatar resolution error:', error, 'candidate:', candidate);
    }
    return candidate;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getChatName = (c) => {
    return c.otherUserName || c.sellerName || c.buyerName || c.title || c.name || `Chat #${c.id}`;
  };

  const getLastMessage = (c) => {
    const msg = c.lastMessage?.content || c.lastMessage?.text || c.lastMessage || c.last_message;
    return msg && typeof msg === 'string' && msg.length > 30 ? msg.substring(0, 30) + '...' : msg || 'لا توجد رسائل';
  };

  return (
    <List sx={{ p: 1 }}>
      {chats.map((c) => {
        const name = getChatName(c);
        const unread = unreadCountMap?.[c.id] ?? c.unreadCount ?? 0;
        const avatarSrc = resolveAvatar(c);
        const isSelected = c.id === selectedId;

        return (
          <ListItemButton
            key={c.id}
            selected={isSelected}
            onClick={() => onSelect?.(c)}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              transition: 'all 0.2s ease-in-out',
              backgroundColor: isSelected ? theme.palette.primary.main + '15' : 'transparent',
              '&:hover': {
                backgroundColor: isSelected ? theme.palette.primary.main + '25' : theme.palette.action.hover,
                transform: 'translateX(4px)',
              },
              border: isSelected ? `1px solid ${theme.palette.primary.main}30` : '1px solid transparent',
            }}
          >
            <Badge color="primary" badgeContent={unread} invisible={!(unread > 0)} overlap="circular">
              <ListItemAvatar>
                <Avatar
                  src={avatarSrc}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: avatarSrc ? 'transparent' : theme.palette.primary.main,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    border: avatarSrc ? `2px solid ${theme.palette.primary.main}20` : 'none',
                  }}
                >
                  {!avatarSrc && getInitials(name)}
                </Avatar>
              </ListItemAvatar>
            </Badge>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: isSelected ? 'bold' : '600',
                    color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                    fontSize: '0.95rem',
                  }}
                >
                  {name}
                </Typography>
              }
              secondary={
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getLastMessage(c)}
                </Typography>
              }
              sx={{ ml: 1 }}
            />
            {c.updatedAt || c.lastMessageAt ? (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                  alignSelf: 'flex-start',
                }}
              >
                {new Date(c.updatedAt || c.lastMessageAt).toLocaleDateString('ar', {
                  day: 'numeric',
                  month: 'short'
                })}
              </Typography>
            ) : null}
          </ListItemButton>
        );
      })}
    </List>
  );
}
