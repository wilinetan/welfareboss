import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const PasswordForgetPage = () => (
  <div style={{ paddingLeft: "80px", paddingRight: "80px", height: "100%" }}>
    <h1>Password Forget Form</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  nusnetId: "",
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { nusnetId } = this.state;
    const email = nusnetId.concat("@u.nus.edu");

    this.props.firebase
      .doPasswordReset(email)
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
    const { nusnetId, error } = this.state;

    const invalidId =
      nusnetId !== ""
        ? nusnetId.length !== 8 || nusnetId.charAt(0).toUpperCase() !== "E"
        : false;

    const validId =
      nusnetId.length === 8 && nusnetId.charAt(0).toUpperCase() === "E";

    return (
      <Form style={{ width: "900px" }} onSubmit={this.onSubmit}>
        <Form.Group as={Row} controlId="pwforgetemail">
          <Form.Label column sm={3}>
            NUS Email Address
          </Form.Label>
          <Col sm={9}>
            <InputGroup className="nusnetid">
              <Form.Control
                placeholder="NUSNET ID"
                name="nusnetId"
                value={nusnetId}
                aria-label="NUSNET ID"
                aria-describedby="basic-addon2"
                onChange={this.onChange}
                isInvalid={invalidId}
                isValid={validId}
                required
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">@u.nus.edu</InputGroup.Text>
              </InputGroup.Append>
              <Form.Control.Feedback type="invalid">
                Invalid ID.
              </Form.Control.Feedback>
              <Form.Control.Feedback type="valid">
                Valid ID.
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={invalidId}
          style={{ marginBottom: "10px", float: "right" }}
        >
          Send Password Reset Email
        </Button>

        {error && (
          <Alert variant="danger" style={{ marginTop: "10px" }}>
            {error.message}
          </Alert>
        )}
      </Form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
