
import { toast } from "sonner";
import { marked } from 'marked';
import { generateId } from './chatbotUtils';

export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  typing?: boolean;
}

export interface ApiMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
}

export const STORAGE_KEYS = {
  API_KEY: 'openrouter_api_key',
  CHAT_HISTORY: 'return_assistant_chat_history'
};

// Default API key for teacher demonstration
export const DEFAULT_API_KEY = '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';

export const getSystemPrompt = (): string => {
  return "You are a return and refund assistant. You help customers with product returns and refunds. You should remember details that the customer provides about their order, such as order numbers or product details. If a question is not related to product returns or refunds, respond with 'I can only answer questions about product returns and refunds.' IMPORTANT: ONLY RESPOND WITH THE FINAL ANSWER. DO NOT INCLUDE ANY THINKING, REASONING, OR EXPLANATION ABOUT HOW YOU'RE GENERATING THE RESPONSE.";
};

export const fetchChatResponse = async (
  apiKey: string,
  conversationHistory: ApiMessage[],
  userInput: string,
  onSuccess: (text: string) => void,
  onError: (error: Error) => void
) => {
  try {
    const systemPrompt = getSystemPrompt();
    
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userInput }
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
    
    onSuccess(parsedText);
  } catch (error) {
    console.error('Error calling API:', error);
    onError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};

export const handleApiError = (error: Error, setShowApiKeyForm: (show: boolean) => void) => {
  const errorMessage = error.message;
  toast.error(`API Error: ${errorMessage}`);
  
  if (errorMessage.toLowerCase().includes('auth') || 
      errorMessage.toLowerCase().includes('credential') || 
      errorMessage.toLowerCase().includes('api key') ||
      errorMessage.includes('401') || 
      errorMessage.includes('403')) {
    setShowApiKeyForm(true);
  }
};

export const loadChatHistory = (): Message[] | null => {
  const savedChatHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
  if (savedChatHistory) {
    try {
      const parsedHistory = JSON.parse(savedChatHistory) as Message[];
      if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
        return parsedHistory;
      }
    } catch (error) {
      console.error('Error parsing chat history:', error);
    }
  }
  return null;
};

export const saveChatHistory = (messages: Message[]): void => {
  const historyToSave = messages.filter(msg => !msg.typing);
  localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(historyToSave));
};

export const convertToApiMessages = (messages: Message[]): ApiMessage[] => {
  return messages
    .filter(msg => !msg.typing)
    .map(msg => ({
      role: msg.isBot ? 'assistant' : 'user',
      content: msg.text
    }));
};
