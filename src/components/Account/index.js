import React, { Component } from "react";
import { compose } from "recompose";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { withFirebase } from "../Firebase";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => (
      <div>
        <h1>Account details</h1>
        <p>Name: {authUser.displayName}</p>
        <p>Email: {authUser.email}</p>
        <AccountInfo authUser={authUser} />
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      url: null,
      faculty: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.authUser.uid)
      .once("value", (snapshot) => {
        var details = snapshot.val();
        console.log("details", details);
        this.setState({
          loading: false,
          url: details.file,
          faculty: details.faculty,
        });
      });
  }

  render() {
    const { url, loading, faculty } = this.state;

    return (
      <div>
        {loading ? (
          " Loading details..."
        ) : (
          <React.Fragment>
            <p>Faculty: {faculty}</p>
            <p>
              Excel file:{" "}
              <a target="_blank" rel="noopener noreferrer" href={url}>
                {" "}
                Download excel file
              </a>{" "}
            </p>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const AccountInfo = withFirebase(AccountDetails);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
