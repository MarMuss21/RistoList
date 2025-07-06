import React, { useState } from "react";
import RestaurantSearch from "./RestaurantSearch";

function GroupsList({ user }) {
  const [groups, setGroups] = useState([
    // Esempio, poi carica/salva dove vuoi tu
    // { id: "1", nome: "Amici", ristoranti: [] }
  ]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [expandedRisto, setExpandedRisto] = useState({}); // Per dettaglio

  // Gestisci selezione gruppo
  const selectGroup = (groupId) => setSelectedGroupId(groupId);

  // Aggiungi gruppo
  const [newGroupName, setNewGroupName] = useState("");
  const addGroup = () => {
    if (newGroupName.trim() !== "") {
      setGroups([
        ...groups,
        {
          id: Date.now().toString(),
          nome: newGroupName,
          ristoranti: [],
        },
      ]);
      setNewGroupName("");
    }
  };

  // Elimina gruppo
  const removeGroup = (id) => setGroups(groups.filter((g) => g.id !== id));

  // Aggiungi ristorante al gruppo selezionato
  const addRistoToGroup = (place) => {
    if (!selectedGroupId) {
      alert("Seleziona prima un gruppo!");
      return;
    }
    setGroups((prev) =>
      prev.map((g) =>
        g.id === selectedGroupId
          ? {
              ...g,
              ristoranti: [
                ...g.ristoranti,
                {
                  id: place.place_id,
                  name: place.name,
                  indirizzo: place.formatted_address,
                  sito: place.website,
                },
              ],
            }
          : g
      )
    );
  };

  // Gestione espansione dettagli
  const toggleRisto = (groupId, ristoId) => {
    setExpandedRisto((prev) => ({
      ...prev,
      [groupId + "_" + ristoId]: !prev[groupId + "_" + ristoId],
    }));
  };

  return (
    <div>
      <div style={{ display: "flex", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Nuovo gruppo"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          style={{ flex: 1, fontSize: 18, padding: 8 }}
        />
        <button onClick={addGroup} style={{ marginLeft: 12 }}>
          Aggiungi
        </button>
      </div>

      <div style={{ textAlign: "left", margin: "auto", maxWidth: 800 }}>
        {groups.length === 0 ? (
          <b>Nessun gruppo</b>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              style={{
                marginBottom: 28,
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 18,
                background: selectedGroupId === group.id ? "#f8f8f8" : "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2
                  onClick={() => selectGroup(group.id)}
                  style={{
                    margin: 0,
                    fontWeight: selectedGroupId === group.id ? "bold" : "normal",
                    cursor: "pointer",
                  }}
                >
                  {group.nome}
                </h2>
                <button
                  style={{
                    marginLeft: "auto",
                    background: "#eee",
                    border: 0,
                    cursor: "pointer",
                  }}
                  onClick={() => removeGroup(group.id)}
                >
                  Elimina
                </button>
              </div>

              {/* SOLO per il gruppo selezionato */}
              {selectedGroupId === group.id && (
                <div style={{ marginTop: 20 }}>
                  <RestaurantSearch onSelect={addRistoToGroup} />

                  <div style={{ marginTop: 20 }}>
                    <h3>Ristoranti</h3>
                    {group.ristoranti.length === 0 ? (
                      <div>Nessun ristorante aggiunto.</div>
                    ) : (
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {group.ristoranti.map((risto) => (
                          <li key={risto.id} style={{ marginBottom: 14 }}>
                            <span
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: "#0077cc",
                                fontWeight: "bold",
                                fontSize: 18,
                              }}
                              onClick={() => toggleRisto(group.id, risto.id)}
                            >
                              {risto.name}
                            </span>
                            {expandedRisto[group.id + "_" + risto.id] && (
                              <div
                                style={{
                                  background: "#f1f1f1",
                                  marginTop: 5,
                                  padding: "10px 18px",
                                  borderRadius: 6,
                                }}
                              >
                                <div>
                                  <b>Indirizzo:</b> {risto.indirizzo}
                                </div>
                                {risto.sito && (
                                  <div>
                                    <b>Sito web:</b>{" "}
                                    <a href={risto.sito} target="_blank" rel="noreferrer">
                                      {risto.sito}
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GroupsList;
