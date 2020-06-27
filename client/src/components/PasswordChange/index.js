import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Label>Password Reset Form</Form.Label>
        <Form.Row>
          <Form.Group controlId="passwordOne" style={{ marginRight: "3px" }}>
            <Form.Control
              required
              name="passwordOne"
              value={passwordOne}
              type="password"
              placeholder="New Password"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group
            controlId="passwordTwo"
            style={{ marginRight: "3px", marginLeft: "3px" }}
          >
            <Form.Control
              required
              name="passwordTwo"
              value={passwordTwo}
              type="password"
              placeholder="Confirm New Password"
              onChange={this.onChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            disabled={isInvalid}
            style={{ height: "39px", marginLeft: "3px" }}
          >
            Reset My Password
          </Button>
        </Form.Row>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

export default withFirebase(PasswordChangeForm);
