import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import RestaurantSearch from "./RestaurantSearch";

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
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const addGroup = async () => {
    if (newGroupName.trim() === "") return;
    await addDoc(collection(db, "groups"), {
      userId: user.uid,
      name: newGroupName.trim(),
    });
    setNewGroupName("");
  };

  const deleteGroup = async (groupId) => {
    await deleteDoc(doc(db, "groups", groupId));
    if (selectedGroupId === groupId) setSelectedGroupId(null);
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>I tuoi gruppi</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {groups.map((g) => (
          <li
            key={g.id}
            style={{
              cursor: "pointer",
              fontWeight: g.id === selectedGroupId ? "bold" : "normal",
              marginBottom: "0.5rem",
            }}
            onClick={() => setSelectedGroupId(g.id)}
          >
            {g.name}{" "}
            <button onClick={(e) => {
              e.stopPropagation();
              deleteGroup(g.id);
            }} style={{ marginLeft: '0.5rem' }}>
              Elimina
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Nuovo gruppo"
          style={{ padding: "0.5rem", flex: 1 }}
        />
        <button onClick={addGroup} style={{ padding: "0.5rem 1rem" }}>
          Aggiungi gruppo
        </button>
      </div>
      {selectedGroupId && (
        <RestaurantSearch user={user} groupId={selectedGroupId} />
      )}
    </div>
);
}
