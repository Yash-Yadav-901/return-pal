
import React from 'react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onChangeApiKey: () => void;
  onReset: () => void;
  showApiKeyForm: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onChangeApiKey, 
  onReset, 
  showApiKeyForm 
}) => {
  return (
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
            onClick={onChangeApiKey}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Change API Key
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="text-xs text-primary/80 hover:text-primary"
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
