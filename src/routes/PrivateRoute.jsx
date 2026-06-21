import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, roles, userRole, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //==> For array userRole (Multiple permission)
  const isAnyElementInArray = roles.some((item) => userRole.includes(item));
  if (!isAnyElementInArray) {
    return <Navigate to="/not-found" />;
  }

  //==> For array userRole (Only one permission)
  // const isAllElementsInArray = roles.every((item) => userRole.includes(item));
  // if (!isAllElementsInArray) {
  //   return <Navigate to="/not-found" />;
  // }

  //==> For string userRole
  // if (!roles.includes(userRole)) {
  //   return <Navigate to="/not-found" />;
  // }

  return children;
};

export default PrivateRoute;
