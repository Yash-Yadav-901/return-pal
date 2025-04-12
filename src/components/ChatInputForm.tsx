
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputFormProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isTyping: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ 
  input, 
  setInput, 
  handleSubmit, 
  isTyping 
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
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
  );
};

export default ChatInputForm;
