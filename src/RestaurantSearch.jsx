import React, { useRef } from "react";
import { GoogleMap, LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const libraries = ["places"];

export default function RestaurantSearch({ groupId, user }) {
  const searchBoxRef = useRef(null);
  const inputRef = useRef(null);

  const handlePlacesChanged = async () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;
    const place = places[0];
    await addDoc(collection(db, "restaurants"), {
      groupId,
      userId: user.uid,
      name: place.name,
      address: place.formatted_address || "",
      website: place.website || "",
      placeId: place.place_id || "",
      createdAt: new Date(),
    });
    inputRef.current.value = "";
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      <LoadScript googleMapsApiKey="AIzaSyDia3UCyD4p4i8Dc-zS-2Eg9OWbrWeL4KE" libraries={libraries}>
        <StandaloneSearchBox
          onLoad={ref => (searchBoxRef.current = ref)}
          onPlacesChanged={handlePlacesChanged}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Cerca un ristorante su Google..."
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </StandaloneSearchBox>
      </LoadScript>
    </div>
  );
}
