import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSocket } from './useSocket';
import { getChatMessages, sendMessage } from '../api/messagesAPI';

export const useChat = (chatId, currentUserId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  // Stringify auth options to prevent reference-based re-renders
  const authOptionsString = useMemo(() => {
    return JSON.stringify({
      auth: {
        userId: currentUserId
      }
    });
  }, [currentUserId]);

  // Parse auth options from string
  const authOptions = useMemo(() => {
    return JSON.parse(authOptionsString);
  }, [authOptionsString]);

  // Socket connection for real-time messaging - Use correct port and format
  const { socket, isConnected, connectionError } = useSocket(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
    authOptions
  );

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getChatMessages(chatId);
      const newMessages = Array.isArray(response.data) ? response.data : 
                         (response.data?.items || response.data?.data || []);
      
      // Filter out duplicates
      const uniqueMessages = newMessages.filter(msg => {
        const msgId = msg.id || `${msg.senderId}-${msg.createdAt}`;
        if (messageIdsRef.current.has(msgId)) {
          return false;
        }
        messageIdsRef.current.add(msgId);
        return true;
      });
      
      setMessages(prev => {
        const combined = [...prev, ...uniqueMessages];
        // Sort by timestamp
        return combined.sort((a, b) => 
          new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
        );
      });
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Optimistic message sending with socket emit
  const sendMessageOptimistic = useCallback(async (content, type = 'text') => {
    if (!content.trim() || !chatId || !currentUserId) return;

    // Create temporary message for optimistic UI
    const tempMessage = {
      id: `temp-${Date.now()}-${Math.random()}`,
      content: content.trim(),
      type,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isTemp: true,
      status: 'sending'
    };

    // Add to messages immediately (optimistic UI)
    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();

    try {
      // Save message via API first
      const response = await sendMessage(chatId, { type, [type === 'text' ? 'text' : 'imageUrl']: content });
      const savedMessage = response?.data?.data || response?.data || response;
      
      // Emit message via socket for real-time delivery
      if (socket?.connected) {
        socket.emit('message:send', {
          chatId,
          message: savedMessage,
          senderId: currentUserId
        });
        
      } else {
        console.warn('Socket not connected, message not emitted in real-time');
      }
      
      // Replace temporary message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? { ...savedMessage, status: 'sent' } : msg
      ));
      
      // Update message IDs set
      if (savedMessage?.id) {
        messageIdsRef.current.add(savedMessage.id);
        messageIdsRef.current.delete(tempMessage.id);
      }
      
      return savedMessage;
    } catch (err) {
      // Mark temporary message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
      ));
      
      throw err;
    }
  }, [chatId, currentUserId, socket]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!isTyping && socket?.connected) {
      socket.emit('typing:start', { chatId, userId: currentUserId });
      setIsTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [isTyping, socket, chatId, currentUserId]);

  const stopTyping = useCallback(() => {
    if (isTyping && socket?.connected) {
      socket.emit('typing:stop', { chatId, userId: currentUserId });
      setIsTyping(false);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [isTyping, socket, chatId, currentUserId]);

  // Retry failed messages
  const retryMessage = useCallback(async (messageId) => {
    const failedMessage = messages.find(msg => msg.id === messageId && msg.status === 'failed');
    if (!failedMessage) return;

    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'sending' } : msg
    ));

    try {
      const response = await sendMessage(chatId, { 
        type: failedMessage.type, 
        [failedMessage.type === 'text' ? 'text' : 'imageUrl']: failedMessage.content 
      });
      const savedMessage = response?.data?.data || response?.data || response;
      
      // Emit message via socket for real-time delivery
      if (socket?.connected) {
        socket.emit('message:send', {
          chatId,
          message: savedMessage,
          senderId: currentUserId
        });
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...savedMessage, status: 'sent' } : msg
      ));
      
      if (savedMessage?.id) {
        messageIdsRef.current.add(savedMessage.id);
        messageIdsRef.current.delete(messageId);
      }
    } catch (err) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'failed' } : msg
      ));
    }
  }, [messages, chatId, socket, currentUserId]);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      
      
      // Check if message belongs to current chat
      const messageChatId = message.chatId || message.conversationId;
      if (messageChatId === chatId) {
        setMessages(prev => {
          // Check for duplicates
          const msgId = message.id || `${message.senderId}-${message.createdAt}`;
          if (messageIdsRef.current.has(msgId)) {
            
            return prev;
          }
          
          messageIdsRef.current.add(msgId);
          const updated = [...prev, message];
          return updated.sort((a, b) => 
            new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
          );
        });
        scrollToBottom();
      }
    };

    const handleTypingStart = ({ userId, chatId: typingChatId }) => {
      if (typingChatId === chatId && userId !== currentUserId) {
        setTypingUsers(prev => new Set([...prev, userId]));
      }
    };

    const handleTypingStop = ({ userId, chatId: typingChatId }) => {
      if (typingChatId === chatId && userId !== currentUserId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    };

    const handleMessageUpdate = (updatedMessage) => {
      const messageChatId = updatedMessage.chatId || updatedMessage.conversationId;
      if (messageChatId === chatId) {
        setMessages(prev => prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        ));
      }
    };

    // Register socket listeners - handle multiple possible event names
    socket.on('message:new', handleNewMessage);
    socket.on('newMessage', handleNewMessage); // Alternative event name
    socket.on('message', handleNewMessage); // Another alternative
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('message:update', handleMessageUpdate);
    socket.on('messageUpdate', handleMessageUpdate); // Alternative

    // Join chat room immediately when socket connects
    if (chatId && socket.connected) {
      
      socket.emit('chat:join', { chatId });
    }

    return () => {
      // Clean up all listeners
      socket.off('message:new', handleNewMessage);
      socket.off('newMessage', handleNewMessage);
      socket.off('message', handleNewMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('message:update', handleMessageUpdate);
      socket.off('messageUpdate', handleMessageUpdate);
      
      // Leave chat room
      if (chatId && socket.connected) {
        
        socket.emit('chat:leave', { chatId });
      }
    };
  }, [socket, chatId, currentUserId, scrollToBottom]);

  // Join/leave chat room when connection state changes
  useEffect(() => {
    if (!socket || !chatId) return;

    if (isConnected && socket.connected) {
      
      socket.emit('chat:join', { chatId });
    }
  }, [socket, chatId, isConnected]);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      messageIdsRef.current.clear();
      setMessages([]);
      loadMessages();
    }
  }, [chatId, loadMessages]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(() => ({
    messages,
    loading,
    error,
    isConnected,
    connectionError,
    typingUsers,
    sendMessage: sendMessageOptimistic,
    retryMessage,
    startTyping,
    stopTyping,
    scrollToBottom,
    messagesEndRef
  }), [
    messages,
    loading,
    error,
    isConnected,
    connectionError,
    typingUsers,
    sendMessageOptimistic,
    retryMessage,
    startTyping,
    stopTyping,
    scrollToBottom
  ]);

  return value;
};
