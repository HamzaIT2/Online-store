// import { useState, useEffect, useRef, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import axiosInstance from '../api/axiosInstance';
// import { sendMessage as apiSendMessage, getChatMessages, listChats } from '../api/messagesAPI';

// export const useChatSocket = () => {
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   // Refs to prevent stale state and infinite loops
//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const activeConversationRef = useRef(null);
//   const tokenRef = useRef(null);

//   // Update refs when state changes
//   useEffect(() => {
//     activeConversationRef.current = activeConversation;
//   }, [activeConversation]);

//   useEffect(() => {
//     tokenRef.current = localStorage.getItem('token');
//   }, []);

//   // Initialize socket connection
//   const initializeSocket = useCallback(() => {
//     const token = tokenRef.current;
//     const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
//     const userId = localStorage.getItem('userId') || currentUser.id || currentUser.userId || currentUser._id;
    
//     if (!token || socketRef.current?.connected) return;

//     // Get socket URL from environment or fallback
//     const socketUrl = import.meta.env.VITE_SOCKET_URL || 
//                      (import.meta.env.VITE_API_BASE_URL ? 
//                       import.meta.env.VITE_API_BASE_URL.replace('/api/v1', '') : 
//                       'http://localhost:3000');

//     
//     , userId });

//     const socket = io(`${socketUrl}/chat`, {
//       auth: {
//         token: token.replace('Bearer ', ''),
//         userId: userId
//       },
//       transports: ['websocket', 'polling']
//     });

//     socketRef.current = socket;

//     // Connection events
//     socket.on('connect', () => {
//       
//       setIsConnected(true);
//       setError(null);
//     });

//     socket.on('disconnect', (reason) => {
//       
//       setIsConnected(false);
//     });

//     socket.on('connect_error', (error) => {
//       console.error('🔌 Socket connection error:', error);
//       setError('Failed to connect to chat server');
//       setIsConnected(false);
//     });

//     // Critical: Listen for new messages (exact backend event)
//     socket.on('newMessage', (message) => {
//       
//       
//       
      
//       // If message belongs to currently active chat, append to messages array
//       if (message.chatId === activeConversationRef.current?.id) {
//         
//         // Prevent duplicates: only add if message doesn't already exist
//         setMessages(prev => prev.some(m => m.id === message.id) ? prev : [...prev, message]);
//       }

//       // Globally update conversations (Sidebar)
//       setConversations(prevConversations => {
//         const updatedConversations = prevConversations.map(conv => {
//           if (conv.id === message.chatId) {
//             return {
//               ...conv,
//               lastMessageSnippet: message.text,
//               timestamp: message.createdAt,
//               unreadCount: conv.id === activeConversationRef.current?.id ? conv.unreadCount : (conv.unreadCount || 0) + 1
//             };
//           }
//           return conv;
//         });

//         // Move updated conversation to top of list
//         const updatedConv = updatedConversations.find(conv => conv.id === message.chatId);
//         if (updatedConv) {
//           const otherConvs = updatedConversations.filter(conv => conv.id !== message.chatId);
//           return [updatedConv, ...otherConvs];
//         }

//         return updatedConversations;
//       });
//     });

//     // Listen for room joining confirmation
//     socket.on('joinedRoom', (data) => {
//       
//     });

//     // Optional: Listen for user online status
//     socket.on('userJoined', (data) => {
//       
//     });

//     socket.on('userLeft', (data) => {
//       
//     });

//     return socket;
//   }, []);

//   // Load conversations list
//   const loadConversations = useCallback(async () => {
//     try {
//       setLoading(true);
//       
      
//       const response = await listChats();
//       
      
//       // Handle different response formats
//       let conversationsData = [];
//       if (Array.isArray(response)) {
//         conversationsData = response;
//       } else if (response?.data && Array.isArray(response.data)) {
//         conversationsData = response.data;
//       } else if (response?.items && Array.isArray(response.items)) {
//         conversationsData = response.items;
//       }

//       setConversations(conversationsData);
//       setError(null);
//     } catch (err) {
//       console.error('📂 Error loading conversations:', err);
//       setError('Failed to load conversations');
//       setConversations([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Load messages for specific conversation
//   const loadMessages = useCallback(async (conversationId) => {
//     try {
//       
      
//       const response = await getChatMessages(conversationId);
//       
      
