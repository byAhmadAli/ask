import React from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "../_services/Auth";

export const ProtectedRoute = ({
  component: Component,
  profile,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (auth.isAuthenticated()) {
          return <Component {...props} profile={profile} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
