import React, { useRef, useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE";
const libraries = ["places"];

function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }),
      () => setLocation(null)
    );
  }, []);
  return location;
}

const FOOD_TYPES = [
  "restaurant", "bar", "cafe", "bakery", "meal_takeaway", "meal_delivery"
];

export default function RestaurantSearch({ user, groupId, onAdd }) {
  const autoRef = useRef();
  const userLocation = useCurrentLocation();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);

  if (!isLoaded) return <div>Caricamento ricerca Google...</div>;

  const handlePlaceChanged = async () => {
    const place = autoRef.current.getPlace();
    if (!place || !place.types) return;
    // Controllo: aggiungi solo se è un esercizio food
    const isFood = place.types.some(t => FOOD_TYPES.includes(t));
    if (!isFood) {
      setSelectedPlace(null);
      return;
    }
    setSelectedPlace(place);

    // Salva direttamente in Firestore
    await addDoc(collection(db, "restaurants"), {
      groupId,
      userId: user.uid,
      name: place.name,
      address: place.formatted_address || "",
      website: place.website || "",
      details: {
        place_id: place.place_id || "",
        types: place.types,
      },
      createdAt: new Date()
    });
    setInputValue(""); // svuota il campo ricerca
    if (onAdd) onAdd(); // per aggiornare lista se serve
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <Autocomplete
        onLoad={ref => (autoRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
        options={{
          // NB: types qui NON filtra la lista di suggerimenti Google (limite delle API)
          ...(userLocation && {
            location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
            radius: 5000,
          }),
          componentRestrictions: { country: "it" },
        }}
      >
        <input
          type="text"
          placeholder="Cerca locale (solo attività food)"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            fontSize: 16,
            marginBottom: 10,
          }}
        />
      </Autocomplete>
    </div>
  );
}
