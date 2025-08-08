import { useState, useEffect } from 'react';
import { LoginBox } from '../components/chat/LoginBox';
import { ChatArea } from '../components/chat/ChatArea';
import { initializeFirebase, isFirebaseInitialized } from '../lib/firebase';
import { ChatState } from '../types/chat';
import { Badge } from '@/components/ui/badge';

export default function Chat() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    userName: '',
    isAdmin: false,
    activeThread: '',
    isConnected: false,
  });

  useEffect(() => {
    const initFirebase = async () => {
      try {
        await initializeFirebase();
        setChatState(prev => ({ ...prev, isConnected: true }));
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        setChatState(prev => ({ ...prev, isConnected: false }));
      }
    };

    initFirebase();
  }, []);

  const handleLogin = (name: string, isAdmin: boolean) => {
    const activeThread = isAdmin ? '' : name.replace(/\s+/g, '_').toLowerCase();
    
    setChatState({
      userName: name,
      isAdmin,
      activeThread,
      isConnected: isFirebaseInitialized(),
    });
    
    setIsLoggedIn(true);
  };

  const handleThreadChange = (thread: string) => {
    setChatState(prev => ({ ...prev, activeThread: thread }));
  };

  return (
    <div className="min-h-screen font-sans p-2 sm:p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-visiblo p-3 sm:p-6 min-h-[500px] flex flex-col relative">
        
        {/* Admin Badge and Logout */}
        {isLoggedIn && chatState.isAdmin && (
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2">
            <Badge className="bg-visiblo-secondary text-white px-3 py-1.5 text-xs font-bold rounded-lg">
              ADMIN
            </Badge>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                setChatState({
                  userName: '',
                  isAdmin: false,
                  activeThread: '',
                  isConnected: chatState.isConnected,
                });
              }}
              className="text-visiblo-secondary hover:text-visiblo-primary text-xs font-medium underline"
            >
              Zavřít chat
            </button>
          </div>
        )}

        {/* Connection Status */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 text-xs sm:text-sm">
          <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${chatState.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-visiblo-text font-medium hidden sm:inline">
            {chatState.isConnected ? 'Připojeno' : 'Odpojeno'}
          </span>
        </div>

        {/* User Status for non-admin users */}
        {isLoggedIn && !chatState.isAdmin && (
          <div className="mb-3 p-2 bg-visiblo-surface rounded-lg border border-visiblo-border flex items-center justify-between">
            <span className="text-visiblo-text text-sm font-medium">
              Jste přihlášen/a jako <strong>{chatState.userName}</strong>
            </span>
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                setChatState({
                  userName: '',
                  isAdmin: false,
                  activeThread: '',
                  isConnected: chatState.isConnected,
                });
              }}
              className="text-visiblo-secondary hover:text-visiblo-primary text-sm font-medium underline"
            >
              Zavřít chat
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isLoggedIn ? (
          <LoginBox onLogin={handleLogin} />
        ) : (
          <ChatArea 
            chatState={chatState}
            onThreadChange={handleThreadChange}
          />
        )}
      </div>
    </div>
  );
}
