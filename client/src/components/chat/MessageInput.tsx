import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <Input 
        type="text"
        placeholder="Napište zprávu..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-visiblo-border rounded-xl text-base sm:text-lg transition-all duration-300 focus:border-visiblo-primary-dark focus:bg-visiblo-bg-lighter"
      />
      <Button 
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="bg-visiblo-primary text-white font-bold px-4 sm:px-8 py-2 sm:py-3 rounded-xl text-base sm:text-lg shadow-visiblo-button hover:bg-visiblo-primary-dark hover:shadow-visiblo-button-hover transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <Send className="w-5 h-5" />
        Odeslat
      </Button>
    </div>
  );
}
