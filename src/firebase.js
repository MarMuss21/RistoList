// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// !!! ATTENZIONE: sostituisci i valori qui sotto con quelli del tuo progetto Firebase !!!
const firebaseConfig = {
  apiKey: "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE",
  authDomain: "amici-di-risto.firebaseapp.com",
  projectId: "amici-di-risto",
  storageBucket: "amici-di-risto.appspot.com",
  messagingSenderId: "508835556624",
  appId: "1:508835556624:web:dad52d15351746b6064995",      // <-- questo lo trovi nella console firebase
  measurementId: "G-xxxxxxx"                // <-- opzionale
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
