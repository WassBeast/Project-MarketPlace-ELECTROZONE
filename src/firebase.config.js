// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Add this line if it's missing
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAln3XrAVh1S8TqhO8mqnlvRF07e4lNsIM",
  authDomain: "marketplace-888.firebaseapp.com",
  projectId: "marketplace-888",
  storageBucket: "marketplace-888.appspot.com",
  messagingSenderId: "886690924504",
  appId: "1:886690924504:web:38fa0452430c29d45d54ad",
  measurementId: "G-5FKC5LL0HY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Ensure this line is correct
const auth = getAuth(app); // Optional if you are handling authentication

export { db, auth };