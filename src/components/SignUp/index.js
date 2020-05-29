import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
 
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
 
const SignUpPage = () => (
  <div style={{ paddingLeft: '80px', paddingRight: '80px' }}>
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  file: null,
  error: null,
};
 
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { username, email, passwordOne, file } = this.state;
 
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Update user profile
        this.props.firebase.doUpdateProfile(username);

        // Upload file to Firebase storage
        var uploadFile = this.props.firebase.userStorage(authUser.user.uid).child(file.name).put(file);
        
        // Create user in the Firebase realtime database
        uploadFile.then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            this.props.firebase
              .user(authUser.user.uid)
              .set({
                username,
                email,
                file: url
              });
          });
        });
      })
      .then(authUser => {
        // Reset state to intial state and redirect user to Home page
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onFileChange = event => {
    this.setState({ file: event.target.files[0] })
  }
 
  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    // const isInvalid =
    //   passwordOne !== passwordTwo ||
    //   passwordOne === '' ||
    //   email === '' ||
    //   username === '';

    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Group controlId="formBasicName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control 
            name="username"
            value={username}
            type="text" 
            placeholder="Enter full name"
            onChange={this.onChange} 
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            required
            name="email"
            value={email}
            type="email" 
            placeholder="Enter email"
            onChange={this.onChange} 
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            required
            name="passwordOne"
            value={passwordOne}
            type="password" 
            placeholder="Password"
            onChange={this.onChange} 
          />
        </Form.Group>

        <Form.Group controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control 
            required
            name="passwordTwo"
            value={passwordTwo}
            type="password" 
            placeholder="Password"
            onChange={this.onChange} 
          />
        </Form.Group>

        <Form.Group controlId="formFileUpload">
          <Form.Label>Upload Excel File</Form.Label>
          <Form.Control 
            required
            type="file"
            placeholder="Upload file"
            onChange={this.onFileChange}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Sign Up
        </Button>

        {error && <p>{error.message}</p>}
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

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);
 
export default SignUpPage;
 
export { SignUpForm, SignUpLink };