import React, { useState, useEffect } from 'react';
import RestaurantSearch from './RestaurantSearch';

const LOCAL_STORAGE_KEY = 'groups_data_v2';

const GroupsList = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newGroup, setNewGroup] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_${user.uid}`);
    if (stored) setGroups(JSON.parse(stored));
  }, [user.uid]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_${user.uid}`, JSON.stringify(groups));
  }, [groups, user.uid]);

  const addGroup = () => {
    if (newGroup.trim()) {
      setGroups([...groups, { id: Date.now(), name: newGroup.trim(), restaurants: [] }]);
      setNewGroup('');
    }
  };

  const removeGroup = id => {
    setGroups(groups.filter(g => g.id !== id));
    if (selectedGroupId === id) setSelectedGroupId(null);
  };

  // AGGIUNGI RISTORANTE (senza doppioni)
  const addRestaurant = (groupId, restaurant) => {
    setGroups(groups.map(g => {
      if (g.id !== groupId) return g;
      if (g.restaurants.find(r => r.place_id === restaurant.place_id)) {
        alert("Questo locale è già stato aggiunto al gruppo.");
        return g;
      }
      return { ...g, restaurants: [...g.restaurants, restaurant] };
    }));
  };

  // RIMUOVI ristorante dal gruppo
  const removeRestaurant = (groupId, placeId) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, restaurants: g.restaurants.filter(r => r.place_id !== placeId) }
        : g
    ));
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
          value={newGroup}
          onChange={e => setNewGroup(e.target.value)}
          placeholder="Nuovo gruppo"
        />
        <button onClick={addGroup}>Aggiungi</button>
      </div>

      {selectedGroup && (
        <div style={{ textAlign: 'left', marginTop: 24 }}>
          <h3>{selectedGroup.name}</h3>
          <RestaurantSearch onSelect={r => addRestaurant(selectedGroup.id, r)} />
          <ul>
            {selectedGroup.restaurants.length === 0 && (
              <li>Nessun ristorante aggiunto.</li>
            )}
            {selectedGroup.restaurants.map(r => (
              <RestaurantItem
                key={r.place_id}
                restaurant={r}
                onDelete={() => removeRestaurant(selectedGroup.id, r.place_id)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

function RestaurantItem({ restaurant, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <li style={{ marginBottom: 8 }}>
      <span
        style={{ cursor: "pointer", color: "#1565c0", textDecoration: "underline" }}
        onClick={() => setOpen(o => !o)}
      >
        {restaurant.name}
      </span>
      <button style={{ marginLeft: 8, color: 'red' }} onClick={onDelete}>X</button>
      {open && (
        <div style={{ marginTop: 6, marginLeft: 14 }}>
          <div>
            <strong>Indirizzo:</strong>{" "}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
              target="_blank" rel="noopener noreferrer"
            >{restaurant.address}</a>
          </div>
          {restaurant.website && (
            <div>
              <strong>Sito web:</strong>{" "}
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer">{restaurant.website}</a>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default GroupsList;
