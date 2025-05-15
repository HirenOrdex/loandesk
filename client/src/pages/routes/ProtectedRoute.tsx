import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getCookie, removeCookie } from "../../services/commonServices/cookie";
import { handleUserLogout } from "../../services/commonServices/utilities";
import { useTypedSelector } from "../../redux/store";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedOutUser = useTypedSelector((state) => state?.auth?.isLoggedOutUser);
  const userData = getCookie("keymonoUserData", dispatch)
  const isInitialRender = useRef(true);
  console.log("isLoggedOutUser", isLoggedOutUser)
  console.log("userData", userData)

  useEffect(() => {
    if (!userData && isLoggedOutUser && !isInitialRender.current) {
      const handleLogoutData = handleUserLogout(dispatch, true);
      handleLogoutData();
      removeCookie("keymonoUserData");
      // Redirect after logout
      navigate("/sign-in", { replace: true });
    }
    // Set initial render to false after first useEffect call
    isInitialRender.current = false;
  }, [userData, isLoggedOutUser, dispatch, navigate]);


  if (userData) {
    return <Outlet />;
  } else {
    return <Navigate to="/sign-in" replace />;
  }
};

export default ProtectedRoute;
