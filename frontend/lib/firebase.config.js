// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtcEjFMJfVKWJ5xM4NA4couUrGnquDLoM",
  authDomain: "everlybeautiesbd-3b2e4.firebaseapp.com",
  projectId: "everlybeautiesbd-3b2e4",
  storageBucket: "everlybeautiesbd-3b2e4.firebasestorage.app",
  messagingSenderId: "155479835041",
  appId: "1:155479835041:web:be87623a5ba812a4358be0",
  measurementId: "G-NX4LSL0Y6R",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };