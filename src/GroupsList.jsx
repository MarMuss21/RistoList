import React, { useState } from "react";
import RestaurantSearch from "./RestaurantSearch";

function GroupsList({ user }) {
  const [groups, setGroups] = useState([
    // Puoi rimpiazzare questi con il tuo storage!
    { name: "Calcetto", restaurants: [] },
    { name: "Lavoro", restaurants: [] },
  ]);
  const [newGroup, setNewGroup] = useState("");
  const [expanded, setExpanded] = useState({});

  // Aggiungi gruppo
  const addGroup = () => {
    if (newGroup && !groups.find((g) => g.name === newGroup)) {
      setGroups([...groups, { name: newGroup, restaurants: [] }]);
      setNewGroup("");
    }
  };

  // Elimina gruppo
  const deleteGroup = (groupName) => {
    setGroups(groups.filter((g) => g.name !== groupName));
  };

  // Aggiungi locale a gruppo
  const addRestaurantToGroup = (groupName, place) => {
    setGroups(groups.map((g) =>
      g.name === groupName
        ? {
            ...g,
            restaurants: g.restaurants.find((r) => r.place_id === place.place_id)
              ? g.restaurants
              : [...g.restaurants, place]
          }
        : g
    ));
  };

  // Espandi dettagli
  const toggleExpand = (groupName, placeId) => {
    setExpanded((prev) => ({
      ...prev,
      [groupName + "-" + placeId]: !prev[groupName + "-" + placeId],
    }));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: 8 }}>
        <input
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Nuovo gruppo"
        />
        <button onClick={addGroup}>Aggiungi</button>
      </div>
      {groups.map((group) => (
        <div key={group.name} style={{ marginBottom: 24, textAlign: "left" }}>
          <b style={{ fontSize: 20 }}>{group.name}</b>
          <button onClick={() => deleteGroup(group.name)} style={{ marginLeft: 8 }}>
            Elimina
          </button>
          <RestaurantSearch
            onSelectRestaurant={(place) => addRestaurantToGroup(group.name, place)}
          />
          <div style={{ marginTop: 8 }}>
            <b>Ristoranti</b>
            {group.restaurants.length === 0 ? (
              <div style={{ color: "#777" }}>Nessun ristorante aggiunto.</div>
            ) : (
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {group.restaurants.map((r) => (
                  <li key={r.place_id} style={{ marginBottom: 8 }}>
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#0074D9",
                        textDecoration: "underline",
                        fontWeight: 500,
                      }}
                      onClick={() => toggleExpand(group.name, r.place_id)}
                    >
                      {r.name}
                    </span>
                    {expanded[group.name + "-" + r.place_id] && (
                      <div style={{
                        border: "1px solid #eee",
                        padding: 10,
                        borderRadius: 6,
                        background: "#fafaff",
                        marginTop: 6,
                      }}>
                        <div><b>Indirizzo:</b> {r.formatted_address || r.vicinity || "N/D"}</div>
                        {r.website && (
                          <div>
                            <b>Sito:</b> <a href={r.website} target="_blank" rel="noopener noreferrer">{r.website}</a>
                          </div>
                        )}
                        {r.types && (
                          <div><b>Tipi:</b> {r.types.join(", ")}</div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupsList;
