import React, { Component } from "react";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withRouter } from "react-router-dom";

import * as ROUTES from "../../constants/routes";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
        this.props.history.push(ROUTES.ACCOUNT);
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
      <Form
        onSubmit={this.onSubmit}
        style={{
          overflow: "hidden",
        }}
      >
        <Form.Group as={Row} controlId="passwordOne">
          <Form.Label column sm={3}>
            New Password
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              required
              name="passwordOne"
              value={passwordOne}
              type="password"
              placeholder="New Password"
              onChange={this.onChange}
              style={{ width: "550px" }}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="passwordTwo">
          <Form.Label column sm={3}>
            Confirm New Password
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              required
              name="passwordTwo"
              value={passwordTwo}
              type="password"
              placeholder="Confirm New Password"
              onChange={this.onChange}
              style={{ width: "550px" }}
            />
          </Col>
        </Form.Group>

        <Button
          variant="dark"
          type="submit"
          disabled={isInvalid}
          style={{ marginBottom: "10px", float: "right" }}
        >
          Reset My Password
        </Button>

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

export default compose(withFirebase, withRouter)(PasswordChangeForm);
