import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Send, Bot, User, Brain, Lightbulb } from 'lucide-react';

interface AITutorChatProps {
  groupId: string;
  context?: string;
}

interface TutorMessage {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: string;
  type: 'question' | 'explanation' | 'hint' | 'example';
}

// Real AI response function - UPDATED for your Java backend
const getRealAIResponse = async (userInput: string, context?: string): Promise<TutorMessage> => {
  try {
    const response = await fetch('http://localhost:8080/api/ai/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify({
        message: userInput,
        context: context || 'general learning'
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      id: `ai-${Date.now()}`,
      content: data.response,
      sender: 'tutor',
      timestamp: new Date().toISOString(),
      type: data.type || 'explanation'
    };
  } catch (error) {
    console.error('AI API error, using fallback:', error);
    return getFallbackResponse(userInput);
  }
};

// Fallback function (keep your existing simulated responses)
const getFallbackResponse = async (userInput: string): Promise<TutorMessage> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = {
    math: [
      "Let me break this down step by step. The key concept here is understanding the fundamental principles before applying them to specific problems. Would you like me to go deeper into any particular aspect?",
      "Here's a different perspective that might help: think about this problem visually or in terms of real-world applications. Sometimes connecting abstract concepts to tangible examples makes them easier to grasp.",
      "Let me provide a concrete example to illustrate this concept. Consider how this applies in practical situations you might encounter.",
      "I notice you're asking about mathematical reasoning. The beauty of math is that it builds systematically - let's ensure we have the foundations solid before moving forward."
    ],
    programming: [
      "In programming, this concept becomes clearer when you see it in action. The key is understanding not just the 'how' but the 'why' behind the implementation.",
      "This is a great question! Many developers encounter this challenge. The solution often involves breaking the problem into smaller, manageable pieces.",
      "Let me explain this with a code analogy that might resonate. Think of it like building with LEGO blocks - each piece has a specific purpose and fits together in particular ways.",
      "The best practice here balances efficiency with readability. Remember that code is read more often than it's written, so clarity is crucial."
    ],
    default: [
      "That's an excellent question! Learning is most effective when we connect new information to what we already know. Let me help build those connections for you.",
      "I appreciate your curiosity about this topic. The journey of understanding often involves asking the right questions, and you're doing exactly that.",
      "This is a fundamental concept that serves as building blocks for more advanced topics. Let's make sure you have a solid grasp before moving forward.",
      "Great question! The learning process involves some confusion - that's completely normal. Let me guide you through understanding this step by step."
    ]
  };

  let category: keyof typeof responses = 'default';
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('math') || lowerInput.includes('calculate') || lowerInput.includes('equation')) {
    category = 'math';
  } else if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('function')) {
    category = 'programming';
  }

  const categoryResponses = responses[category];
  const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  
  const responseTypes: TutorMessage['type'][] = ['explanation', 'hint', 'example', 'question'];
  const randomType = responseTypes[Math.floor(Math.random() * responseTypes.length)];

  return {
    id: `fallback-${Date.now()}`,
    content: randomResponse,
    sender: 'tutor',
    timestamp: new Date().toISOString(),
    type: randomType
  };
};

export default function AITutorChat({ groupId, context }: AITutorChatProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  // Initial tutor greeting
  useEffect(() => {
    const greeting: TutorMessage = {
      id: `greeting-${Date.now()}`,
      content: `Hello${user?.name ? ` ${user.name}` : ''}! I'm your AI tutor powered by Groq and Llama 3. I can help explain concepts, provide examples, or guide you through problems. What would you like to learn about?`,
      sender: 'tutor',
      timestamp: new Date().toISOString(),
      type: 'explanation'
    };
    setMessages([greeting]);
  }, [user?.name]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isThinking) return;

    // Add user message with unique ID
    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      content: userInput,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsThinking(true);

    try {
      // Get REAL AI response from your Java backend
      const aiResponse = await getRealAIResponse(userInput, context);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: TutorMessage = {
        id: `error-${Date.now()}`,
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'tutor',
        timestamp: new Date().toISOString(),
        type: 'explanation'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const getMessageIcon = (sender: 'user' | 'tutor', type: TutorMessage['type']) => {
    if (sender === 'user') return <User size={16} className="text-blue-500" />;
    
    switch (type) {
      case 'hint': return <Lightbulb size={16} className="text-yellow-500" />;
      case 'example': return <Brain size={16} className="text-purple-500" />;
      default: return <Bot size={16} className="text-green-500" />;
    }
  };

  const getMessageStyle = (sender: 'user' | 'tutor', type: TutorMessage['type']) => {
    const baseStyle = "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl";
    
    if (sender === 'user') {
      return `${baseStyle} bg-blue-500 text-white rounded-br-none`;
    }
    
    switch (type) {
      case 'hint':
        return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-bl-none`;
      case 'example':
        return `${baseStyle} bg-purple-100 text-purple-800 border border-purple-300 rounded-bl-none`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 rounded-bl-none`;
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Tutor (Powered by Groq & Llama 3)</h3>
            <p className="text-sm text-gray-600">Connected to real AI backend</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-25">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex mb-4 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={getMessageStyle(message.sender, message.type)}>
              <div className="flex items-center space-x-2 mb-1">
                {getMessageIcon(message.sender, message.type)}
                <span className="text-xs font-medium capitalize">
                  {message.sender === 'tutor' ? 'AI Tutor' : 'You'}
                  {message.type !== 'question' && ` • ${message.type}`}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
              <div className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none">
              <div className="flex items-center space-x-2">
                <Bot size={16} className="text-green-500" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask me anything about the course material..."
            className="flex-1"
            disabled={isThinking}
          />
          <Button
            type="submit"
            disabled={!userInput.trim() || isThinking}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          <button
            type="button"
            onClick={() => setUserInput("Can you explain this concept in simpler terms?")}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Explain simply
          </button>
          <button
            type="button"
            onClick={() => setUserInput("Can you give me an example?")}
            className="text-xs text-purple-600 hover:text-purple-700"
          >
            Show example
          </button>
          <button
            type="button"
            onClick={() => setUserInput("I need a hint for this problem")}
            className="text-xs text-yellow-600 hover:text-yellow-700"
          >
            Give hint
          </button>
        </div>
      </form>
    </div>
  );
}