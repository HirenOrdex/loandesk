import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const NavigateToTop: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default NavigateToTop;