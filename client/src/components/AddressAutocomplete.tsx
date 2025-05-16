// ---------------------------------
// ---- Google Maps API version ----
// ---------------------------------

// import { useEffect, useRef } from "react";
// import { IAddress } from "../types/auth";

// declare global {
//     interface Window {
//         google: any;
//     }
// }

// interface AddressAutocompleteProps {
//     name: string;
//     value?: string;
//     onChange: (value: IAddress[]) => void;
//     id?: string
// }

// const AddressAutocomplete = ({ name, value, onChange, id }: AddressAutocompleteProps) => {
//     const inputRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         const getAddressComponent = (components: any[], type: string): string | null => {
//             const comp = components.find((c) => c.types.includes(type));
//             return comp?.long_name || null;
//         };

//         const initAutocomplete = () => {
//             if (!window.google || !inputRef.current) return;

//             const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
//                 types: ["geocode"],
//                 componentRestrictions: { country: "us" },
//             });

//             autocomplete.addListener("place_changed", () => {
//                 const place = autocomplete.getPlace();
//                 const address = place.formatted_address || place.name;
//                 const location = place.geometry?.location;
//                 const components = place.address_components;

//                 if (address && location && components) {
//                     const payload: IAddress = {
//                         address1: null, // optional: parse if needed
//                         address2: null,
//                         city:
//                             getAddressComponent(components, "locality") ||
//                             getAddressComponent(components, "sublocality") ||
//                             "",
//                         state: getAddressComponent(components, "administrative_area_level_1") || "",
//                         zip: getAddressComponent(components, "postal_code"),
//                         country: getAddressComponent(components, "country") || "",
//                         longitude: location.lng().toString(),
//                         latitude: location.lat().toString(),
//                         fulladdress: address,
//                         suiteno: "",
//                     };

//                     onChange([payload]);
//                     console.log("Address Payload:", [payload]);
//                 }
//             });
//         };

//         if (window.google && window.google.maps) {
//             initAutocomplete();
//         }
//     }, [onChange]);

//     return (
//         <input
//             ref={inputRef}
//             name={name}
//             defaultValue={value}
//             id={id}
//             placeholder="Enter address"
//         />
//     );
// };

// export default AddressAutocomplete;



// ---------------------------------
// ---- Nominatim API version ----
// ---------------------------------

import { useState, useEffect, useRef } from "react";
import { IAddress } from "../types/auth";

interface AddressAutocompleteProps {
  name: string;
  value?: string;
  onChange: (value: IAddress[]) => void;
  id?: string;
}

interface NominatimPlace {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
    suburb?: string;
  };
}

const AddressAutocomplete = ({ name, value, onChange, id }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<NominatimPlace[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Query Nominatim on input change with debounce
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (query.length < 3) {
      setResults([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
        query
      )}`;

      try {
        const res = await fetch(url, {
          headers: { "Accept-Language": "en" },
        });
        const data: NominatimPlace[] = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Nominatim search error:", error);
        setResults([]);
      }
    }, 300); // debounce 300ms
  }, [query]);

  // When user selects a place
  const handleSelect = (place: NominatimPlace) => {
    setQuery(place.display_name);
    setResults([]);

    // Map Nominatim place to your IAddress type
    const payload: IAddress = {
      address1: place.address.suburb || null,
      address2: null,
      city: place.address.city || place.address.town || place.address.village || "",
      state: place.address.state || "",
      zip: place.address.postcode || "",
      country: place.address.country || "",
      longitude: place.lon,
      latitude: place.lat,
      fullAddress: place.display_name,
      suiteNo: "",
    };

    onChange([payload]);
    console.log("Address Payload:", [payload]);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        name={name}
        type="text"
        placeholder="Enter address"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        style={{ width: "100%" }}
      />

      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: 200,
            overflowY: "auto",
            background: "white",
            border: "1px solid #ccc",
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 1000,
          }}
        >
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(place)}
              style={{ padding: 8, cursor: "pointer", borderBottom: "1px solid #eee" }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
