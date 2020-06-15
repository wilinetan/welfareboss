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
      <div
        className="container"
        style={{ border: "solid", fontFamily: "system-ui" }}
      >
        <h2
          style={{
            marginTop: "20px",
            borderBottom: "solid",
            marginBottom: "30px",
          }}
        >
          My Account
        </h2>
        <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
          <div className="col-4">Name: {authUser.displayName}</div>
          <div className="col-4">Email: {authUser.email}</div>
        </div>
        <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
          <div className="col">
            <AccountInfo authUser={authUser} />
          </div>
        </div>
        <div
          className="row"
          style={{ marginBottom: "20px", fontSize: "18px", marginLeft: "3px" }}
        >
          <PasswordForgetForm />
        </div>
        <div
          className="row"
          style={{ marginBottom: "20px", fontSize: "18px", marginLeft: "3px" }}
        >
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
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      venue: "",
      nussuLink: "",
      facultyLink: "",
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
          startDate: details.startDate,
          endDate: details.endDate,
          startTime: details.startTime,
          endTime: details.endTime,
          venue: details.venue,
          nussuLink: details.nussuLink,
          facultyLink: details.facultyLink,
        });
      });
  }

  render() {
    const { loading, ...rest } = this.state;

    return (
      <div>
        {loading && <div>Loading ...</div>}
        <DbInfo rest={rest} />
      </div>
    );
  }
}

const DbInfo = ({ rest }) => (
  <React.Fragment>
    <p>
      Excel file:{" "}
      {
        <a target="_blank" rel="noopener noreferrer" href={rest.url}>
          Download excel file
        </a>
      }{" "}
    </p>
    <p>Start Date: {rest.startDate}</p>
    <p>End Date: {rest.endDate}</p>
    <p>Start Time: {rest.startTime}</p>
    <p>End Time: {rest.endTime}</p>
    <p>Venue: {rest.venue}</p>
    <p>
      Faculty survey link:{" "}
      {
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={"//" + rest.facultyLink}
        >
          Faculty Link
        </a>
      }{" "}
    </p>
    <p>
      NUSSU survey link:{" "}
      {
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={"//" + rest.nussuLink}
        >
          NUSSU Link
        </a>
      }{" "}
    </p>
  </React.Fragment>
);

const AccountInfo = withFirebase(AccountDetails);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
