import React, { useState } from "react";
import Root from "Root";
import { NavLink } from "react-router-dom";
import { NavItem } from "reactstrap";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Alert, Input } from "reactstrap";
import Loading from "UI/loading";
import * as Viewer from "Queries/viewer";
import * as Mutation from "UI/utils/mutation";
import validator from "validator";
import * as ValidationUtils from "PKG/linker-validation";

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
  const initial = { username: "", password: "" };

  const [error, setError] = useState(false);

  const [form, setFields] = useState({
    fields: initial,
    validation: { fields: {}, valid: false },
    touched: {}
  });

  const reset = (fields = initial) => {
    setFields(form => ({
      ...form,
      fields,
      validation: { fields: {}, valid: false },
      touched: {}
    }));
  };

  const handleFieldChange = event => {
    event.persist();
    const fieldName = event.target.name;
    const fieldValue = event.target.value.trim();

    setFields(form => {
      const modFields = {
        ...form.fields,
        [fieldName]: fieldValue
      };

      const modTouch = {
        ...form.touched,
        [fieldName]: true
      };

      const validation = { valid: true, fields: {} };
      const { username, password } = modFields;

      validation.fields.username =
        !validator.isEmpty(username) && ValidationUtils.isEntityName(username);
      validation.fields.password =
        !validator.isEmpty(password) &&
        validator.isLength(password, { min: 4 });

      validation.valid =
        validation.fields.username && validation.fields.password;

      return {
        fields: modFields,
        validation,
        touched: modTouch
      };
    });
  };

  const [
    login,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(LOGIN, {
    refetchQueries: [{ query: Viewer.GET }],
    onError: Mutation.onError,
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
            variables: {
              username: form.fields.username,
              password: form.fields.password
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
            <Input
              type="text"
              id="username"
              invalid={
                form.validation.fields.username === false &&
                form.touched.username
              }
              className="form-control"
              name="username"
              required
              autoFocus
              value={form.fields.username}
              onChange={handleFieldChange}
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
            <Input
              type="password"
              id="password"
              invalid={
                form.validation.fields.password === false &&
                form.touched.password
              }
              className="form-control"
              name="password"
              required
              value={form.fields.password}
              onChange={handleFieldChange}
            />
          </div>
        </div>

        <div className="col-md-6 offset-md-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutationLoading || !form.validation.valid}
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
