import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2vqvnasBP_zbUADliTfEhyQOI_c72Zig",
  authDomain: "algorithmx-a7e6a.firebaseapp.com",
  databaseURL: "https://algorithmx-a7e6a-default-rtdb.firebaseio.com",
  projectId: "algorithmx-a7e6a",
  storageBucket: "algorithmx-a7e6a.firebasestorage.app",
  messagingSenderId: "965115253574",
  appId: "1:965115253574:web:91575f97017a64b1de0b47",
  measurementId: "G-SQ8VCDMESZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
