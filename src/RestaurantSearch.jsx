import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// Inserisci la tua chiave API qui
const GOOGLE_API_KEY = "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE";

const libraries = ["places"];

export default function RestaurantSearch({ user, groupId }) {
  const [input, setInput] = useState("");
  const [place, setPlace] = useState(null);
  const searchBoxRef = useRef(null);

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const p = places[0];
      setPlace({
        name: p.name,
        address: p.formatted_address,
        website: p.website || "",
      });
      setInput(p.name);
    }
  };

  const handleAddRestaurant = async () => {
    if (!place) return;
    await addDoc(collection(db, "restaurants"), {
      groupId,
      userId: user.uid,
      name: place.name,
      address: place.address,
      website: place.website,
    });
    setInput("");
    setPlace(null);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries}>
        <StandaloneSearchBox
          onLoad={ref => (searchBoxRef.current = ref)}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            type="text"
            placeholder="Cerca ristorante su Google"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              width: "90%",
              padding: 8,
              fontSize: 16,
              marginBottom: 8,
            }}
          />
        </StandaloneSearchBox>
      </LoadScript>
      {place && (
        <div style={{ margin: "8px 0", padding: 8, border: "1px solid #eee" }}>
          <div><b>Nome:</b> {place.name}</div>
          <div><b>Indirizzo:</b> {place.address}</div>
          <div><b>Sito web:</b> {place.website || "Non disponibile"}</div>
          <button onClick={handleAddRestaurant} style={{ marginTop: 8 }}>
            Aggiungi al gruppo
          </button>
        </div>
      )}
    </div>
  );
}