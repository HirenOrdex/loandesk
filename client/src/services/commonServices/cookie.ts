import Cookies from "js-cookie";
import LZString from "lz-string";
import { handleUserLogout } from "./utilities";
import { AppDispatch } from "../../redux/store";

export const setCookie = (
    name: string,
    value: string,
    expDay: number
  ): void => {

    const compressedValue = LZString?.compressToBase64(value);
      let expires = "";
      const date = new Date();
      date?.setTime(date?.getTime() + expDay * 24 * 60 * 60 * 1000);
      expires = `expires=${date?.toUTCString()}`;
      document.cookie = `${name}=${compressedValue};${expires};path=/`;
  };
  
export const getCookie = (
    name: string,
    dispatch?: AppDispatch,
    showToast: boolean = false
  ): string | null => {
    const handleLogoutData = handleUserLogout(dispatch,showToast);
  
    // Function to validate the cookie value
    const validateCookieValue = (value: string | null): boolean => {
      if (
        !value ||
        value === "undefined" ||
        value?.trim()?.length === 0 ||
        value === "null"
      )
        return false;
  
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        console.log("error",e);
        return false;
      }
    };

  
    const cookieData = Cookies?.get(name);
  
    if (cookieData) {
      try {
        const decompressedValue = LZString?.decompressFromBase64(
          cookieData?.trim()
        );
        if (validateCookieValue(decompressedValue)) {
          return JSON?.parse(decompressedValue);
        } else {
          console.log("Invalid cookie value after decompression");
          handleLogoutData();
          return null;
        }
      } catch (e) {
        // Decompression failed, handle error
        console.log("Decompression error:", e);
        handleLogoutData();
        return null;
      }
    } else {
      handleLogoutData();
      return null;
    }
    // return null;
};

export const removeCookie = (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};