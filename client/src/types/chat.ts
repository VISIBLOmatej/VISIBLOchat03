export interface Message {
  id: string;
  name: string;
  text: string;
  time: number;
  isAdmin: boolean;
}

export interface Thread {
  [messageId: string]: Message;
}

export interface ChatState {
  userName: string;
  isAdmin: boolean;
  activeThread: string;
  isConnected: boolean;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
