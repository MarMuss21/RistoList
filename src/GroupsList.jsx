import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import RestaurantSearch from "./RestaurantSearch";

// Funzione per generare link Google Maps preciso
function getMapsLink(r) {
  if (r.place_id) return `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${r.place_id}`;
  if (r.lat && r.lng) return `https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.address)}`;
}

function GroupsList({ user }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [expandedRisto, setExpandedRisto] = useState({});

  // CARICA GRUPPI da Firestore
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "groups"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setGroups(arr);
    });
    return () => unsub();
  }, [user]);

  // CREA GRUPPO
  const addGroup = async () => {
    if (!newGroupName.trim()) return;
    await addDoc(collection(db, "groups"), {
      userId: user.uid,
      name: newGroupName.trim(),
      restaurants: []
    });
    setNewGroupName("");
  };

  // ELIMINA GRUPPO
  const removeGroup = async (groupId) => {
    await deleteDoc(doc(db, "groups", groupId));
    if (selectedGroupId === groupId) setSelectedGroupId(null);
  };

  // AGGIUNGI RISTORANTE (no doppioni)
  const addRestaurantToGroup = async (groupId, restaurant) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    if (group.restaurants?.some(r => r.place_id === restaurant.place_id)) {
      alert("Questo locale è già stato aggiunto al gruppo!");
      return;
    }
    const ref = doc(db, "groups", groupId);
    await updateDoc(ref, {
      restaurants: arrayUnion(restaurant)
    });
  };

  // ELIMINA RISTORANTE
  const removeRestaurantFromGroup = async (groupId, place_id) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const ristoToRemove = group.restaurants.find(r => r.place_id === place_id);
    if (!ristoToRemove) return;
    const ref = doc(db, "groups", groupId);
    await updateDoc(ref, {
      restaurants: arrayRemove(ristoToRemove)
    });
  };

  // GESTIONE EXPAND DETTAGLI
  const toggleRisto = (groupId, place_id) => {
    setExpandedRisto(prev => ({
      ...prev,
      [groupId + "_" + place_id]: !prev[groupId + "_" + place_id]
    }));
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <div>
      <h2>I tuoi gruppi</h2>
      <div style={{ marginBottom: 16 }}>
        {groups.map(group => (
          <div key={group.id}>
            <strong
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedGroupId(group.id)}
            >
              {group.name}
            </strong>
            <button onClick={() => removeGroup(group.id)} style={{ marginLeft: 8 }}>Elimina</button>
          </div>
        ))}
        <input
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="Nuovo gruppo"
        />
        <button onClick={addGroup}>Aggiungi</button>
      </div>
      {selectedGroup && (
        <div style={{ textAlign: 'left', marginTop: 24 }}>
          <h3>{selectedGroup.name}</h3>
          <RestaurantSearch onSelect={r => addRestaurantToGroup(selectedGroup.id, r)} />
          <ul>
            {(!selectedGroup.restaurants || selectedGroup.restaurants.length === 0) && (
              <li>Nessun ristorante aggiunto.</li>
            )}
            {selectedGroup.restaurants?.map(r => (
              <li key={r.place_id} style={{ marginBottom: 8 }}>
                <span
                  style={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
                  onClick={() => toggleRisto(selectedGroup.id, r.place_id)}
                >
                  {r.name}
                </span>
                <button
                  style={{ marginLeft: 8, color: "red" }}
                  onClick={() => removeRestaurantFromGroup(selectedGroup.id, r.place_id)}
                >X</button>
                {expandedRisto[selectedGroup.id + "_" + r.place_id] && (
                  <div style={{ marginLeft: 16, marginTop: 8 }}>
                    <div>
                      <strong>Indirizzo:</strong>{" "}
                      <a
                        href={getMapsLink(r)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >{r.address}</a>
                    </div>
                    {r.website && (
                      <div>
                        <strong>Sito web:</strong>{" "}
                        <a href={r.website} target="_blank" rel="noopener noreferrer">{r.website}</a>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GroupsList;
