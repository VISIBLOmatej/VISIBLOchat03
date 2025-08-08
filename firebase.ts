import { FirebaseConfig } from '../types/chat';

let firebase: any = null;
let database: any = null;

export const initializeFirebase = async (): Promise<void> => {
  if (firebase) return;

  // Load Firebase SDK
  const firebaseScript = document.createElement("script");
  firebaseScript.src = "https://www.gstatic.com/firebasejs/8.10.0/firebase.js";
  document.head.appendChild(firebaseScript);
  
  await new Promise((resolve) => {
    firebaseScript.onload = resolve;
  });

  firebase = (window as any).firebase;

  // Firebase configuration from environment variables or fallback
  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCE39_t-Yoh1zlYGowcpc3JU7YDYmcR5Dc",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visiblo-web-chat.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://visiblo-web-chat-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visiblo-web-chat",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visiblo-web-chat.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "569196016685",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:569196016685:web:3da409c22c6034fa3574a4"
  };

  firebase.initializeApp(config);
  database = firebase.database();
};

export const getDatabase = () => {
  if (!database) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return database;
};

export const isFirebaseInitialized = () => {
  return firebase !== null && database !== null;
};
