import { useEffect, useRef } from 'react';
import { Message } from '../../types/chat';

interface MessagesListProps {
  messages: Message[];
}

export function MessagesList({ messages }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-visiblo-surface border-2 border-visiblo-border rounded-xl p-3 sm:p-4 mb-4 overflow-y-auto custom-scrollbar h-[250px] sm:h-[300px]">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-visiblo-text/50">
          <p>Zatím zde nejsou žádné zprávy. Začněte konverzaci!</p>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div 
              key={message.id} 
              className="message opacity-0 animate-slide-in mb-4"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <span className={`font-bold ${message.isAdmin ? 'text-visiblo-secondary' : 'text-visiblo-primary'}`}>
                {message.name}
              </span>
              : <span>{message.text}</span>
              <div className="text-xs text-gray-500 mt-1">
                {formatTime(message.time)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
