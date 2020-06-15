import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import UploadExcel from "../UploadExcel";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

const SignUpPage = () => (
  <div style={{ paddingLeft: "80px", paddingRight: "80px" }}>
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  name: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  faculty: "",
  file: null,
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { name, email, passwordOne, file, faculty } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email.concat("@u.nus.edu"), passwordOne)
      .then((authUser) => {
        // Update user profile
        this.props.firebase.doUpdateProfile(name);

        // Upload file to Firebase storage
        var uploadFile = this.props.firebase
          .userStorage(authUser.user.uid)
          .child(file.name)
          .put(file);

        // Create user in the Firebase realtime database
        uploadFile.then((snapshot) => {
          snapshot.ref.getDownloadURL().then((url) => {
            this.props.firebase.user(authUser.user.uid).set({
              name,
              email,
              faculty,
              file: url,
            });

            // Update spreadsheetfile id to Firebase
            new UploadExcel(
              authUser.user.uid,
              faculty,
              url,
              this.props.firebase
            ).loadClient();
          });
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        // Reset state to intial state and redirect user to Home page
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  render() {
    const {
      name,
      email,
      passwordOne,
      passwordTwo,
      faculty,
      error,
    } = this.state;

    const isInvalid =
      email !== ""
        ? email.length !== 8 || email.charAt(0).toUpperCase() !== "E"
        : false;

    const isValid = email.length === 8 && email.charAt(0).toUpperCase() === "E";

    const invalidPassword =
      passwordOne === "" || passwordTwo === ""
        ? false
        : isValid &&
          name !== "" &&
          faculty !== "" &&
          passwordOne !== passwordTwo;

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            name="name"
            value={name}
            type="text"
            placeholder="Enter full name"
            onChange={this.onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label>NUS email address</Form.Label>
          <InputGroup className="email">
            <Form.Control
              placeholder="NUSNET ID"
              name="email"
              value={email}
              aria-label="NUSNET ID"
              aria-describedby="basic-addon2"
              onChange={this.onChange}
              isInvalid={isInvalid}
              isValid={isValid}
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
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Faculty</Form.Label>
          <Form.Control
            as="select"
            required
            name="faculty"
            onChange={this.onChange}
          >
            <option hidden>Select your faculty</option>
            <option value="Arts and Social Sciences">
              Arts and Social Sciences
            </option>
            <option value="Business">Business</option>
            <option value="Computing">Computing</option>
            <option value="Dentistry">Dentistry</option>
            <option value="Design and Environment">
              Design and Environment
            </option>
            <option value="Engineering">Engineering</option>
            <option value="Law">Law</option>
            <option value="Medicine">Medicine</option>
            <option value="Science">Science</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="passwordOne"
            value={passwordOne}
            type="password"
            placeholder="Password"
            onChange={this.onChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="passwordTwo"
            value={passwordTwo}
            type="password"
            placeholder="Password"
            onChange={this.onChange}
            isInvalid={invalidPassword}
            required
          />
          <Form.Control.Feedback type="invalid">
            Invalid password. Please ensure both passwords are the same.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group required onChange={this.onFileChange}>
          <Form.File id="exampleFormControlFile1" label="Upload Excel File" />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={invalidPassword}>
          Sign Up
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
//disabled={isInvalid}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
