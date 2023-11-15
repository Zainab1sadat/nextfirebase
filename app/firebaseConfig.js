// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnQI8TQ6GAZTLV9r70QAWkQVr2EMYQvo4",
  authDomain: "nextjsfirebase-9ff31.firebaseapp.com",
  projectId: "nextjsfirebase-9ff31",
  storageBucket: "nextjsfirebase-9ff31.appspot.com",
  messagingSenderId: "106936728481",
  appId: "1:106936728481:web:e063d1392611dd7923e9e0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};