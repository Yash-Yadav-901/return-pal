
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
  role: 'system' | 'user' | 'model';
  parts: { text: string }[];
}

export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  CHAT_HISTORY: 'return_assistant_chat_history'
};

// Default API key - users will need to provide their own Gemini API key
export const DEFAULT_API_KEY = '';

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
    if (!apiKey.trim()) {
      throw new Error("API key is missing. Please provide a valid Gemini API key.");
    }
    
    const systemPrompt = getSystemPrompt();
    
    // Convert conversation history to Gemini format
    let geminiMessages: ApiMessage[] = [];
    
    // Add system prompt as first user message
    geminiMessages.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    
    // Add first model response if we have conversation history
    if (conversationHistory.length > 0) {
      geminiMessages.push({
        role: 'model',
        parts: [{ text: "I understand. I'll help with return and refund inquiries only." }]
      });
    }
    
    // Add the rest of the conversation
    for (const msg of conversationHistory) {
      geminiMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.parts[0].text }]
      });
    }
    
    // Add current user input
    geminiMessages.push({
      role: 'user',
      parts: [{ text: userInput }]
    });
    
    console.log('Sending request to Gemini API with API key:', apiKey.substring(0, 5) + '...');
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey.trim()}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });
    
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
      
      if (response.status === 400 && errorMessage.includes('API key')) {
        throw new Error(`Authentication error: Invalid API key`);
      } else {
        throw new Error(errorMessage);
      }
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated. Try again with a different prompt.');
    }
    
    // Extract text from the first candidate's content
    const markdownText = data.candidates[0].content.parts[0].text || 'Sorry, I could not process your request.';
    const parsedText = marked.parse(markdownText);
    
    onSuccess(parsedText);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    onError(error instanceof Error ? error : new Error('Unknown error occurred'));
  }
};

export const handleApiError = (error: Error, setShowApiKeyForm: (show: boolean) => void) => {
  const errorMessage = error.message;
  toast.error(`API Error: ${errorMessage}`);
  
  if (errorMessage.toLowerCase().includes('api key') || 
      errorMessage.toLowerCase().includes('auth') || 
      errorMessage.toLowerCase().includes('credential') || 
      errorMessage.includes('400')) {
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
      role: msg.isBot ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
};

