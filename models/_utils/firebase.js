import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCZAy07-VLVzkOZ63s63PlayEL4YrYMiyg",
  authDomain: "splittrackapp1.firebaseapp.com",
  projectId: "splittrackapp1",
  storageBucket: "splittrackapp1.firebasestorage.app",
  messagingSenderId: "499313206979",
  appId: "1:499313206979:web:02e67d33cce36d38aee476"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);