//       // Handle different response formats
//       let messagesData = [];
//       if (Array.isArray(response)) {
//         messagesData = response;
//       } else if (response?.data && Array.isArray(response.data)) {
//         messagesData = response.data;
//       } else if (response?.items && Array.isArray(response.items)) {
//         messagesData = response.items;
//       }

//       setMessages(messagesData || []);
//       setError(null);
//     } catch (err) {
//       console.error('📨 Error loading messages:', err);
//       setError('Failed to load messages');
//       setMessages([]);
//     }
//   }, []);

//   // Send message function
//   const sendMessage = useCallback(async (text) => {
//     if (!text?.trim() || !activeConversationRef.current) {
//       console.warn('📤 Cannot send message: no text or active conversation');
//       return;
//     }

//     try {
//       const chatId = Number(activeConversationRef.current.id);
//       

//       // Send via API
//       const response = await apiSendMessage(activeConversationRef.current.id, { text });
//       

//       // IMMEDIATELY append the new message to state for sender
//       setMessages(prevMessages => [...prevMessages, response]);

//       // Update conversations list and move to top
//       setConversations(prevConversations => {
//         const updatedConversations = prevConversations.map(conv => {
//           if (conv.id === chatId) {
//             return {
//               ...conv,
//               lastMessageSnippet: text,
//               timestamp: new Date()
//             };
//           }
//           return conv;
//         });

//         // Move this conversation to top
//         const updatedConv = updatedConversations.find(conv => conv.id === chatId);
//         if (updatedConv) {
//           const otherConvs = updatedConversations.filter(conv => conv.id !== chatId);
//           return [updatedConv, ...otherConvs];
//         }

//         return updatedConversations;
//       });

//     } catch (err) {
//       console.error('📤 Error sending message:', err);
//       setError('Failed to send message');
//     }
//   }, []);

//   // Select conversation
//   const selectConversation = useCallback((conversation) => {
//     
//     setActiveConversation(conversation);
    
//     // Join socket room for this conversation using exact backend format
//     if (socketRef.current?.connected && conversation.id) {
//       const chatId = Number(conversation.id);
//       
//       socketRef.current.emit('joinRoom', { chatId });
//     }
    
//     // Load messages for this conversation
//     loadMessages(conversation.id);
//   }, [loadMessages]);

//   // Initialize on mount
//   useEffect(() => {
//     const socket = initializeSocket();
//     loadConversations();

