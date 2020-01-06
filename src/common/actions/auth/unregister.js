import React, { useState } from "react";
import Root from "Root";
import { withRouter } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import * as Viewer from "Queries/viewer";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import * as Mutation from "UI/utils/mutation";

const Confirm = ({ button: TriggerButton, onConfirm }) => {
  const [isOpen, setModalState] = useState(false);
  const close = e => setModalState(false);
  const open = e => setModalState(true);

  return (
    <div>
      <TriggerButton open={open} />
      <Modal isOpen={isOpen} toggle={close}>
        <ModalHeader toggle={close}>
          <i className="fa fa-times-circle" /> Unregister account
        </ModalHeader>
        <ModalBody>
          Your are about to delete your account, this can't be undone.
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={e => {
              onConfirm();
              close(e);
            }}
          >
            Unregister
          </Button>{" "}
          <Button color="secondary" onClick={close}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

const UNREGISTER = gql`
  mutation Unregister {
    viewer {
      account {
        unregister
      }
    }
  }
`;

const triggerUnregister = ({ open }) => (
  <button
    className="btn btn-link text-danger"
    onClick={e => {
      e.preventDefault();
      open(e);
    }}
  >
    Unregister
  </button>
);

export default withRouter(function({ history }) {
  let input;
  const [delaccount] = useMutation(UNREGISTER, {
    refetchQueries: [{ query: Viewer.GET }],
    onCompleted: () => {
      history.push("/auth");
    },
    onError: Mutation.onError
  });

  return (
    <div>
      <Confirm button={triggerUnregister} onConfirm={delaccount} />
    </div>
  );
});
