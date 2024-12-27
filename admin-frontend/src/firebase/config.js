import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCkTgEb7H_wNIgVhWwm-l-IzrHXDSe3ni4",
  authDomain: "testcrud-103a3.firebaseapp.com",
  databaseURL: "https://testcrud-103a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testcrud-103a3",
  storageBucket: "testcrud-103a3.appspot.com",
  messagingSenderId: "387302339276",
  appId: "1:387302339276:web:e6c88525a1d80f9d154869",
  measurementId: "G-ZR3EB3CD3Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

