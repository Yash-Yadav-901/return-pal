
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { DEFAULT_API_KEY, STORAGE_KEYS } from '@/utils/chatApiUtils';

interface ApiKeyFormProps {
  initialApiKey: string;
  onSave: (apiKey: string) => void;
  onCancel: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ initialApiKey, onSave, onCancel }) => {
  const [apiKey, setApiKey] = useState<string>(initialApiKey);

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    onSave(apiKey);
  };

  const resetApiKey = () => {
    if (DEFAULT_API_KEY) {
      setApiKey(DEFAULT_API_KEY);
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
      onSave(DEFAULT_API_KEY);
      toast.success("Reset to default API key");
    } else {
      toast.error("No default API key available");
    }
  };

  return (
    <div className="p-6 neo-blur">
      <h4 className="text-lg font-medium mb-4">Enter your Gemini API Key</h4>
      <form onSubmit={saveApiKey} className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder="AIzaSyA..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="focus-visible:ring-primary/30 bg-white/5 border-white/10"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio</a>. Your API key is stored locally in your browser.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="transition-all duration-300 bg-primary hover:bg-primary/80 hover:shadow-glow-sm"
          >
            Save API Key
          </Button>
          {DEFAULT_API_KEY && (
            <Button 
              type="button"
              variant="outline"
              onClick={resetApiKey} 
              className="transition-all duration-300"
            >
              Use Default Key
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApiKeyForm;
