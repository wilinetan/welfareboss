import React, { Component } from "react";
import { compose } from "recompose";
import { Link } from "react-router-dom";

import * as ROUTES from "../../constants/routes";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { withFirebase } from "../Firebase";

import Button from "react-bootstrap/Button";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => <AccountInfo authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class AccountDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      excelFile: "",
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
        excelFile: details.excelfile,
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

    const { displayName, email } = this.props.authUser;

    return (
      <div
        className="container"
        style={{
          border: "solid",
          fontFamily: "system-ui",
          marginBottom: "50px",
        }}
      >
        <div className="row" style={{ fontSize: "18px" }}>
          <div className="col-6">
            <h2
              style={{
                marginTop: "20px",
              }}
            >
              My Account
            </h2>
          </div>
          <div className="col-6">
            <Link to={ROUTES.EDIT_ACCOUNT} style={{ float: "right" }}>
              <Button
                variant="dark"
                type="button"
                style={{ marginTop: "22px" }}
              >
                Edit Account
              </Button>
            </Link>
          </div>
        </div>

        <hr style={{ border: "2px solid black" }} />

        <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
          <div className="col-4">Name: {displayName}</div>
          <div className="col-4">NUS Email Address: {email}</div>
        </div>
        <div className="row" style={{ marginBottom: "20px", fontSize: "18px" }}>
          <div className="col">
            {loading && <div>Loading ...</div>}
            <DbInfo rest={rest} />
          </div>
        </div>
      </div>
    );
  }
}

const DbInfo = ({ rest }) => (
  <React.Fragment>
    <p>
      Excel file:{" "}
      {
        <a target="_blank" rel="noopener noreferrer" href={rest.excelFile}>
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