//     return () => {
//       if (socketRef.current) {
//         
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, [initializeSocket, loadConversations]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   return {
//     // State
//     conversations,
//     activeConversation,
//     messages,
//     loading,
//     error,
//     isConnected,
//     onlineUsers,
    
//     // Actions
//     sendMessage,
//     selectConversation,
//     loadConversations,
    
//     // Refs for components
//     messagesEndRef
//   };
// };



//====================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { sendMessage as apiSendMessage, getChatMessages, listChats, uploadChatMessageFile } from '../api/messagesAPI';

export const useChatSocket = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const activeConversationRef = useRef(null);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const initializeSocket = useCallback(() => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = localStorage.getItem('userId') || currentUser.userId;
    
    if (!token || socketRef.current?.connected) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    
    
    const socket = io(`${socketUrl}/chat`, {
      auth: {
        token: token.replace('Bearer ', ''),
        userId: Number(userId)
      },
      transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      
      setIsConnected(true);
      
      // If there is an active conversation, join it immediately upon reconnect
      if (activeConversationRef.current?.id) {
        socket.emit('joinRoom', { chatId: Number(activeConversationRef.current.id) });
      }
    });

    socket.on('joinedRoom', (data) => {
      
    });

    // CRITICAL: The exact listener for new messages
    socket.on('newMessage', (incomingMsg) => {
      
      
      const currentActiveId = activeConversationRef.current?.id;
      
      // Update Messages State (If looking at the chat) - strict deduplication
      if (Number(incomingMsg.chatId) === Number(currentActiveId)) {
        setMessages(prev => {
          if (prev.some(m => m.id === incomingMsg.id)) return prev;
          return [...prev, incomingMsg];
        });
      }

      // Update Sidebar State
      setConversations(prev => {
        const isCurrentChat = Number(incomingMsg.chatId) === Number(currentActiveId);
        const updated = prev.map(conv => {
          if (Number(conv.id) === Number(incomingMsg.chatId)) {
            return {
              ...conv,
              lastMessageSnippet: incomingMsg.text,
              timestamp: incomingMsg.createdAt,
              unreadCount: isCurrentChat ? (conv.unreadCount || 0) : (conv.unreadCount || 0) + 1
            };
          }
          return conv;
        });
        
        // Move to top
        const chatToMove = updated.find(c => Number(c.id) === Number(incomingMsg.chatId));
        if (chatToMove) {
          return [chatToMove, ...updated.filter(c => Number(c.id) !== Number(incomingMsg.chatId))];
        }
        return updated;
      });
    });

    return socket;
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await listChats();
      const data = response?.data || response?.items || response || [];
      setConversations(data);
    } catch (err) {
      console.error('📂 Error loading conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    try {
      const response = await getChatMessages(conversationId);
      const data = response?.data || response?.items || response || [];
      setMessages(data);
    } catch (err) {
      console.error('📨 Error loading messages:', err);
      setMessages([]);
    }
  }, []);

  const selectConversation = useCallback((conversation) => {
    setActiveConversation(conversation);
    if (socketRef.current?.connected && conversation?.id) {
      socketRef.current.emit('joinRoom', { chatId: Number(conversation.id) });
    }
    if (conversation?.id) loadMessages(conversation.id);
  }, [loadMessages]);

  const selectConversationByChatId = useCallback((chatId, chatPayload) => {
    const id = Number(chatId);
    if (!id) return;
    const normalizedPayload = chatPayload ? { ...chatPayload, id: chatPayload.id ?? chatPayload.chatId ?? id } : null;
    const existing = conversations.find(c => Number(c.id) === id);
    const conv = existing || normalizedPayload || { id, name: `محادثة #${id}` };
    selectConversation(conv);
    if (!existing && normalizedPayload) {
      setConversations(prev => {
        const alreadyIn = prev.some(c => Number(c.id) === id);
        if (alreadyIn) return prev;
        return [normalizedPayload, ...prev];
      });
    }
  }, [conversations, selectConversation]);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || !activeConversationRef.current) return;
    
    const chatId = Number(activeConversationRef.current.id);
    
    try {
      // 1. Send via API
      const newMsgResponse = await apiSendMessage(chatId, { text });
      
      // 2. Safely extract message from various response shapes
      const actualMessage = newMsgResponse?.data?.message || newMsgResponse?.data || newMsgResponse;
      
      // 3. IMMEDIATELY update UI for sender to feel instant (with deduplication)
      if (actualMessage && actualMessage.id) {
         setMessages(prev => {
           if (prev.some(m => m.id === actualMessage.id)) return prev;
           return [...prev, actualMessage];
         });
         
         // Update sidebar instantly
         setConversations(prev => {
           const updated = prev.map(conv => {
             if (Number(conv.id) === chatId) {
               return { ...conv, lastMessageSnippet: text, timestamp: new Date() };
             }
             return conv;
           });
           const chatToMove = updated.find(c => Number(c.id) === chatId);
           if (chatToMove) {
             return [chatToMove, ...updated.filter(c => Number(c.id) !== chatId)];
           }
           return updated;
         });
      }
    } catch (err) {
      console.error('📤 Error sending message:', err);
    }
  }, []);

  const handleFileUpload = useCallback(async (files) => {
    if (!files?.length || !activeConversationRef.current) return;
    const chatId = Number(activeConversationRef.current.id);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const response = await uploadChatMessageFile(chatId, file);
        const actualMessage = response?.data?.message || response?.data || response?.message || response;
        if (actualMessage && actualMessage.id) {
          setMessages(prev => {
            if (prev.some(m => m.id === actualMessage.id)) return prev;
            return [...prev, actualMessage];
          });
          const label = file.name || 'File';
          setConversations(prev => {
            const updated = prev.map(conv =>
              Number(conv.id) === chatId ? { ...conv, lastMessageSnippet: label, timestamp: new Date() } : conv
            );
            const chatToMove = updated.find(c => Number(c.id) === chatId);
            if (chatToMove) return [chatToMove, ...updated.filter(c => Number(c.id) !== chatId)];
            return updated;
          });
        }
      } catch (err) {
        console.error('📎 Error uploading file:', err);
      }
    }
  }, []);

  useEffect(() => {
    const socket = initializeSocket();
    loadConversations();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [initializeSocket, loadConversations]);

  return {
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
  };
};