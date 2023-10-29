// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-auth-c2dc1.firebaseapp.com',
  projectId: 'mern-auth-c2dc1',
  storageBucket: 'mern-auth-c2dc1.appspot.com',
  messagingSenderId: '272032085504',
  appId: '1:272032085504:web:6a1e4e8fb27ca34a030ae5',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
