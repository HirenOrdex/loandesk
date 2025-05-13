
import { useEffect, useRef } from "react";
import { IAddress } from "../types/auth";

declare global {
    interface Window {
        google: any;
    }
}

interface AddressAutocompleteProps {
    name: string;
    value?: string;
    onChange: (value: IAddress[]) => void;
}

const AddressAutocomplete = ({ name, value, onChange }: AddressAutocompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const getAddressComponent = (components: any[], type: string): string | null => {
            const comp = components.find((c) => c.types.includes(type));
            return comp?.long_name || null;
        };

        const initAutocomplete = () => {
            if (!window.google || !inputRef.current) return;

            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ["geocode"],
                componentRestrictions: { country: "us" },
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                const address = place.formatted_address || place.name;
                const location = place.geometry?.location;
                const components = place.address_components;

                if (address && location && components) {
                    const payload: IAddress = {
                        address1: null, // optional: parse if needed
                        address2: null,
                        city:
                            getAddressComponent(components, "locality") ||
                            getAddressComponent(components, "sublocality") ||
                            "",
                        state: getAddressComponent(components, "administrative_area_level_1") || "",
                        zip: getAddressComponent(components, "postal_code"),
                        country: getAddressComponent(components, "country") || "",
                        longitude: location.lng().toString(),
                        latitude: location.lat().toString(),
                        fulladdress: address,
                        suiteno: "",
                    };

                    onChange([payload]);
                    console.log("Address Payload:", [payload]);
                }
            });
        };

        if (window.google && window.google.maps) {
            initAutocomplete();
        }
    }, [onChange]);

    return (
        <input
            ref={inputRef}
            name={name}
            defaultValue={value}
            placeholder="Enter address"
        />
    );
};

export default AddressAutocomplete;
