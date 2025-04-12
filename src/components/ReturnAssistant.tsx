import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import { generateId, getInitialMessage } from '@/utils/chatbotUtils';
import { marked } from 'marked';
import { toast } from "sonner";
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  typing?: boolean;
}

const STORAGE_KEYS = {
  API_KEY: 'openrouter_api_key',
  CHAT_HISTORY: 'return_assistant_chat_history'
};

// Permanently stored API key for teacher demonstration
const DEFAULT_API_KEY = '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';

const ReturnAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    const savedChatHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (savedChatHistory) {
      try {
        const parsedHistory = JSON.parse(savedChatHistory) as Message[];
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
          return; // Skip adding initial message if we loaded history
        }
      } catch (error) {
        console.error('Error parsing chat history:', error);
      }
    }
    
    const initialMessage = {
      id: generateId(),
      text: getInitialMessage(),
      isBot: true,
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const historyToSave = messages.filter(msg => !msg.typing);
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(historyToSave));
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages]);

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    setShowApiKeyForm(false);
    toast.success("API key saved successfully");
  };

  const resetApiKey = () => {
    setApiKey(DEFAULT_API_KEY);
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    setShowApiKeyForm(false);
    toast.success("Reset to default API key");
  };

  const changeApiKey = () => {
    setShowApiKeyForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isTyping) return;
    
    if (!apiKey) {
      toast.error("API key is missing");
      setShowApiKeyForm(true);
      return;
    }
    
    const userMessage: Message = {
      id: generateId(),
      text: input,
      isBot: false,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    const typingIndicator: Message = {
      id: generateId(),
      text: '',
      isBot: true,
      typing: true,
    };
    
    setIsTyping(true);
    setMessages(prev => [...prev, typingIndicator]);
    
    const conversationHistory = messages
      .filter(msg => !msg.typing)
      .map(msg => ({
        role: msg.isBot ? 'assistant' : 'user',
        content: msg.text
      }));
    
    try {
      const systemPrompt = "You are a return and refund assistant. You help customers with product returns and refunds. You should remember details that the customer provides about their order, such as order numbers or product details. If a question is not related to product returns or refunds, respond with 'I can only answer questions about product returns and refunds.' IMPORTANT: ONLY RESPOND WITH THE FINAL ANSWER. DO NOT INCLUDE ANY THINKING, REASONING, OR EXPLANATION ABOUT HOW YOU'RE GENERATING THE RESPONSE.";
      
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: input }
      ];
      
      console.log('Sending request with API key:', apiKey.substring(0, 10) + '...');
      
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': 'https://www.sitename.com',
            'X-Title': 'ReturnAssistantChatBot',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: apiMessages,
            temperature: 0.7,
            max_tokens: 800,
          }),
        }
      );
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('API response:', data);
      
      if (!response.ok) {
        let errorMessage = 'API Error';
        if (data.error && data.error.message) {
          errorMessage = data.error.message;
        } else if (data.error) {
          errorMessage = JSON.stringify(data.error);
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        if (errorMessage.includes('auth') || 
            errorMessage.includes('credentials') || 
            errorMessage.includes('API key') ||
            response.status === 401 || 
            response.status === 403) {
          throw new Error(`Authentication error: ${errorMessage}`);
        } else {
          throw new Error(errorMessage);
        }
      }
      
      const markdownText = data.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';
      const parsedText = marked.parse(markdownText);
      
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [
          ...filtered, 
          {
            id: generateId(),
            text: parsedText,
            isBot: true,
          }
        ];
      });
    } catch (error) {
      console.error('Error calling API:', error);
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [
          ...filtered, 
          {
            id: generateId(),
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            isBot: true,
          }
        ];
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`API Error: ${errorMessage}`);
      
      if (error instanceof Error && 
         (errorMessage.toLowerCase().includes('auth') || 
          errorMessage.toLowerCase().includes('credential') || 
          errorMessage.toLowerCase().includes('api key') ||
          errorMessage.includes('401') || 
          errorMessage.includes('403'))) {
        setShowApiKeyForm(true);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
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
        <div className="flex gap-2 items-center">
          <div className="text-xs text-muted-foreground border border-white/10 px-2 py-1 rounded-md mr-1">
            Registration #: 12309075
          </div>
          {!showApiKeyForm && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={changeApiKey}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Change API Key
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="text-xs text-primary/80 hover:text-primary"
          >
            New Chat
          </Button>
        </div>
      </div>
      
      {showApiKeyForm ? (
        <div className="p-6 neo-blur">
          <h4 className="text-lg font-medium mb-4">Enter your OpenRouter API Key</h4>
          <form onSubmit={saveApiKey} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="sk-or-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="focus-visible:ring-primary/30 bg-white/5 border-white/10"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="transition-all duration-300 bg-primary hover:bg-primary/80 hover:shadow-glow-sm"
              >
                Save API Key
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={resetApiKey} 
                className="transition-all duration-300"
              >
                Use Default Key
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
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
        </>
      )}
    </div>
  );
};

export default ReturnAssistant;
