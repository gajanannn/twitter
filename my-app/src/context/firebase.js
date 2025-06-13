// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFB1jJ8lHRMhChGstMq48cMS0UVdDQ9cs",
  authDomain: "twiller-a0402.firebaseapp.com",
  projectId: "twiller-a0402",
  storageBucket: "twiller-a0402.firebasestorage.app",
  messagingSenderId: "663354468778",
  appId: "1:663354468778:web:297a3f79501873c15ce3d3",
  measurementId: "G-E26NZ37FLX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
