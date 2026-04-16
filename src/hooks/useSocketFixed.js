import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (serverUrl, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Use ref to store socket instance to prevent re-renders
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef(null);
  
  // Stringify options to prevent reference-based re-renders
  const optionsString = JSON.stringify(options);
  const serverUrlString = String(serverUrl);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    // Parse options back from string
    const parsedOptions = JSON.parse(optionsString);
    
    const newSocket = io(serverUrlString, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      ...parsedOptions
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;
      
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      
      
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      setConnectionError(error.message);
      reconnectAttempts.current++;
      
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        newSocket.disconnect();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current = newSocket;
  }, [serverUrlString, optionsString]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event, data, callback) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data, callback);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }, []);

  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, handler);
      }
    };
  }, []);

  // Only connect once when dependencies change
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    on,
    disconnect,
    reconnect: connect
  };
};
