import React from "react";
import Root from "Root";
import { withRouter } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import * as Viewer from "Queries/viewer";

const LOGOUT = gql`
  mutation Logout {
    auth {
      logout
    }
  }
`;

export default withRouter(function({ history }) {
  let input;
  const [logout] = useMutation(LOGOUT, {
    refetchQueries: [{ query: Viewer.GET }],
    onCompleted: () => {
      history.push("/auth");
    }
  });

  return (
    <button
      className="btn btn-link"
      onClick={e => {
        e.preventDefault();
        logout();
      }}
    >
      Logout
    </button>
  );
});
