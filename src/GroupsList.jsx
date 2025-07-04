import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function useGroups(userId) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!userId) {
      setGroups([]);
      return;
    }

    const q = query(collection(db, "groups"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const groupsData = [];
      querySnapshot.forEach((doc) => {
        groupsData.push({ id: doc.id, ...doc.data() });
      });
      setGroups(groupsData);
    });

    return () => unsubscribe();
  }, [userId]);

  return groups;
}

export default function GroupsList({ user }) {
  const groups = useGroups(user.uid);
  const [newGroupName, setNewGroupName] = useState('');

  const addGroup = async () => {
    if (newGroupName.trim() === '') return;
    await addDoc(collection(db, "groups"), {
      userId: user.uid,
      name: newGroupName.trim(),
    });
    setNewGroupName('');
  };

  const deleteGroup = async (groupId) => {
    await deleteDoc(doc(db, "groups", groupId));
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>I tuoi gruppi</h2>
      <ul>
        {groups.map(g => (
          <li key={g.id}>
            {g.name} <button onClick={() => deleteGroup(g.id)}>Elimina</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newGroupName}
        onChange={e => setNewGroupName(e.target.value)}
        placeholder="Nuovo gruppo"
        style={{ padding: '0.5rem', width: '200px' }}
      />
      <button onClick={addGroup} style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem' }}>
        Aggiungi gruppo
      </button>
    </div>
  );
}
