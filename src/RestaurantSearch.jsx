import React, { useRef, useEffect, useState } from "react";
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

// Tutte le tipologie di esercizi food-related
const foodTypes = [
  "restaurant",     // Ristoranti
  "bar",            // Bar
  "cafe",           // Caffè/pasticcerie
  "bakery",         // Panifici/pasticcerie
  "meal_takeaway",  // Takeaway (es. kebab, fast food, pizzeria al taglio)
  "meal_delivery",  // Consegna cibo a domicilio
];

export default function RestaurantSearch({ onPlaceSelected }) {
  const autoRef = useRef();
  const userLocation = useCurrentLocation();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (!isLoaded) return <div>Caricamento mappa...</div>;

  return (
    <Autocomplete
      onLoad={ref => (autoRef.current = ref)}
      onPlaceChanged={() => {
        const place = autoRef.current.getPlace();
        if (place && onPlaceSelected) onPlaceSelected(place);
      }}
      options={{
        types: foodTypes,
        ...(userLocation && {
          location: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
          radius: 5000,
        }),
        componentRestrictions: { country: "it" },
      }}
    >
      <input
        type="text"
        placeholder="Cerca ristorante, pizzeria, bar, pasticceria..."
        style={{
          width: "100%",
          padding: 8,
          fontSize: 16,
          marginBottom: 10,
        }}
      />
    </Autocomplete>
  );
}
