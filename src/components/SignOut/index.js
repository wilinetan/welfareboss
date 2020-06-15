import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import Button from "react-bootstrap/Button";

class SignOutButton extends Component {
  handleClick = (firebase, history) => {
    firebase
      .doSignOut()
      .then(() => history.push(ROUTES.LANDING))
      .catch((err) => console.log(err));
  };

  render() {
    const { history, firebase } = this.props;
    return (
      <Button
        variant="outline-light"
        onClick={() => this.handleClick(firebase, history)}
      >
        Sign Out
      </Button>
      // <button type="button" onClick={() => this.handleClick(firebase, history)}>
      //   Sign Out
      // </button>
    );
  }
}

export default compose(withRouter, withFirebase)(SignOutButton);
