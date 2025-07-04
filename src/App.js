import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import GroupsList from "./GroupsList";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Errore nel login:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Errore nel logout:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>RistoList</h1>
      {user ? (
        <>
          <p>Benvenuto, {user.displayName}</p>
          <button onClick={logout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
          <GroupsList user={user} />
        </>
      ) : (
        <>
          <p>Accedi per iniziare a usare l'app</p>
          <button onClick={login} style={{ padding: '0.5rem 1rem' }}>Login con Google</button>
        </>
      )}
    </div>
  );
}
