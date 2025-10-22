import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Paperclip, Users, FileText } from 'lucide-react';

interface GroupChatProps {
  groupId: string;
  groupName: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
  sentAt: string;
  messageType: string;
}

export default function GroupChat({ groupId, groupName }: GroupChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // MOCK DATA - Remove when backend works
  useEffect(() => {
    setMessages([
      {
        id: '1',
        content: 'Welcome to the Java Learning Group! 🎉',
        sender: { id: 'system', name: 'System', role: 'SYSTEM' },
        sentAt: new Date().toISOString(),
        messageType: 'TEXT'
      },
      {
        id: '2',
        content: 'Hi everyone! Ready to learn Java together?',
        sender: { id: 'user2', name: 'Arjun Sharma', role: 'STUDENT' },
        sentAt: new Date(Date.now() - 300000).toISOString(),
        messageType: 'TEXT'
      },
      {
        id: '3',
        content: 'Can someone help with inheritance concepts?',
        sender: { id: 'user3', name: 'Hiya Patel', role: 'STUDENT' },
        sentAt: new Date(Date.now() - 120000).toISOString(),
        messageType: 'TEXT'
      },
      {
        id: '4',
        content: 'I have a doubt about multithreading in Java',
        sender: { id: 'user4', name: 'Rahul Kumar', role: 'STUDENT' },
        sentAt: new Date(Date.now() - 60000).toISOString(),
        messageType: 'TEXT'
      }
    ]);
  }, [groupName]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add message locally immediately (MOCK)
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: user?.id || 'current-user',
        name: user?.name || 'You',
        role: user?.role || 'STUDENT'
      },
      sentAt: new Date().toISOString(),
      messageType: 'TEXT'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Try backend (but don't block UI)
    try {
      await fetch(`http://localhost:8080/api/chat/${groupId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newMessage }),
      });
    } catch (error) {
      console.log('Backend not ready, but message shown locally');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg border border-gray-200">
      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Auth Warning */}
        {!user && (
          <div className="p-3 bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-800">
                🔒 Login to save messages to database
              </span>
              <span className="text-yellow-600">
                Messages work locally for testing
              </span>
            </div>
          </div>
        )}

        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">
                  {user ? 'Connected' : 'Demo Mode - Local Chat'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users size={16} />
                <span>Java Learning Group</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-25">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender.id === (user?.id || 'current-user') 
                  ? 'justify-end' 
                  : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender.id === (user?.id || 'current-user')
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : message.sender.role === 'SYSTEM'
                    ? 'bg-yellow-100 text-yellow-800 text-center italic'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                {message.sender.role !== 'SYSTEM' && message.sender.id !== (user?.id || 'current-user') && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold">
                      {message.sender.name}
                      {message.sender.role === 'TEACHER' && ' 👨‍🏫'}
                    </span>
                  </div>
                )}
                
                <p className="text-sm">{message.content}</p>
                
                {message.sender.role !== 'SYSTEM' && (
                  <div className={`text-xs mt-1 ${
                    message.sender.id === (user?.id || 'current-user') 
                      ? 'text-blue-100' 
                      : 'text-gray-500'
                  }`}>
                    {formatTime(message.sentAt)}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message about Java..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
            >
              <Send size={16} />
            </Button>
          </div>
          {!user && (
            <div className="text-xs text-gray-500 mt-2">
              💡 Message will disappear on refresh. Login to save permanently.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}