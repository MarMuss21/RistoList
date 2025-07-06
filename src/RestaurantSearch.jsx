import React, { useRef, useEffect } from "react";

const typesFood = [
  "restaurant",
  "bar",
  "cafe",
  "bakery",
  "meal_takeaway",
  "food",
  "meal_delivery",
];

function RestaurantSearch({ onSelectRestaurant }) {
  const inputRef = useRef();

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment"],
      fields: [
        "place_id", "name", "types", "formatted_address", "vicinity", "geometry", "website"
      ]
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      // Solo food-related
      if (place && place.types && place.types.some((t) => typesFood.includes(t))) {
        onSelectRestaurant(place);
      }
    });
  }, [onSelectRestaurant]);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) return;
    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE&libraries=places&language=it`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
