import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function RestaurantSearch({ user, groupId }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps JS API non caricata");
      return;
    }
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["establishment"], fields: ["name", "formatted_address", "website", "geometry"] }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const placeResult = autocompleteRef.current.getPlace();
      setPlace(placeResult);
    });
  }, []);

  const saveRestaurant = async () => {
    if (!place) return;

    try {
      await addDoc(collection(db, "groups", groupId, "restaurants"), {
        name: place.name || "",
        address: place.formatted_address || "",
        website: place.website || "",
        location: place.geometry?.location
          ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          : null,
        createdAt: new Date(),
        userId: user.uid,
      });
      alert("Ristorante salvato!");
      setPlace(null);
      inputRef.current.value = "";
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      alert("Errore nel salvataggio");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Cerca un ristorante"
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />
      <button onClick={saveRestaurant} disabled={!place} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
        Aggiungi ristorante
      </button>

      {place && (
        <div style={{ marginTop: "1rem", textAlign: "left" }}>
          <strong>{place.name}</strong>
          <p>{place.formatted_address}</p>
          {place.website && (
            <p>
              <a href={place.website} target="_blank" rel="noreferrer">
                Sito web
              </a>
            </p>
          )}
        </div>
      )}
    </div>
);
}
