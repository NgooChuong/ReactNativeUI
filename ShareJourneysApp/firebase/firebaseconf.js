// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "sharejourneysapp.firebaseapp.com",
  projectId: "sharejourneysapp",
  storageBucket: "sharejourneysapp.appspot.com",
  messagingSenderId: "91120154472",
  appId: "1:91120154472:web:85ec52d30ba50def2308dd"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authentication= initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db= getFirestore(app)
export const storage =  getStorage(app);