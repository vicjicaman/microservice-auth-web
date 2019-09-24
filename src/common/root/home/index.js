import React from "react";
import { Route, NavLink, Switch, Link } from "react-router-dom";
import { Query } from "react-apollo";
import Login from "Actions/auth/login";
import Unregister from "Actions/auth/unregister";
import Logout from "Actions/auth/logout";
import * as Account from "Queries/account";

export default ({ history, viewer: { username } }) => (
  <div>
    <div className="row">
      {username ? (
        <Query query={Account.GET}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error}</p>;

            const {
              viewer: {
                account: {
                  get: { id, username, email, created_at }
                }
              }
            } = data;

            const date = new Date(created_at);
            const formated = new Intl.DateTimeFormat("en-US").format(date);

            return (
              <React.Fragment>
                <div className="col-md-6 mt-4">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-user" /> Account
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <span className="d-block">
                            Username: <b>{username}</b>
                          </span>
                        </li>
                        <li className="list-group-item">
                          <span className="d-block">
                            E-mail: <b>{email}</b>
                          </span>
                        </li>
                        <li className="list-group-item">
                          <span className="d-block">
                            User since: <b>{formated}</b>
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="card-footer">
                      <Logout />{" "}
                      <div className="float-right">
                        <Unregister />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mt-4">
                  <div className="card">
                    <div className="card-header">
                      <i className="fa fa-book" /> Latest activity...
                    </div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">TODO...</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          }}
        </Query>
      ) : (
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <Login />
            </div>
            <div className="card-footer">
              <Link to="/auth/register">register</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
