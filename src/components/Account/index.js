import React, { Component } from 'react';
 
import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => 
      <div>
        <h1>Account details</h1>
        <p>Name: {authUser.displayName}</p>
        <p>Email: {authUser.email}</p>
        <AccountInfo authUser={authUser} />
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    }
  </AuthUserContext.Consumer>
);

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      url: null
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase
    .user(this.props.authUser.uid).once("value", snapshot => {
      var fileUrl = snapshot.val().file;
      this.setState({
        loading: false,
        url: fileUrl
      });
    });
  }

  render() {
    const { url, loading } = this.state;
 
    return (
      <div>
        <p>Excel file:
          {loading 
            ? " Loading..."
            : <a target="_blank" rel="noopener noreferrer" href={url}> Download excel file</a> }
        </p>
      </div>
    );
  }
}

const AccountInfo = withFirebase(AccountDetails)
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(AccountPage);