// Import the necessary Firebase SDK modules
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';  // Firestore Database
import { getAuth } from 'firebase/auth';            // Firebase Authentication

// Firebase configuration object (from the provided details)
const firebaseConfig = {
  apiKey: "AIzaSyD4vKkfcPFB-vNnv835dG815EIc3yhSWw0",
  projectId: "smartformingpost",
  storageBucket: "smartformingpost.appspot.com",
  appId: "1:499531494649:android:abcb81955be13706e7de28",
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Firestore instance (use this for Firestore)
export const db = getFirestore(app);

// Firebase Auth instance (use this if you need authentication)
export const auth = getAuth(app);
