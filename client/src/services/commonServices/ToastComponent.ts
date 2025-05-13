import { toast } from "react-toastify";

type ToastType = 'success' | 'error' | 'info' | 'warning';

const ToastComponent = (message : string,type : ToastType)=> {
    if(type === "success"){
        toast.success(message)
    }
    else if(type === "warning"){
        toast.warning(message)
    }
    else if(type === "info"){
        toast.info(message)
    }
    else if (type === "error"){
        toast.error(message)
    }
    else{
        toast.error("type is not defined")
    }
}

export default ToastComponent