import { useState, useEffect } from 'react';
import { MessagesList } from './MessagesList';
import { MessageInput } from './MessageInput';
import { AdminPanel } from './AdminPanel';
import { getDatabase } from '../../lib/firebase';
import { Message, ChatState } from '../../types/chat';
import { useToast } from '@/hooks/use-toast';
import { notificationManager } from '../../lib/notifications';

interface ChatAreaProps {
  chatState: ChatState;
  onThreadChange: (thread: string) => void;
}

export function ChatArea({ chatState, onThreadChange }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableThreads, setAvailableThreads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  // Inicializace notifikací pro admin uživatele
  useEffect(() => {
    const initNotifications = async () => {
      if (chatState.isAdmin) {
        const success = await notificationManager.initialize(true);
        if (success) {
          const currentPermission = notificationManager.getCurrentPermission();
          setNotificationPermission(currentPermission);
          
          // Pokud ještě nemáme povolení, zeptáme se
          if (currentPermission === 'default') {
            const hasPermission = await notificationManager.requestPermission();
            setNotificationPermission(hasPermission ? 'granted' : 'denied');
          }
        }
      } else if (notificationManager.isAdminDevice()) {
        // Zařízení bylo dříve označeno jako admin, zachováme notifikace
        const currentPermission = notificationManager.getCurrentPermission();
        setNotificationPermission(currentPermission);
      }
    };
    
    initNotifications();
  }, [chatState.isAdmin]);

  useEffect(() => {
    if (!chatState.activeThread) return;

    const db = getDatabase();
    const threadRef = db.ref(`threads/${chatState.activeThread}`);

    setMessages([]);
    setIsLoading(true);

    const handleNewMessage = (snapshot: any) => {
      const messageData = snapshot.val();
      if (messageData) {
        // Check if message is older than 10 hours (36000000 ms)
        const tenHoursAgo = Date.now() - (10 * 60 * 60 * 1000);
        if (messageData.time < tenHoursAgo) {
          // Delete old message
          snapshot.ref.remove();
          return;
        }

        const message: Message = {
          id: snapshot.key,
          name: messageData.name,
          text: messageData.text,
          time: messageData.time,
          isAdmin: messageData.name === 'Matěj Podhola'
        };
        
        setMessages(prev => {
          const existing = prev.find(m => m.id === message.id);
          if (existing) return prev;
          
          // Poslat notifikaci pro admin zařízení, pokud zpráva není od admina
          if ((chatState.isAdmin || notificationManager.isAdminDevice()) && !message.isAdmin && notificationPermission === 'granted') {
            notificationManager.showLocalNotification(
              `Nová zpráva od ${message.name}`,
              message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text
            );
          }
          
          return [...prev, message].sort((a, b) => a.time - b.time);
        });
      }
      setIsLoading(false);
    };

    threadRef.on('child_added', handleNewMessage);

    // Cleanup old messages periodically
    const cleanupInterval = setInterval(() => {
      const tenHoursAgo = Date.now() - (10 * 60 * 60 * 1000);
      threadRef.orderByChild('time').endAt(tenHoursAgo).once('value', (snapshot: any) => {
        const updates: any = {};
        snapshot.forEach((child: any) => {
          updates[child.key] = null;
        });
        if (Object.keys(updates).length > 0) {
          threadRef.update(updates);
        }
      });
    }, 60 * 60 * 1000); // Run once per hour

    return () => {
      threadRef.off('child_added', handleNewMessage);
      clearInterval(cleanupInterval);
    };
  }, [chatState.activeThread]);

  useEffect(() => {
    if (!chatState.isAdmin) return;

    const db = getDatabase();
    const threadsRef = db.ref('threads');

    const handleThreadsUpdate = (snapshot: any) => {
      const threads: string[] = [];
      snapshot.forEach((child: any) => {
        threads.push(child.key);
      });
      setAvailableThreads(threads);
      
      if (threads.length > 0 && !chatState.activeThread) {
        onThreadChange(threads[0]);
      }
    };

    threadsRef.on('value', handleThreadsUpdate);

    return () => {
      threadsRef.off('value', handleThreadsUpdate);
    };
  }, [chatState.isAdmin, chatState.activeThread, onThreadChange]);

  const handleSendMessage = async (messageText: string) => {
    if (!chatState.userName) return;

    // For non-admin users, ensure activeThread is set based on their username
    const threadName = chatState.isAdmin ? chatState.activeThread : chatState.userName.replace(/\s+/g, '_').toLowerCase();
    
    if (!threadName) return;

    try {
      const db = getDatabase();
      await db.ref(`threads/${threadName}`).push({
        name: chatState.userName,
        text: messageText,
        time: Date.now(),
      });

      toast({
        title: "Zpráva odeslána",
        description: "Vaše zpráva byla úspěšně odeslána.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Chyba při odesílání",
        description: "Nepodařilo se odeslat zprávu. Zkuste to znovu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteThread = async (threadName: string) => {
    try {
      const db = getDatabase();
      await db.ref(`threads/${threadName}`).remove();
      
      toast({
        title: "Chat smazán",
        description: "Chat a celá jeho historie byly úspěšně smazány.",
      });

      // Clear current thread if it was deleted
      if (chatState.activeThread === threadName) {
        onThreadChange('');
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      toast({
        title: "Chyba při mazání",
        description: "Nepodařilo se smazat chat. Zkuste to znovu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {chatState.isAdmin && (
        <AdminPanel 
          availableThreads={availableThreads}
          activeThread={chatState.activeThread}
          onThreadChange={onThreadChange}
          onDeleteThread={handleDeleteThread}
        />
      )}
      
      {/* Notification Status pro admin */}
      {(chatState.isAdmin || notificationManager.isAdminDevice()) && (
        <div className="mb-2 text-xs text-gray-600 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <div className={`w-2 h-2 rounded-full ${
            notificationPermission === 'granted' ? 'bg-green-500' : 
            notificationPermission === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></div>
          <span>
            Notifikace: {
              notificationPermission === 'granted' ? 'Aktivní' : 
              notificationPermission === 'denied' ? 'Zakázány' : 'Čekají na povolení'
            }
          </span>
          {(notificationPermission === 'denied' || notificationPermission === 'default') && (
            <button 
              onClick={async () => {
                try {
                  const hasPermission = await notificationManager.requestPermission();
                  setNotificationPermission(hasPermission ? 'granted' : 'denied');
                  
                  if (hasPermission) {
                    toast({
                      title: "Notifikace povoleny",
                      description: "Budete dostávat upozornění na nové zprávy.",
                    });
                  }
                } catch (error) {
                  console.error('Error requesting permission:', error);
                  toast({
                    title: "Chyba",
                    description: "Nepodařilo se povolit notifikace. Zkuste to v nastavení prohlížeče.",
                    variant: "destructive",
                  });
                }
              }}
              className="text-blue-600 underline ml-2 hover:text-blue-800 font-medium"
            >
              Povolit nyní
            </button>
          )}
          {chatState.isAdmin && (
            <button 
              onClick={() => {
                notificationManager.clearAdminDevice();
                setNotificationPermission('default');
                toast({
                  title: "Zařízení resetováno",
                  description: "Toto zařízení již nebude dostávat notifikace.",
                });
              }}
              className="text-red-600 underline ml-2 hover:text-red-800 text-xs"
            >
              Resetovat
            </button>
          )}
        </div>
      )}
      
      <MessagesList messages={messages} />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={!chatState.isConnected || (chatState.isAdmin && !chatState.activeThread)}
      />
    </div>
  );
}
