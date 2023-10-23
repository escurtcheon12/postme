import React from "react";

import { Redirect } from "react-router-dom";

const ProtectedFrontboard = ({ auth, children }) => {
  const getAuthorization = localStorage.getItem("authorization_token");
  if (
    (Object.keys(auth).length > 0 && auth.isAuthenticated) ||
    getAuthorization
  ) {
    return <Redirect to="/" />;
  } else {
    return children;
  }
};

export default ProtectedFrontboard;
