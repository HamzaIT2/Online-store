import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { List, ListItemButton, ListItemText, CircularProgress, Box, Badge, ListItemAvatar, Avatar, Typography, useTheme } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function ChatList({ chats, loading, error, selectedId, onSelect, unreadCountMap, currentUserId }) {
  const theme = useTheme();
  const [userCache, setUserCache] = useState({});

  // Refs to prevent infinite loops
  const fetchedChatsRef = useRef(new Set());
  const fetchingRef = useRef(false);
  const previousChatsRef = useRef(null);

  // Memoized chat IDs to prevent unnecessary re-renders
  const chatIds = useMemo(() => {
    return chats ? chats.map(chat => chat.id).sort().join(',') : '';
  }, [chats]);

  // Fetch user data for a single chat (with caching)
  const fetchUserForChat = useCallback(async (chat) => {
    // Skip if already cached or already being fetched
    const userId = chat.otherUserId || chat.sellerId || chat.buyerId ||
      chat.otherUser?.id || chat.user?.id || chat.seller?.id || chat.buyer?.id ||
      chat.participants?.find(p => p.id !== currentUserId)?.id;

    if (!userId || userCache[userId] || fetchedChatsRef.current.has(userId)) {
      return;
    }

    // Mark as being fetched
    fetchedChatsRef.current.add(userId);

    try {
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
              user.uid === userId ||
              user.id === chat.userId
            );
          }

          if (userData) {
            setUserCache(prev => ({
              ...prev,
              [userId]: userData
            }));
            break; // Success, stop trying other endpoints
          }
        } catch (error) {

        }
      }
    } catch (error) {

    }
  }, [userCache, currentUserId]);

  // Fetch user data when chats change (with proper guards)
  useEffect(() => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || !chats || chats.length === 0) return;

    // Prevent multiple simultaneous fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    // Check if chats have actually changed (deep comparison)
    const currentChatIds = chats.map(chat => chat.id).sort().join(',');
    const previousChatIds = previousChatsRef.current;

    if (currentChatIds === previousChatIds) {
      fetchingRef.current = false;
      return;
    }

    previousChatsRef.current = currentChatIds;

    // Fetch users for each chat that we don't have cached
    const fetchPromises = chats.map(chat => fetchUserForChat(chat));

    Promise.allSettled(fetchPromises).finally(() => {
      fetchingRef.current = false;
    });
  }, [chatIds, fetchUserForChat]);

  // Remove the problematic empty useEffect
  // useEffect(() => { }, [chats]); // This was causing issues

  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress size={32} /></Box>;
  if (error) return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>{String(error)}</Box>;
  if (!chats?.length) return <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>لا توجد محادثات</Box>;

  const resolveAvatar = useCallback((c) => {
    // Try to get user from cache first - check multiple possible ID fields
    const userId = c.otherUserId || c.sellerId || c.buyerId || c.userId;
    const user = userId ? userCache[userId] : null;

    if (user) {
      const avatar = user.avatar || user.profileImage || user.photo || user.image ||
        user.avatarUrl || user.imageUrl || user.photoUrl || user.pictureUrl;

      if (avatar) {
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

    if (!candidate) return undefined;

    return processAvatarUrl(candidate);
  }, [userCache]);

  const processAvatarUrl = useCallback((candidate) => {
    try {
      const str = String(candidate);
      const hasProtocol = /^https?:\/\//i.test(str);
      if (hasProtocol) return str;

      const origin = new URL(axiosInstance.defaults.baseURL).origin;
      if (str.startsWith('/')) return origin + str;

      // Common relative paths like "uploads/...", "files/...", "public/..."
      return origin + '/' + str.replace(/^\.\//, '');
    } catch (error) {

    }
    return candidate;
  }, []);

  const getInitials = useCallback((name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, []);

  const getChatName = useCallback((c) => {
    return c.otherUserName || c.sellerName || c.buyerName || c.title || c.name || `Chat #${c.id}`;
  }, []);

  const getLastMessage = useCallback((c) => {
    const msg = c.lastMessage?.content || c.lastMessage?.text || c.lastMessage || c.last_message;
    return msg && typeof msg === 'string' && msg.length > 30 ? msg.substring(0, 30) + '...' : msg || 'لا توجد رسائل';
  }, []);

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
