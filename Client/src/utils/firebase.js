
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shifraai-b2007.firebaseapp.com",
  projectId: "shifraai-b2007",
  storageBucket: "shifraai-b2007.firebasestorage.app",
  messagingSenderId: "730274530403",
  appId: "1:730274530403:web:9a43bc5c89b4a7eaef6456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export {auth, provider};