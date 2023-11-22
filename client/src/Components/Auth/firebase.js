import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyApPhPBmYOy5_0rX_0zXP5hC65waWOVhgs",
    authDomain: "tailwind-blogs.firebaseapp.com",
    projectId: "tailwind-blogs",
    storageBucket: "tailwind-blogs.appspot.com",
    messagingSenderId: "346929644295",
    appId: "1:346929644295:web:f0c2c5afb703c20a11fba2",
    measurementId: "G-HTV0HW48ET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, auth, provider, storage };
