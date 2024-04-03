// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "me-estate.firebaseapp.com",
  projectId: "me-estate",
  storageBucket: "me-estate.appspot.com",
  messagingSenderId: "732911529896",
  appId: "1:732911529896:web:afdbf6c9e58f0f767fb79d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);