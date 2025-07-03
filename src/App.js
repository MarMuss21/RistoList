import React, { useEffect, useState } from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  // Ascolta lo stato di autenticazione
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Funzione di login con popup
  const login = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error("Errore nel login:", error);
      });
  };

  // Logout
  const logout = () => {
    signOut(auth).catch((error) => {
      console.error("Errore nel logout:", error);
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>RistoList</h1>
      {user ? (
        <>
          <p>Benvenuto, {user.displayName}</p>
          <button onClick={logout} style={{ padding: '0.5rem 1rem' }}>Logout</button>
          <div style={{ marginTop: '2rem' }}>
            <p>Qui potrai vedere gruppi e ristoranti salvati con Firestore.</p>
          </div>
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
