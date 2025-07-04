import React, { useState } from "react";

function RestaurantSearch({ onSelectRestaurant }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE";

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    // Ricerca con Google Places API (test)
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${apiKey}`;
    // NOTA: Chiamata diretta da frontend NON funzionerà in produzione senza proxy/server
    // In locale potresti dover usare uno script Node.js come proxy.
    try {
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(url)}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setResults([]);
    }
    setLoading(false);
  }

  return (
    <div style={{ margin: "2rem 0" }}>
      <h2>Cerca ristorante</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome o indirizzo..."
          style={{ padding: ".5rem", width: "60%" }}
        />
        <button type="submit" style={{ padding: ".5rem 1rem", marginLeft: 8 }}>
          Cerca
        </button>
      </form>
      {loading && <p>Caricamento...</p>}
      {results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {results.map((r) => (
            <li
              key={r.place_id}
              style={{
                borderBottom: "1px solid #ddd",
                margin: "8px 0",
                padding: "4px",
                cursor: "pointer",
              }}
              onClick={() => onSelectRestaurant(r)}
            >
              <b>{r.name}</b>
              <br />
              <span>{r.formatted_address}</span>
              <br />
              {r.website && (
                <a href={r.website} target="_blank" rel="noreferrer">
                  {r.website}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RestaurantSearch;