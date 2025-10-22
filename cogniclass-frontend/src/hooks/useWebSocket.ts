import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { socketService } from '../services/socket';
import type { Message, User } from '../types';

export const useWebSocket = (groupId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const { user } = useAuthStore();
  const messagesRef = useRef<Message[]>([]);

  // Keep messages ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const handleNewMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const handleUserJoined = useCallback((data: { user: User; onlineUsers: User[] }) => {
    setOnlineUsers(data.onlineUsers);
    // Add system message
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      groupId,
      userId: 'system',
      user: { id: 'system', name: 'System', email: 'system@cogniclass.com', role: 'teacher' },
      content: `${data.user.name} joined the chat`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
  }, [groupId]);

  const handleUserLeft = useCallback((data: { user: User; onlineUsers: User[] }) => {
    setOnlineUsers(data.onlineUsers);
    // Add system message
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      groupId,
      userId: 'system',
      user: { id: 'system', name: 'System', email: 'system@cogniclass.com', role: 'teacher' },
      content: `${data.user.name} left the chat`,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
  }, [groupId]);

  const handleOnlineUsers = useCallback((users: User[]) => {
    setOnlineUsers(users);
  }, []);

  useEffect(() => {
    if (!user || !groupId) return;

    // Mock token - in real app, use actual JWT from auth store
    const token = 'mock-jwt-token-for-demo';
    
    // Connect to WebSocket
    socketService.connect(groupId, token);

    // Set up event listeners
    socketService.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    socketService.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socketService.on('new_message', handleNewMessage);
    socketService.on('user_joined', handleUserJoined);
    socketService.on('user_left', handleUserLeft);
    socketService.on('online_users', handleOnlineUsers);

    // Load initial messages (in real app, this would come from API)
    const initialMessages: Message[] = [
      {
        id: '1',
        groupId,
        userId: '1',
        user: { id: '1', name: 'Teacher John', email: 'john@teacher.com', role: 'teacher' },
        content: 'Welcome to the Math Study Group! Feel free to ask questions.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text'
      },
      {
        id: '2',
        groupId,
        userId: '2',
        user: { id: '2', name: 'Student Alice', email: 'alice@student.com', role: 'student' },
        content: 'Can someone help with the calculus homework?',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'text'
      }
    ];
    setMessages(initialMessages);

    // Set initial online users (including current user)
    setOnlineUsers([
      { id: '1', name: 'Teacher John', email: 'john@teacher.com', role: 'teacher' },
      { id: '2', name: 'Student Alice', email: 'alice@student.com', role: 'student' },
      user
    ]);

    return () => {
      // Clean up event listeners
      socketService.off('new_message', handleNewMessage);
      socketService.off('user_joined', handleUserJoined);
      socketService.off('user_left', handleUserLeft);
      socketService.off('online_users', handleOnlineUsers);
      
      // Disconnect when component unmounts or groupId changes
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [groupId, user, handleNewMessage, handleUserJoined, handleUserLeft, handleOnlineUsers]);

  const sendMessage = useCallback((content: string, type: 'text' | 'file' = 'text', file?: File) => {
    if (!user || !content.trim()) return;

    const messageData = {
      groupId,
      content,
      type,
      fileName: file?.name,
      fileSize: file?.size
    };

    // Send via WebSocket
    socketService.emit('send_message', messageData);

    // Optimistically add to UI (will be confirmed when server echoes back)
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      groupId,
      userId: user.id,
      user: user,
      content,
      timestamp: new Date().toISOString(),
      type,
      fileName: file?.name
    };

    setMessages(prev => [...prev, optimisticMessage]);
  }, [groupId, user]);

  const uploadFile = useCallback((file: File) => {
    // In real implementation, you would:
    // 1. Upload file to storage service (AWS S3, etc.)
    // 2. Get back file URL
    // 3. Send message with file URL
    
    // For demo, we'll simulate upload and send as regular message
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        sendMessage(`Shared file: ${file.name}`, 'file', file);
        resolve();
      }, 1000);
    });
  }, [sendMessage]);

  return { 
    messages, 
    sendMessage, 
    uploadFile,
    isConnected, 
    onlineUsers 
  };
};
