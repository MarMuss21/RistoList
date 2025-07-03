import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDi3uCyD4p4iB0c-zS-2Eg90MbrWreL4KE",
  authDomain: "amici-di-risto.firebaseapp.com",
  projectId: "amici-di-risto",
  storageBucket: "amici-di-risto.appspot.com",
  messagingSenderId: "508835556624",
  appId: "1:508835556624:web:dad52d1531746b0604995",
  measurementId: "G-84KMNSLRZD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
