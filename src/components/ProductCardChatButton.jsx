import React from 'react';
import { Button } from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { findExistingChat, createOrGetChat } from '../api/messagesAPI';

const ProductCardChatButton = ({ sellerId, productId, productName, className }) => {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    try {
      const currentUserId = localStorage.getItem('userId');
      
      if (!currentUserId) {
        // Redirect to login if not authenticated
        navigate('/login');
        return;
      }

      // First try to find existing chat
      const existingChatResponse = await findExistingChat(currentUserId, sellerId, productId);
      
      if (existingChatResponse.data && existingChatResponse.data.conversationId) {
        // Navigate to existing conversation
        navigate(`/chats?chatId=${existingChatResponse.data.conversationId}`);
      } else {
        // Create new conversation and navigate to it
        const newChatResponse = await createOrGetChat({ sellerId, productId });
        if (newChatResponse.data && newChatResponse.data.conversationId) {
          navigate(`/chats?chatId=${newChatResponse.data.conversationId}`);
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      // Fallback: navigate to chats page
      navigate('/chats');
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<MessageIcon />}
      onClick={handleStartChat}
      className={className}
      sx={{
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          borderColor: 'primary.dark',
          backgroundColor: 'primary.50',
        },
      }}
    >
      مراسلة
    </Button>
  );
};

export default ProductCardChatButton;
