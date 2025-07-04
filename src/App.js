// src/App.js
import React, { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import GroupsList from "./components/GroupsList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const login = () => {
    signInWithPopup(auth, provider)
      .then(({ user }) => setUser(user))
      .catch(console.error);
  };

  const logout = () => {
    signOut(auth).catch(console.error);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>RistoList</h1>
      {user ? (
        <>
          <p>Benvenuto, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
          <GroupsList user={user} />
        </>
      ) : (
        <>
          <p>Accedi per iniziare a usare l'app</p>
          <button onClick={login}>Login con Google</button>
        </>
      )}
    </div>
  );
}

export default App;
