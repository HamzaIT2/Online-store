import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  useTheme,
  Divider,
  InputBase,
  IconButton,
  Paper,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

export default function ChatSidebar({
  conversations,
  loading,
  error,
  selectedChatId,
  onChatSelect,
  isMobile,
  onlineUsers = []
}) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUserOnline = (conversation) => {
    const userId = conversation?.otherUserId ??
      conversation?.userId ??
      conversation?.sellerId ??
      conversation?.buyerId ??
      conversation?.otherUser?.id ??
      conversation?.user?.id;
    if (!userId) return false;
    const onlineStr = (onlineUsers || []).map(id => String(id));
    return onlineStr.includes(String(userId));
  };

  const formatMessage = (message) => {
    if (!message) return 'لا توجد رسائل';
    return message.length > 35 ? message.substring(0, 35) + '...' : message;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getConversationName = (conv) => {
    return conv.name || conv.otherUserName || conv.title || `محادثة #${conv.id}`;
  };

  const getConversationAvatar = (conv) => {
    return conv.avatar || conv.otherUserAvatar || conv.imageUrl;
  };

  const getLastMessage = (conv) => {
    return conv.lastMessageSnippet || conv.lastMessage || conv.last_message || '';
  };

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.background.paper,
          borderLeft: `1px solid ${theme.palette.divider}`,
          ...(isMobile ? { width: '100%' } : { width: '30%' })
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            الرسائل
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={32} />
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.background.paper,
          borderLeft: `1px solid ${theme.palette.divider}`,
          ...(isMobile ? { width: '100%' } : { width: '30%' })
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            الرسائل
          </Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: theme.palette.background.paper,
        borderLeft: `1px solid ${theme.palette.divider}`,
        ...(isMobile ? { width: '100%' } : { width: '30%' })
      }}
    >
      {/* Sidebar Header */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          الرسائل
        </Typography>

        {/* Search Bar */}
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            bgcolor: theme.palette.action.hover,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="البحث عن محادثة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton sx={{ p: '10px' }} aria-label="more">
            <MoreVertIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ p: 1 }}>
          {filteredConversations.map((conversation, index) => {
            const name = getConversationName(conversation);
            const lastMessage = getLastMessage(conversation);
            const timestamp = formatTimestamp(conversation.timestamp || conversation.lastMessageAt || conversation.updatedAt);
            const avatar = getConversationAvatar(conversation);
            const unreadCount = conversation.unreadCount || 0;

            return (
              <React.Fragment key={conversation.id || conversation._id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedChatId === (conversation.id || conversation._id)}
                    onClick={() => onChatSelect?.(conversation)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&.Mui-selected': {
                        bgcolor: theme.palette.primary.main + '15',
                        border: `1px solid ${theme.palette.primary.main}30`,
                      },
                      '&:hover': {
                        bgcolor: theme.palette.action.hover,
                        transform: 'translateX(2px)',
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="success"
                        variant="dot"
                        invisible={!isUserOnline(conversation)}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      >
                        <Avatar
                          src={avatar}
                          sx={{
                            width: 48,
                            height: 48,
                            border: `2px solid ${theme.palette.divider}`
                          }}
                        >
                          {name.charAt(0)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          component="span"
                          variant="subtitle1"
                          sx={{
                            fontWeight: selectedChatId === (conversation.id || conversation._id) ? 'bold' : '600',
                            color: theme.palette.text.primary,
                          }}
                        >
                          {name}
                        </Typography>
                      }
                      secondary={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '0.85rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '180px'
                            }}
                          >
                            {formatMessage(lastMessage)}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: '0.75rem',
                              mr: 1
                            }}
                          >
                            {timestamp}
                          </Typography>
                        </Box>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />

                    {unreadCount > 0 && (
                      <Badge
                        badgeContent={unreadCount}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.7rem',
                            height: 18,
                            minWidth: 18,
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {index < filteredConversations.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
