import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export default function RestaurantList({ groupId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!groupId) return setRestaurants([]);
    const q = query(collection(db, "restaurants"), where("groupId", "==", groupId));
    const unsub = onSnapshot(q, snap => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setRestaurants(arr);
    });
    return () => unsub();
  }, [groupId]);

  if (!groupId) return null;
  return (
    <div>
      <h3>Ristoranti aggiunti</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {restaurants.length === 0 && <div style={{ color: "#777" }}>Nessun ristorante nel gruppo.</div>}
        {restaurants.map(r => (
          <li
            key={r.id}
            style={{ marginBottom: 10, cursor: "pointer" }}
            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
          >
            <span style={{
              textDecoration: "underline",
              color: "#0074D9",
              fontWeight: 500
            }}>{r.name}</span>
            {expanded === r.id && (
              <div style={{
                border: "1px solid #eee",
                padding: 10,
                borderRadius: 6,
                background: "#fafaff",
                marginTop: 6,
              }}>
                <div><b>Indirizzo:</b> {r.address}</div>
                {r.website && (
                  <div>
                    <b>Sito:</b> <a href={r.website} target="_blank" rel="noopener noreferrer">{r.website}</a>
                  </div>
                )}
                <div><b>Tipi:</b> {r.types && r.types.join(", ")}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
