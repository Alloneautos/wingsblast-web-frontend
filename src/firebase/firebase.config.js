// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGkDOATueJpWqqlaIdDLlCH-VeWK3tVEQ",
  authDomain: "wings-blast.firebaseapp.com",
  projectId: "wings-blast",
  storageBucket: "wings-blast.appspot.com",
  messagingSenderId: "609170393614",
  appId: "1:609170393614:web:8e093092bcd5cdde1f0a5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;