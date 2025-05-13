import { AppDispatch } from "../../redux/store";
import ToastComponent from "./ToastComponent";
import { handleUserLogout } from "./utilities";

export const errorHandlingInterceptors = (status: number, errorMessage: string,dispatch:AppDispatch) => {
  switch (status) {
    case 401:
      console.error(errorMessage);
      ToastComponent(errorMessage, 'error');
      break;
    case 404:
        console.error(errorMessage);
        ToastComponent(errorMessage, 'error');
        break;
    case 400:
        console.error(errorMessage);
        ToastComponent(errorMessage, 'error');
        break;
    case 500:
      console.error(errorMessage);
      ToastComponent(errorMessage, 'error');
      break;
    case 440:
        console.error(errorMessage)
        handleUserLogout(dispatch)();
        break;
    default:
      ToastComponent(errorMessage || 'Something went wrong', 'error');
      console.error(`Unexpected error: ${errorMessage}`);
  }
};

export const successHandlingInterceptors = (successMessage: string) => {
    ToastComponent(successMessage, 'success');
};