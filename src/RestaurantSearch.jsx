import React, { useRef, useEffect } from "react";

const GOOGLE_API_KEY = "AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE";
const allowedTypes = ["restaurant", "bar", "bakery", "cafe", "meal_takeaway", "meal_delivery", "food", "pizzeria", "pub"];

const autocompleteOptions = {
  types: ["establishment"],
  componentRestrictions: { country: "it" }
};

const RestaurantSearch = ({ onSelect }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places&language=it`;
      script.async = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }
    // eslint-disable-next-line
  }, []);

  function init() {
    if (!window.google?.maps?.places || !inputRef.current) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, autocompleteOptions);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (
        place.types?.some(t => allowedTypes.includes(t)) &&
        place.name &&
        place.formatted_address
      ) {
        onSelect({
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          website: place.website || ""
        });
        inputRef.current.value = "";
      } else {
        alert("Seleziona solo un locale food valido (ristoranti, bar, pizzerie ecc)!");
      }
    });
  }

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Cerca locale (solo attività food)"
      style={{ width: "100%", padding: "0.5rem", margin: "1rem 0", fontSize: "1.1rem" }}
    />
  );
};

export default RestaurantSearch;
