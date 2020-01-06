import React from "react";
import { Route, NavLink, Switch, Link } from "react-router-dom";
import { Query } from "react-apollo";
import Login from "Actions/auth/login";
import Unregister from "Actions/auth/unregister";
import Logout from "Actions/auth/logout";
import Validate from "Actions/auth/validate";
import * as Account from "Queries/account";

export default ({ history, viewer: { username } }) => (
  <div>
    <div className="row justify-content-md-center">
      {username ? (
        <Query query={Account.GET}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error}</p>;

            const {
              viewer: {
                account: {
                  get: { id, username, email, created_at, status }
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

                {status === "validating" && (
                  <div className="col-md-6 mt-4">
                    <div className="card">
                      <div className="card-header">
                        <i className="fa fa-book" /> Validate token...
                      </div>
                      <div className="card-body">
                        <Validate />
                      </div>
                    </div>
                  </div>
                )}
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
