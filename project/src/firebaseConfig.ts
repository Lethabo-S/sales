import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 apiKey: "AIzaSyCcc-4VaNgsDpjPvxOCyaPZI_wNubaleTQ",
  authDomain: "my-sales-chatbot.firebaseapp.com",
  projectId: "my-sales-chatbot",
  storageBucket: "my-sales-chatbot.firebasestorage.app",
  messagingSenderId: "594096587386",
  appId: "1:594096587386:web:b4a0bfdb66c52188d4b1c3",
  measurementId: "G-7362MXJXWR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };