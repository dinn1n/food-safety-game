import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3AifEyYwiVvxuuW5gO1dCKErApbuXrG8",
  authDomain: "foodsafetygame.firebaseapp.com",
  projectId: "foodsafetygame",
  storageBucket: "foodsafetygame.firebasestorage.app",
  messagingSenderId: "292966481996",
  appId: "1:292966481996:web:077cb05d6c422c6ccc34e9",
  measurementId: "G-5458VSST1L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
