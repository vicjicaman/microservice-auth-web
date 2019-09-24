import React, { useState } from "react";
import Root from "Root";
import { NavLink } from "react-router-dom";
import { NavItem } from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Alert } from "reactstrap";
import Loading from "UI/loading";
import * as Viewer from "Queries/viewer";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    auth {
      login(username: $username, password: $password) {
        username
      }
    }
  }
`;

export default function({ history }) {
  let username;
  let password;

  const [error, setError] = useState(false);

  const [
    login,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(LOGIN, {
    refetchQueries: [{ query: Viewer.GET }],
    onCompleted: ({ auth: { login } }) => {
      if (login !== null) {
        window.location = "/";
        setError(false);
      } else {
        setError(true);
      }
    }
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          login({
            variables: { username: username.value, password: password.value }
          });
        }}
      >
        <div className="form-group row">
          <label
            htmlFor="username"
            className="col-md-4 col-form-label text-md-right"
          >
            Username
          </label>
          <div className="col-md-6">
            <input
              type="text"
              id="username"
              className="form-control"
              name="username"
              required
              autoFocus
              ref={node => {
                username = node;
              }}
            />
          </div>
        </div>

        <div className="form-group row">
          <label
            htmlFor="password"
            className="col-md-4 col-form-label text-md-right"
          >
            Password
          </label>
          <div className="col-md-6">
            <input
              type="password"
              id="password"
              className="form-control"
              name="password"
              required
              ref={node => {
                password = node;
              }}
            />
          </div>
        </div>

        <div className="col-md-6 offset-md-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutationLoading}
          >
            {mutationLoading ? <Loading /> : "Login"}
          </button>
        </div>
      </form>
      <div className="mt-4">
        {error && (
          <Alert color="warning">
            Login error! check the name and password.
          </Alert>
        )}
      </div>
    </div>
  );
}
