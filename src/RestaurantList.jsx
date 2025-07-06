import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function RestaurantList({ user, groupId }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!groupId) return setList([]);
    const ref = collection(db, "groups", groupId, "restaurants");
    const q = query(ref, where("userId", "==", user.uid));
    return onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setList(arr);
    });
  }, [user.uid, groupId]);

  const remove = async (id) => {
    await deleteDoc(doc(db, "groups", groupId, "restaurants", id));
  };

  const toggleEdit = (idx) => {
    setList(list.map((r, i) => i === idx ? { ...r, editing: !r.editing } : r));
  };

  const saveEdit = async (idx) => {
    const r = list[idx];
    await updateDoc(doc(db, "groups", groupId, "restaurants", r.id), {
      name: r.name,
      address: r.address,
      website: r.website
    });
    toggleEdit(idx);
  };

  const onChangeField = (idx, field, value) => {
    setList(list.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  return (
    <div style={{ textAlign: "left", marginTop: "1rem" }}>
      <h3>Ristoranti</h3>
      {list.length === 0 && <p>Nessun ristorante aggiunto.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {list.map((r, i) => (
          <li key={r.id} style={{
            border: "1px solid #ccc", padding: "8px", marginBottom: "8px",
            borderRadius: 4, display: "flex", justifyContent: "space-between"
          }}>
            {r.editing ? (
              <div style={{ flex: 1 }}>
                <input
                  value={r.name}
                  onChange={e => onChangeField(i, "name", e.target.value)}
                  style={{ width: "100%", marginBottom: 4 }}
                />
                <input
                  value={r.address}
                  onChange={e => onChangeField(i, "address", e.target.value)}
                  style={{ width: "100%", marginBottom: 4 }}
                />
                <input
                  value={r.website}
                  onChange={e => onChangeField(i, "website", e.target.value)}
                  style={{ width: "100%" }}
                />
                <button onClick={() => saveEdit(i)} style={{ marginTop: 4 }}>Salva</button>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <b>{r.name}</b><br/>
                {r.address}<br/>
                {r.website && <a href={r.website} target="_blank" rel="noreferrer">Sito</a>}
              </div>
            )}
            <div style={{ marginLeft: 8, textAlign: "right" }}>
              <button onClick={() => remove(r.id)} style={{ display: "block", marginBottom: 4 }}>Elimina</button>
              <button onClick={() => toggleEdit(i)}>
                {r.editing ? "Annulla" : "Modifica"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
