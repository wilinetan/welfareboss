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
      <div class='container' style={{border:'solid',fontFamily:'system-ui'}}>
          <h2 style={{marginTop:'20px',borderBottom:'solid', marginBottom:'30px' }}>My Account</h2>
          <div class="row" style={{marginBottom:'20px', fontSize:'18px'}}>
            <div class="col-4" >Name: {authUser.displayName}</div>
            <div class="col-4" >Email: {authUser.email}</div>
          </div>
          <div class='row' style={{marginBottom:'20px', fontSize:'18px'}}>
            <div class='col'><AccountInfo authUser={authUser} /></div>
          </div>
          <div class='row' style={{marginBottom:'20px', fontSize:'18px', marginLeft:'3px'}}>
            <PasswordForgetForm />
          </div>
          <div class='row' style={{marginBottom:'20px', fontSize:'18px', marginLeft:'3px'}}>
          <PasswordChangeForm />
          </div>
      </div>
    )}
  </AuthUserContext.Consumer>
);

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      url: "",
      faculty: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
      .user(this.props.authUser.uid)
      .once("value", (snapshot) => {
        var details = snapshot.val();

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
            <div class="row" style={{marginBottom:'12px', fontSize:'18px'}}>
            <div class="col-4" >Faculty: {faculty}</div>
            <div class="col-4" >Excel file:{" "}
              <a target="_blank" rel="noopener noreferrer" href={url}>
                {" "}
                Download excel file
              </a>{" "}</div>
          </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const DbInfo = ({ faculty, url }) => (
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
);

const AccountInfo = withFirebase(AccountDetails);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
