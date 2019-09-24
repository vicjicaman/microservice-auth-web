import React from "react";
import { Route, NavLink, Switch } from "react-router-dom";
import Home from "./home";
import Register from "./register";

export default ({ viewer }) => (
  <div>
    <Switch>
      <Route
        path={"/auth"}
        exact={true}
        component={props => <Home {...props} viewer={viewer} />}
      />
      <Route
        path={"/auth/register"}
        exact={true}
        component={props => <Register {...props} viewer={viewer} />}
      />
    </Switch>
  </div>
);
