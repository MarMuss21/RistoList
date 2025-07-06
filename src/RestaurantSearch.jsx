import React, { useRef, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

const typesFood = [
  "restaurant", "bar", "cafe", "bakery", "meal_takeaway", "food", "meal_delivery",
];

function RestaurantSearch({ user, groupId }) {
  const inputRef = useRef();

  useEffect(() => {
    let autocomplete;
    // FUNZIONE DI AVVIO AUTOCOMPLETE SOLO SE LIBRERIA PRONTA
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn("Google Maps Places API NON caricata!");
        return;
      }
      autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["establishment"],
        fields: [
          "place_id", "name", "types", "formatted_address", "vicinity", "geometry", "website"
        ]
      });
      autocomplete.addListener("place_changed", async () => {
        const place = autocomplete.getPlace();
        if (
          place &&
          place.types &&
          place.types.some((t) => typesFood.includes(t)) &&
          groupId &&
          user
        ) {
          await addDoc(collection(db, "restaurants"), {
            groupId,
            userId: user.uid,
            place_id: place.place_id,
            name: place.name,
            address: place.formatted_address || place.vicinity || "",
            website: place.website || "",
            types: place.types,
            createdAt: new Date()
          });
          inputRef.current.value = "";
        }
      });
    };

    // SE LA LIBRERIA NON ESISTE, LA CARICO
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      const script = document.createElement("script");
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE&libraries=places&language=it`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else {
      // GIA' CARICATA
      initAutocomplete();
    }
  }, [user, groupId]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Cerca locale (solo attività food)"
      style={{ width: "100%", fontSize: 22, margin: "16px 0", padding: 8 }}
    />
  );
}

export default RestaurantSearch;
