import React from "react";

import { Redirect } from "react-router-dom";

const ProtectedRoute = ({ auth, children }) => {
  const getAuthorization = localStorage.getItem("authorization_token");
  const expireAuthorization = localStorage.getItem("expire_time");

  if (new Date().getTime() > expireAuthorization) {
    localStorage.removeItem("user_id");
    localStorage.removeItem("authorization_token");
    localStorage.removeItem("expire_time");
    localStorage.clear();
  }

  if (Object.keys(auth).length == 0 && !getAuthorization) {
    return <Redirect to="/login" />;
  } else {
    return children;
  }
};

export default ProtectedRoute;
