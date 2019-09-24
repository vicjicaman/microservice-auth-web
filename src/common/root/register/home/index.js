import React from "react";
import { Route, NavLink, Switch, Link } from "react-router-dom";
import Register from 'Actions/auth/register'

export default () => (
  <div>
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">Register</div>
          <div className="card-body">
            <Register />
          </div>
          <div className="card-footer">
            <Link to="/auth">login</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);
