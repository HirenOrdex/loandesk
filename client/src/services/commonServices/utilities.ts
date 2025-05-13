import { AppDispatch } from "../../redux/store";
import { removeCookie } from "./cookie";
import ToastComponent from "./ToastComponent";

export const handleUserLogout = (dispatch: AppDispatch, showToast: boolean = false) => {
  console.log("showtoast: ", showToast);
  const handleLogout = () => {
    removeCookie("elevateWebUserData");
    if (showToast) {
      ToastComponent("Something went wrong! Please login again.", 'error');
    }
    // setTimeout(() => {
    //   dispatch(AuthServices?.actions?.isLoggedUser(true));
    // }, 0);
  };
  return handleLogout;
};
