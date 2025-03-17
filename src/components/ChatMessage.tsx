
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    isBot: boolean;
    typing?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [message.text, message.typing]);

  if (message.typing) {
    return (
      <div 
        ref={messageRef}
        className="flex items-start mb-4 animate-fade-in"
      >
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 shadow-glow-xs">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-primary"
          >
            <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V8.625H19" />
          </svg>
        </div>
        <div className="neo-blur rounded-xl rounded-tl-none p-4 max-w-[80%] transform hover:translate-y-[-2px] transition-all duration-300 shadow-glow-xs">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={messageRef}
      className={cn(
        "flex items-start mb-4 animate-fade-in",
        message.isBot ? "" : "flex-row-reverse"
      )}
    >
      {message.isBot ? (
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-4 shadow-glow-xs">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-primary"
          >
            <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V8.625M13.5 3L19 8.625M13.5 3V8.625H19" />
          </svg>
        </div>
      ) : (
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center ml-4 shadow-glow-xs">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-secondary-foreground"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
      <div
        className={cn(
          "p-4 max-w-[80%] whitespace-pre-wrap transform hover:translate-y-[-2px] transition-all duration-300",
          message.isBot 
            ? "neo-blur rounded-xl rounded-tl-none shadow-glow-xs" 
            : "bg-primary text-primary-foreground rounded-xl rounded-tr-none shadow-glow-xs"
        )}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
