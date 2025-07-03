// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDi3uCJyDp4i4Bc-zs-2Eg9OWbriWeL4KE",
  authDomain: "amici-di-risto.firebaseapp.com",
  projectId: "amici-di-risto",
  storageBucket: "amici-di-risto.appspot.com",
  messagingSenderId: "580835556624",
  appId: "1:580835556624:web:dad52d15351746b6064995",
  measurementId: "G-84KMNSLRZD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
