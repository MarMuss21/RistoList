import React, { useRef, useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const GOOGLE_API_KEY = "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE"; // <-- la tua API Key

export default function RestaurantSearch({ groupId, user }) {
  const autocompleteRef = useRef(null);
  const [fields, setFields] = useState({
    name: "",
    address: "",
    website: ""
  });
  const [placeSelected, setPlaceSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  function handlePlaceChanged() {
    const place = autocompleteRef.current.getPlace();
    if (!place) return;

    setFields({
      name: place.name || "",
      address: place.formatted_address || "",
      website: (place.website || (place.url ? place.url : ""))
    });
    setPlaceSelected(true);
  }

  function handleFieldChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setPlaceSelected(false);
  }

  async function handleAddRestaurant(e) {
    e.preventDefault();
    if (!fields.name || !fields.address) return;

    setLoading(true);
    await addDoc(collection(db, "restaurants"), {
      ...fields,
      groupId,
      userId: user.uid,
      createdAt: new Date()
    });
    setFields({ name: "", address: "", website: "" });
    setPlaceSelected(false);
    setLoading(false);
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={["places"]}>
      <form onSubmit={handleAddRestaurant} style={{ marginBottom: 24 }}>
        <label style={{ display: "block", marginBottom: 4 }}>
          Cerca o inserisci un ristorante:
        </label>
        <Autocomplete
          onLoad={ref => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleFieldChange}
            placeholder="Nome ristorante (scrivi per suggerimenti Google)"
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 8,
              fontWeight: placeSelected ? "bold" : "normal"
            }}
            autoComplete="off"
          />
        </Autocomplete>
        <input
          type="text"
          name="address"
          value={fields.address}
          onChange={handleFieldChange}
          placeholder="Indirizzo"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="text"
          name="website"
          value={fields.website}
          onChange={handleFieldChange}
          placeholder="Sito web (facoltativo)"
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button
          type="submit"
          disabled={!fields.name || !fields.address || loading}
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600
          }}
        >
          {loading ? "Aggiungo..." : "Aggiungi ristorante"}
        </button>
      </form>
    </LoadScript>
  );
}
