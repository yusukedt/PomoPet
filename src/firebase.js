// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq-vzo0tw9Pz8odhdu1M5YnbgJRTwpaK4",
  authDomain: "testapp-5c30b.firebaseapp.com",
  projectId: "testapp-5c30b",
  storageBucket: "testapp-5c30b.appspot.com",
  messagingSenderId: "95142147789",
  appId: "1:95142147789:web:e3488864739fda587c1b84",
  measurementId: "G-VS9BWBLJP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export { auth, analytics, db };


