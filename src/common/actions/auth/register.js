import React, { useState } from "react";
import Root from "Root";
import { NavLink } from "react-router-dom";
import { NavItem } from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Alert } from "reactstrap";
import Loading from "UI/loading";
import * as Viewer from "Queries/viewer";

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    auth {
      register(username: $username, email: $email, password: $password) {
        id
        username
      }
    }
  }
`;

export default function({ history }) {
  let username;
  let email;
  let password;

  const [
    register,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(REGISTER, {
    refetchQueries: [{ query: Viewer.GET }],
    onCompleted: ({ auth: { register } }) => {
      if (register !== null) {
        window.location = "/";
      }
    }
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          register({
            variables: {
              username: username.value,
              email: email.value,
              password: password.value
            }
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
            htmlFor="email"
            className="col-md-4 col-form-label text-md-right"
          >
            E-mail
          </label>
          <div className="col-md-6">
            <input
              type="text"
              id="email"
              className="form-control"
              name="email"
              required
              ref={node => {
                email = node;
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
            {mutationLoading ? <Loading /> : "Register"}
          </button>
        </div>
      </form>
      <div className="mt-4">
        {mutationError && (
          <Alert color="warning">
            Register error! username already exists
          </Alert>
        )}
      </div>
    </div>
  );
}
