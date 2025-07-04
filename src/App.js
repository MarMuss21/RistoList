import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

import GroupsList       from "./GroupsList";
import RestaurantSearch from "./RestaurantSearch";
import RestaurantList   from "./RestaurantList";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = () => {
    signInWithPopup(auth, provider).catch(console.error);
  };

  const logout = () => {
    signOut(auth).catch(console.error);
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

export default App;
