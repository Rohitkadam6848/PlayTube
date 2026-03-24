// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "playtubelogin-5d1f4.firebaseapp.com",
  projectId: "playtubelogin-5d1f4",
  storageBucket: "playtubelogin-5d1f4.firebasestorage.app",
  messagingSenderId: "566788616818",
  appId: "1:566788616818:web:5a2af88f4aef38451648eb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
