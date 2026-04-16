import React, { useEffect } from 'react';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import { useSearchParams, useLocation } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindowFixed';
import { useChatSocket } from '../../hooks/useChatSocket';

export default function ChatLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    isConnected,
    onlineUsers,
    sendMessage,
    handleFileUpload,
    selectConversation,
    selectConversationByChatId,
    loadConversations,
    messagesEndRef
  } = useChatSocket();

  const selectedChatId = activeConversation?.id || activeConversation?._id;

  // Auto-select conversation when chatId is in URL (e.g. from Product Details / Product Card)
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chatId');
    const chatFromState = location.state?.chat;
    if (chatIdFromUrl) {
      selectConversationByChatId(chatIdFromUrl, chatFromState);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  return (
    <Box
      sx={{
        mt: { xs: 7, md: 8 },
        height: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' },
        display: 'flex',
        bgcolor: theme.palette.background.default,
        overflow: 'hidden'
      }}
    >
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        loading={loading}
        error={error}
        selectedChatId={selectedChatId}
        onChatSelect={selectConversation}
        isMobile={isMobile}
        onlineUsers={onlineUsers}
      />

      {/* Chat Window */}
      <ChatWindow
        selectedChat={activeConversation}
        messages={messages}
        onSendMessage={sendMessage}
        onFileUpload={handleFileUpload}
        isMobile={isMobile}
        messagesEndRef={messagesEndRef}
        onlineUsers={onlineUsers}
      />
    </Box>
  );
}
