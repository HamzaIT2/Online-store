import { useEffect } from "react";
import { List, ListItemButton, ListItemText, CircularProgress, Box, Badge, ListItemAvatar, Avatar } from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function ChatList({ chats, loading, error, selectedId, onSelect, unreadCountMap }) {
  useEffect(() => { }, [chats]);
  if (loading) return <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;
  if (error) return <Box sx={{ p: 2, color: 'error.main' }}>{String(error)}</Box>;
  if (!chats?.length) return <Box sx={{ p: 2 }}>لا توجد محادثات</Box>;
  const resolveAvatar = (c) => {
    // Try common flat fields
    const flat = (
      c.otherUserAvatar || c.avatar || c.userAvatar || c.avatarUrl || c.imageUrl || c.profileImage || c.photoUrl || c.pictureUrl
    );
    // Try nested otherUser fields
    const ou = c.otherUser || c.user || c.seller || c.buyer || {};
    const nested = (
      ou.avatar || ou.image || ou.avatarUrl || ou.imageUrl || ou.profileImage || ou.photo || ou.photoUrl || ou.pictureUrl ||
      (ou.profile ? (ou.profile.avatar || ou.profile.imageUrl || ou.profile.photoUrl) : null)
    );
    // Try participants array (pick the one that's not me if flag exists)
    let fromParticipants = null;
    if (Array.isArray(c.participants) && c.participants.length) {
      const other = c.participants.find(p => p && (p.isCurrentUser === false || p.me === false || p.role === 'other')) || c.participants.find(Boolean);
      if (other) {
        fromParticipants = other.avatar || other.avatarUrl || other.imageUrl || other.profileImage || other.photoUrl || other.pictureUrl || other.image;
      }
    }
    const candidate = flat || nested || fromParticipants || null;
    if (!candidate) return undefined;
    try {
      const str = String(candidate);
      const hasProtocol = /^https?:\/\//i.test(str);
      if (hasProtocol) return str;
      const origin = new URL(axiosInstance.defaults.baseURL).origin;
      if (str.startsWith('/')) return origin + str;
      // Common relative paths like "uploads/...", "files/...", "public/..."
      return origin + '/' + str.replace(/^\.\//, '');
    } catch { }
    return candidate;
  };
  return (
    <List dense>
      {chats.map((c) => {
        const name = c.otherUserName || c.sellerName || c.buyerName || `Chat #${c.id}`;
        const unread = unreadCountMap?.[c.id] ?? c.unreadCount ?? 0;
        const avatarSrc = resolveAvatar(c);
        return (
          <ListItemButton key={c.id} selected={c.id === selectedId} onClick={() => onSelect?.(c)}>
            <Badge color="primary" badgeContent={unread} invisible={!(unread > 0)} overlap="circular">
              <ListItemAvatar>
                <Avatar src={avatarSrc}>{String(name).charAt(0)}</Avatar>
              </ListItemAvatar>
            </Badge>
            <ListItemText primary={name} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
