// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE",
  authDomain: "amici-di-risto.firebaseapp.com",
  projectId: "amici-di-risto",
  storageBucket: "amici-di-risto.appspot.com",
  messagingSenderId: "508835556624",
  appId: "1:508835556624:web:dad52d15351746b6b64995",
  measurementId: "G-84KMNSLRZD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
