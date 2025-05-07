import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGkDOATueJpWqqlaIdDLlCH-VeWK3tVEQ",
  authDomain: "wings-blast.firebaseapp.com",
  projectId: "wings-blast",
  storageBucket: "wings-blast.appspot.com",
  messagingSenderId: "609170393614",
  appId: "1:609170393614:web:8e093092bcd5cdde1f0a5f",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
