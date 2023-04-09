import React from "react";
import { Redirect } from "react-router-dom";
import { getUserIsLoggedIn } from "../store/user";
import { useSelector } from "react-redux";

const withLogin = (Component) => (props) => {
  const userIsLoggedIn = useSelector(getUserIsLoggedIn());

  return (
    <>{userIsLoggedIn ? <Component {...props} /> : <Redirect to="/login" />}</>
  );
};

export default withLogin;
