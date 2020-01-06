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
  const initial = { username: "", email: "", password: "" };

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
      const { username, password, email } = modFields;

      validation.fields.username =
        !validator.isEmpty(username) && ValidationUtils.isEntityName(username);
      validation.fields.email =
        !validator.isEmpty(email) && validator.isEmail(email);
      validation.fields.password =
        !validator.isEmpty(password) &&
        validator.isLength(password, { min: 4 });

      validation.valid =
        validation.fields.username &&
        validation.fields.email &&
        validation.fields.password;

      return {
        fields: modFields,
        validation,
        touched: modTouch
      };
    });
  };

  const [
    register,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(REGISTER, {
    refetchQueries: [{ query: Viewer.GET }],
    onCompleted: ({ auth: { register } }) => {
      if (register !== null) {
        window.location = "/";
      }
    },
    onError: Mutation.onError
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          register({
            variables: {
              username: form.fields.username,
              email: form.fields.email,
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
            htmlFor="email"
            className="col-md-4 col-form-label text-md-right"
          >
            E-mail
          </label>
          <div className="col-md-6">
            <Input
              type="text"
              id="email"
              invalid={
                form.validation.fields.email === false && form.touched.email
              }
              className="form-control"
              name="email"
              required
              value={form.fields.email}
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
            {mutationLoading ? <Loading /> : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
