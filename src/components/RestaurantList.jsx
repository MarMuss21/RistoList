import React from "react";

function RestaurantList({ restaurants }) {
  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Ristoranti</h2>
      {restaurants.length === 0 ? (
        <p>Nessun ristorante presente.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {restaurants.map((r, idx) => (
            <li key={r.place_id || idx} style={{ borderBottom: "1px solid #eee", marginBottom: 12 }}>
              <b>{r.name}</b>
              <br />
              <span>{r.formatted_address}</span>
              {r.website && (
                <div>
                  <a href={r.website} target="_blank" rel="noreferrer">
                    {r.website}
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RestaurantList;