import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export default function RestaurantList({ groupId }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);

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
      <h3>Ristoranti nel gruppo</h3>
      <ul style={{ padding: 0 }}>
        {restaurants.map(r => (
          <li
            key={r.id}
            onClick={() => setSelected(selected === r.id ? null : r.id)}
            style={{
              cursor: "pointer",
              fontWeight: selected === r.id ? "bold" : "normal",
              marginBottom: 4,
              listStyle: "none"
            }}
          >
            {r.name}
            {selected === r.id && (
              <div style={{ marginLeft: 16, fontWeight: "normal", marginTop: 8, marginBottom: 8 }}>
                <b>Indirizzo:</b> {r.address || "-"} <br />
                {r.website && (
                  <span>
                    <b>Sito:</b>{" "}
                    <a href={r.website} target="_blank" rel="noopener noreferrer">
                      {r.website}
                    </a>
                    <br />
                  </span>
                )}
                <b>Tipi:</b> {r.details?.types?.join(", ") || "-"}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
