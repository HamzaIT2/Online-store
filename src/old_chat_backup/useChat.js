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

  // Stringify auth options to prevent reference-based re-renders
  const authOptionsString = useMemo(() => {
    const token = localStorage.getItem('token'); // ✅ Add JWT token for backend authentication
    return JSON.stringify({
      auth: {
        token: token,        // ✅ JWT token for NestJS chat.gateway.ts
        userId: currentUserId // ✅ User ID for identification
      }
    });
  }, [currentUserId]);

  // Parse auth options from string
  const authOptions = useMemo(() => {
    const parsed = JSON.parse(authOptionsString);
    
    
    
    return parsed;
  }, [authOptionsString]);

  // Socket connection for real-time messaging
  // ✅ Explicitly connect to /chat namespace
  const baseUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
  const socketUrl = baseUrl.endsWith('/chat') ? baseUrl : `${baseUrl}/chat`;
  
  
  const { socket, isConnected, connectionError } = useSocket(socketUrl, authOptions);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!chatId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getChatMessages(chatId);
      const newMessages = Array.isArray(response.data) ? response.data : 
                         (response.data?.items || response.data?.data || []);
      
      setMessages(newMessages.sort((a, b) => 
        new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
      ));
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Scroll to bottom - MUST be defined before functions that use it
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Simple broadcast function for API-first pattern
  const broadcastMessage = useCallback((message) => {
    if (socket?.connected) {
      
      socket.emit('broadcastMessage', message);
    } else {
      console.warn('Socket not connected, cannot broadcast message');
    }
  }, [socket]);

  // THE SEND FLOW - Fixed with correct event name and payload
  const sendMessageOptimistic = useCallback(async (content, type = 'text') => {
    if (!content.trim() || !chatId || !currentUserId) {
      , chatId, currentUserId });
      return;
    }

    

    // Create temporary message for optimistic UI
    const tempMessage = {
      id: `temp-${Date.now()}-${Math.random()}`,
      content: content.trim(),
      text: content.trim(),  // ✅ Add text field for consistency
      type,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
      isTemp: true,
      status: 'sending'
    };

    // Add to messages immediately (optimistic UI)
    setMessages(prev => {
      
      return [...prev, tempMessage];
    });
    scrollToBottom();

    try {
      // Save message via API first
      
      const response = await sendMessage(chatId, { type, text: content });
      const savedMessage = response?.data?.data || response?.data || response;
      
      
      // Replace temporary message with real one
      setMessages(prev => {
        
        return prev.map(msg => 
          msg.id === tempMessage.id ? { ...savedMessage, status: 'sent', isTemp: false } : msg
        );
      });
      
      return savedMessage;
    } catch (err) {
      console.error('sendMessage failed:', err);
      // Mark temporary message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? { ...msg, status: 'failed' } : msg
      ));
      
      throw err;
    }
  }, [chatId, currentUserId, sendMessage, scrollToBottom]);

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!isTyping && socket?.connected) {
      socket.emit('typing:start', { chatId, userId: currentUserId });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

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
        socket.emit('sendMessage', {
          chatId,
          messageText: failedMessage.content,
          type: failedMessage.type,
          senderId: currentUserId,
          message: savedMessage
        });
      }
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...savedMessage, status: 'sent', isTemp: false } : msg
      ));
    } catch (err) {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, status: 'failed' } : msg
      ));
    }
  }, [messages, chatId, socket, currentUserId]);

  // THE RECEIVE FLOW - Fixed with simple functional state update
  useEffect(() => {
    if (!socket) return;

    // THE CRITICAL FIX: Simple functional state update for new messages
    const handleNewMessage = (message) => {
        // ✅ Add clear receiver debug log
      
      
      
      
      );
      
      
      
      // Check if message belongs to current chat
      const messageChatId = message.chatId || message.conversationId;
      if (messageChatId === chatId) {
        
        // Simple functional state update - append without losing old messages
        setMessages(prev => {
          
          
          // Check for duplicates to prevent adding the same message twice
          const isDuplicate = prev.some(msg => 
            msg.id === message.id || 
            (msg.senderId === message.senderId && msg.createdAt === message.createdAt)
          );
          
          if (isDuplicate) {
            
            return prev;
          }
          
          
          // Append new message and sort by timestamp
          const updated = [...prev, message];
          const sorted = updated.sort((a, b) => 
            new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
          );
          
          return sorted;
        });
        
        // Auto-scroll to new message
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      } else {
        
        
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

    // ✅ ENHANCED: Listen for multiple possible event names
    
    
    
    
    socket.on('newMessage', handleNewMessage);
    socket.on('message:new', handleNewMessage); // Keep as backup
    socket.on('message', handleNewMessage); // Another common variation
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    // ✅ ENHANCED: Join chat room with better logging
    if (chatId && socket.connected) {
      
      socket.emit('joinRoom', { chatId });
      socket.emit('chat:join', { chatId }); // Try alternative event name
    } else {
      console.warn('🔥 Cannot join room - socket not connected or no chatId:', { socketConnected: socket.connected, chatId });
    }

    return () => {
      
      // Clean up all listeners
      socket.off('newMessage', handleNewMessage);
      socket.off('message:new', handleNewMessage);
      socket.off('message', handleNewMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      
      // Leave chat room
      if (chatId && socket.connected) {
        
        socket.emit('leaveRoom', { chatId });
        socket.emit('chat:leave', { chatId }); // Try alternative event name
      }
    };
  }, [socket, chatId, currentUserId, scrollToBottom]);

  // Join/leave chat room when connection state changes
  useEffect(() => {
    if (!socket || !chatId) return;

    if (isConnected && socket.connected) {
      
      
      
      
      // ✅ Try multiple room join event names
      socket.emit('joinRoom', { chatId, userId: currentUserId });
      socket.emit('chat:join', { chatId, userId: currentUserId });
      socket.emit('room:join', { chatId, userId: currentUserId });
    } else {
      console.log('🔥 Socket not connected, cannot join room. Status:', {
        isConnected,
        socketConnected: socket?.connected,
        socketId: socket?.id
      });
    }
  }, [socket, chatId, isConnected, currentUserId]);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
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
    socket,
    typingUsers,
    sendMessage: sendMessageOptimistic,
    broadcastMessage,  // ✅ Add broadcastMessage for API-first pattern
    retryMessage,
    startTyping,
    stopTyping,
    scrollToBottom,
    messagesEndRef,
    setMessages  // ✅ Expose setMessages for direct state updates
  }), [
    messages,
    loading,
    error,
    isConnected,
    connectionError,
    socket,
    typingUsers,
    sendMessageOptimistic,
    broadcastMessage,
    retryMessage,
    startTyping,
    stopTyping,
    scrollToBottom
  ]);

  return value;
};
