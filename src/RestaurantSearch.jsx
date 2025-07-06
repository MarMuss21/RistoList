import React, { useRef, useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const GOOGLE_API_KEY = "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE";

export default function RestaurantSearch({ user, groupId }) {
  const inputRef = useRef(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    // Carica lo script Google Maps Places solo una volta
    if (!window.google) {
      const script = document.createElement("script");
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
    } else {
      initializeAutocomplete();
    }

    function initializeAutocomplete() {
      if (!inputRef.current) return;
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["establishment"] }
      );
      autocomplete.setFields(["place_id", "name", "formatted_address", "website"]);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setPlace(place);
      });
    }
  }, []);

  async function handleAdd() {
    if (!place || !place.name) return;
    await addDoc(collection(db, "restaurants"), {
      groupId,
      userId: user.uid,
      name: place.name,
      address: place.formatted_address || "",
      website: place.website || "",
      createdAt: new Date()
    });
    setPlace(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Cerca un ristorante (Google)"
        style={{ width: "60%", padding: 8, marginRight: 8 }}
      />
      <button
        onClick={handleAdd}
        disabled={!place || !place.name}
        style={{ padding: "8px 16px" }}
      >
        Aggiungi
      </button>
      {place && (
        <div style={{ marginTop: 8 }}>
          <b>Nome:</b> {place.name}<br />
          <b>Indirizzo:</b> {place.formatted_address || "-"}<br />
          {place.website && (
            <>
              <b>Sito web:</b> <a href={place.website} target="_blank" rel="noopener noreferrer">{place.website}</a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
