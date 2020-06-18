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
        style={{
          border: "solid",
          fontFamily: "system-ui",
          marginBottom: "50px",
        }}
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

    this.props.firebase.adminDetails().once("value", (snapshot) => {
      var details = snapshot.val();

      this.setState({
        loading: false,
        url: details.file,
        startDate: details.startdate,
        endDate: details.enddate,
        startTime: details.starttime,
        endTime: details.endtime,
        venue: details.venue,
        nussuLink: details.nussulink,
        facultyLink: details.facultylink,
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
    <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
      <div className="col-4">Start Date: {rest.startDate}</div>
      <div className="col-4">End Date: {rest.endDate}</div>
    </div>
    <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
      <div className="col-4">Start Time: {rest.startTime}</div>
      <div className="col-4">End Time: {rest.endTime}</div>
    </div>
    <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
      <div className="col-4">Venue: {rest.venue}</div>
    </div>
    <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
      <div className="col-4">
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
      </div>
      <div className="col-4">
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
      </div>
    </div>
  </React.Fragment>
);

const AccountInfo = withFirebase(AccountDetails);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AccountPage);
