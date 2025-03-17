
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import { generateId, getInitialMessage, getBotResponse, getTypingDelay } from '@/utils/chatbotUtils';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  typing?: boolean;
}

const ReturnAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    const initialMessage = {
      id: generateId(),
      text: getInitialMessage(),
      isBot: true,
    };
    
    setMessages([initialMessage]);
    
    // Focus input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom whenever messages change - but don't use smooth scrolling
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: input,
      isBot: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Add typing indicator
    const typingIndicator: Message = {
      id: generateId(),
      text: '',
      isBot: true,
      typing: true,
    };
    
    setIsTyping(true);
    setMessages(prev => [...prev, typingIndicator]);
    
    // Generate bot response after delay
    const botResponse = getBotResponse(input);
    const typingDelay = getTypingDelay(botResponse);
    
    setTimeout(() => {
      // Remove typing indicator and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [
          ...filtered, 
          {
            id: generateId(),
            text: botResponse,
            isBot: true,
          }
        ];
      });
      setIsTyping(false);
    }, typingDelay);
  };

  const handleReset = () => {
    setMessages([
      {
        id: generateId(),
        text: getInitialMessage(),
        isBot: true,
      }
    ]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto neo-blur rounded-2xl overflow-hidden hover:shadow-glow transition-all duration-300">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
          <h3 className="font-medium text-gradient">Return Assistant</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset}
          className="text-xs text-primary/80 hover:text-primary"
        >
          New Chat
        </Button>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="h-[400px] overflow-y-auto p-4 chat-container scrollbar-none"
      >
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            className="flex-1 focus-visible:ring-primary/30 bg-white/5 border-white/10"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isTyping}
            className="transition-all duration-300 bg-primary hover:bg-primary/80 hover:shadow-glow-sm"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReturnAssistant;
