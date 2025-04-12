
import React, { useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { generateId, getInitialMessage } from '@/utils/chatbotUtils';
import { 
  Message, 
  DEFAULT_API_KEY, 
  STORAGE_KEYS, 
  fetchChatResponse, 
  handleApiError, 
  loadChatHistory, 
  saveChatHistory, 
  convertToApiMessages 
} from '@/utils/chatApiUtils';
import ApiKeyForm from './ApiKeyForm';
import ChatInputForm from './ChatInputForm';
import ChatMessagesList from './ChatMessagesList';
import ChatHeader from './ChatHeader';

const ReturnAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Load API key from local storage or use default
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load chat history or set initial message
    const savedHistory = loadChatHistory();
    if (savedHistory) {
      setMessages(savedHistory);
      return; // Skip adding initial message if we loaded history
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
      saveChatHistory(messages);
    }
  }, [messages]);

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeyForm(false);
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
    
    const conversationHistory = convertToApiMessages(messages);
    
    const handleSuccess = (parsedText: string) => {
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
    };
    
    const handleError = (error: Error) => {
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.typing);
        return [
          ...filtered, 
          {
            id: generateId(),
            text: `Error: ${error.message}`,
            isBot: true,
          }
        ];
      });
      
      handleApiError(error, setShowApiKeyForm);
    };
    
    try {
      await fetchChatResponse(
        apiKey,
        conversationHistory,
        input,
        handleSuccess,
        handleError
      );
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
      <ChatHeader 
        onChangeApiKey={changeApiKey} 
        onReset={handleReset} 
        showApiKeyForm={showApiKeyForm} 
      />
      
      {showApiKeyForm ? (
        <ApiKeyForm 
          initialApiKey={apiKey}
          onSave={handleSaveApiKey}
          onCancel={() => setShowApiKeyForm(false)}
        />
      ) : (
        <>
          <ChatMessagesList messages={messages} />
          <ChatInputForm 
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isTyping={isTyping}
          />
        </>
      )}
    </div>
  );
};

export default ReturnAssistant;
