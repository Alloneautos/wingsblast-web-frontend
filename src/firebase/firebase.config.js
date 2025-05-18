// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxCKTVWFPGSpyevVxehJsjxMMQn39LvrY",
  authDomain: "wings-blast-38456.firebaseapp.com",
  projectId: "wings-blast-38456",
  storageBucket: "wings-blast-38456.firebasestorage.app",
  messagingSenderId: "13340238628",
  appId: "1:13340238628:web:4805966ce63c71fa88c9b1",
  measurementId: "G-JYQLVDF66Q"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
