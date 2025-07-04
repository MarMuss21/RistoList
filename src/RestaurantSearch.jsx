import React, { useEffect, useRef, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function RestaurantSearch({ user, groupId }) {
  const inputRef = useRef(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!window.google) return;
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment"],
      fields: ["name", "formatted_address", "website", "geometry"]
    });
    ac.addListener("place_changed", () => {
      setPlace(ac.getPlace());
    });
  }, []);

  const save = async () => {
    if (!place) return;
    await addDoc(collection(db, "groups", groupId, "restaurants"), {
      userId: user.uid,
      name: place.name,
      address: place.formatted_address,
      website: place.website || "",
      location: place.geometry?.location
        ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
        : null,
      createdAt: new Date()
    });
    setPlace(null);
    inputRef.current.value = "";
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <input
        ref={inputRef}
        placeholder="Cerca ristorante Google..."
        style={{ padding: ".5rem", width: "70%" }}
      />
      <button onClick={save} disabled={!place} style={{ marginLeft: 8 }}>
        Aggiungi
      </button>
      {place && (
        <div style={{ fontSize: ".9rem", marginTop: ".5rem", textAlign: "left" }}>
          <b>{place.name}</b><br/>
          {place.formatted_address}<br/>
          {place.website && <a href={place.website} target="_blank" rel="noreferrer">Sito</a>}
        </div>
      )}
    </div>
  );
}