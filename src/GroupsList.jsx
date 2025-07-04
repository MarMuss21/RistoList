import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import RestaurantSearch from "./RestaurantSearch";
import RestaurantList   from "./RestaurantList";

function useGroups(userId) {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    if (!userId) return setGroups([]);
    const q = query(collection(db, "groups"), where("userId", "==", userId));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setGroups(arr);
    });
    return () => unsub();
  }, [userId]);
  return groups;
}

export default function GroupsList({ user }) {
  const groups = useGroups(user.uid);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const addGroup = async () => {
    if (!newGroupName.trim()) return;
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
      <ul style={{ listStyle: "none", padding: 0 }}>
        {groups.map((g) => (
          <li
            key={g.id}
            onClick={() => setSelectedGroupId(g.id)}
            style={{
              cursor: "pointer",
              fontWeight: g.id === selectedGroupId ? "bold" : "normal",
              marginBottom: 4
            }}
          >
            {g.name}
            <button
              onClick={(e) => { e.stopPropagation(); deleteGroup(g.id); }}
              style={{ marginLeft: 8 }}
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Nuovo gruppo"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addGroup} style={{ padding: "8px 16px" }}>
          Aggiungi
        </button>
      </div>

      {selectedGroupId && (
        <>
          <RestaurantSearch user={user} groupId={selectedGroupId} />
          <RestaurantList   user={user} groupId={selectedGroupId} />
        </>
      )}
    </div>
  );
}