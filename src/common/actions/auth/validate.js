import React, { useState } from "react";
import validator from "validator";

import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Loading from "UI/loading";
import * as Mutation from "UI/utils/mutation";

import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
  FormFeedback
} from "reactstrap";

const mutation = gql`
  mutation AuthValidate($token: String!) {
    viewer {
      account {
        validate(token: $token) {
          id
          username
          account {
            get {
              id
              username
              email
              status
              created_at
            }
          }
        }
      }
    }
  }
`;

export default () => {
  const initial = { token: "" };

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
      const { token } = modFields;

      validation.fields.token =
        !validator.isEmpty(token) && validator.isJWT(token);

      validation.valid = validation.fields.token;

      return {
        fields: modFields,
        validation,
        touched: modTouch
      };
    });
  };

  const [
    validate,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(mutation, {
    refetchQueries: [],
    onCompleted: () => {
      window.location = "/";
    },
    onError: Mutation.onError
  });

  return (
    <Form>
      <FormGroup>
        <Input
          invalid={form.validation.fields.token === false && form.touched.token}
          type="textarea"
          name="token"
          value={form.fields.token}
          onChange={handleFieldChange}
        />

        <FormFeedback>Please enter a valid token.</FormFeedback>
      </FormGroup>

      <Button
        type="submit"
        color="primary"
        disabled={mutationLoading || !form.validation.valid}
        onClick={e => {
          e.preventDefault();

          validate({
            variables: {
              token: form.fields.token
            }
          });
        }}
      >
        {mutationLoading ? <Loading /> : "Validate"}
      </Button>
    </Form>
  );
};
