import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";

import { withFirebase } from "../Firebase";

import * as ROUTES from "../../constants/routes";
import PasswordChangeForm from "../PasswordChange";
import ExcelChange from "../ExcelChange";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

const EditAccountPage = (props) => (
  <AuthUserContext.Consumer>
    {(authUser) => <EditAccount authUser={authUser} {...props} />}
  </AuthUserContext.Consumer>
);

class EditAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      excelFile: "",
      startDate: "",
      endDate: "",
      dateRange: "",
      startTime: "",
      endTime: "",
      timeRange: "",
      venue: "",
      nussuLink: "",
      facultyLink: "",
      name: "",
      email: "",
      error: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.adminDetails().once("value", (snapshot) => {
      var details = snapshot.val();

      const startTime = details.starttime;
      const startTimeEdited = startTime.slice(0, 2) + ":" + startTime.slice(2);

      const endTime = details.endtime;
      const endTimeEdited = endTime.slice(0, 2) + ":" + endTime.slice(2);

      const timeRange = [startTimeEdited, endTimeEdited];

      const startDate = details.startdate;
      const startDateArr = startDate.split("/");
      const startDateObject = new Date(
        parseInt(startDateArr[2], 10) + 2000,
        parseInt(startDateArr[1], 10) - 1,
        startDateArr[0]
      );

      const endDate = details.enddate;
      const endDateArr = endDate.split("/");
      const endDateObject = new Date(
        parseInt(endDateArr[2], 10) + 2000,
        parseInt(endDateArr[1], 10) - 1,
        endDateArr[0]
      );

      const dateRange = [startDateObject, endDateObject];

      this.setState({
        loading: false,
        excelFile: details.excelfile,
        startDate,
        endDate,
        dateRange,
        startTime,
        endTime,
        timeRange,
        venue: details.venue,
        nussuLink: details.nussulink,
        facultyLink: details.facultylink,
        name: this.props.authUser.displayName,
        email: this.props.authUser.email,
      });
    });
  }

  onSubmit = (event) => {
    const {
      name,
      startTime,
      endTime,
      dateRange,
      startDate,
      endDate,
      facultyLink,
      nussuLink,
      venue,
      uid,
    } = this.state;

    // Update user data
    this.props.firebase
      .user(uid)
      .update({
        name,
        startTime,
        endTime,
        startDate,
        endDate,
        facultyLink,
        nussuLink,
        venue,
      })
      .then(() => {
        // Update admin details
        this.props.firebase.adminDetails().update({
          starttime: startTime,
          endtime: endTime,
          startdate: startDate,
          enddate: endDate,
          venue,
          facultylink: facultyLink,
          nussulink: nussuLink,
        });
      })
      .then(() => {
        // Update collection database in firebase
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = dateRange[0];
        const secondDate = dateRange[1];

        const diffDays =
          Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;

        const starttime = parseInt(startTime, 10);
        const endtime = parseInt(endTime, 10);

        this.props.firebase.colByDateTime().remove();

        for (var day = 1; day <= diffDays; day++) {
          for (var hour = starttime; hour < endtime; hour += 100) {
            this.props.firebase
              .colByDateTime()
              .child(day.toString())
              .update({
                [hour]: 0,
                total: 0,
              });
          }
        }
      })
      .then(() => {
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

  onDateChange = (date) => {
    const start = date[0];
    const end = date[1];

    const formattedStart =
      start.getDate() +
      "/" +
      (start.getMonth() + 1) +
      "/" +
      (start.getFullYear() % 100);

    const formattedEnd =
      end.getDate() +
      "/" +
      (end.getMonth() + 1) +
      "/" +
      (end.getFullYear() % 100);

    this.setState({
      dateRange: date,
      startDate: formattedStart,
      endDate: formattedEnd,
    });
  };

  onTimeChange = (time) => {
    const start = time[0].split(":").join("");
    const end = time[1].split(":").join("");

    this.setState({ timeRange: time, startTime: start, endTime: end });
  };

  disableDateTime = () => {
    if (this.state.startDate !== "") {
      const startDate = new Date(this.state.dateRange[0]);
      const endDate = new Date(this.state.dateRange[1]);

      startDate.setHours(parseInt(this.state.startTime.slice(0, 2), 10) - 1);
      endDate.setHours(parseInt(this.state.endTime.slice(0, 2), 10));

      const currDate = new Date();

      if (currDate < startDate || currDate > endDate) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  render() {
    const {
      excelFile,
      dateRange,
      startTime,
      endTime,
      timeRange,
      venue,
      nussuLink,
      facultyLink,
      name,
      email,
      error,
    } = this.state;

    const invalidUrl = (url) => {
      if (
        url === "" ||
        url.includes("http:") ||
        url.includes("https:") ||
        url.includes("www")
      ) {
        return false;
      } else {
        return true;
      }
    };

    const invalidTime = parseInt(startTime) - parseInt(endTime) >= 0;

    return (
      <div
        className="container"
        style={{
          border: "solid",
          fontFamily: "system-ui",
          marginBottom: "50px",
        }}
      >
        <Tab.Container id="edit-account-tab" defaultActiveKey="first">
          <div className="row" style={{ marginTop: "20px" }}>
            <div className="col-md-4">
              <h2 style={{ lineHeight: "1.5" }}>Edit Account Details</h2>
            </div>
            <div className="col-md-8">
              <Nav>
                <Nav.Item>
                  <Nav.Link eventKey="first">Collection details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Change Excel File</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">Change Password</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>

          <hr style={{ border: "2px solid black" }} />

          <Tab.Content>
            <Tab.Pane eventKey="first">
              <Form
                onSubmit={this.onSubmit}
                style={{
                  overflow: "hidden",
                }}
              >
                <div
                  className="row"
                  style={{ marginBottom: "20px", fontSize: "18px" }}
                >
                  <div className="col-5">
                    <Form.Group as={Row} controlId="editName">
                      <Col md="auto">
                        <Form.Label style={{ lineHeight: "2" }}>
                          Name
                        </Form.Label>
                      </Col>
                      <Col md="auto">
                        <Form.Control
                          name="name"
                          value={name}
                          type="text"
                          onChange={this.onChange}
                          required
                        />
                      </Col>
                    </Form.Group>
                  </div>
                  <div className="col-7">
                    <Form.Group as={Row} controlId="editEmail">
                      <Col md="auto">
                        <Form.Label style={{ lineHeight: "2" }}>
                          NUS Email Address
                        </Form.Label>
                      </Col>
                      <Col md="auto">
                        <Form.Control
                          name="email"
                          value={email}
                          type="text"
                          onChange={this.onChange}
                          required
                          disabled
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ marginBottom: "20px", fontSize: "18px" }}
                >
                  <div className="col-6">
                    <Form.Group as={Row} controlId="editDates">
                      <Col md="auto">
                        <Form.Label>Collection Dates</Form.Label>
                      </Col>
                      <Col md="auto">
                        <DateRangePicker
                          onChange={this.onDateChange}
                          value={dateRange}
                          required={true}
                          clearIcon={null}
                          disabled={this.disableDateTime()}
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ marginBottom: "20px", fontSize: "18px" }}
                >
                  <div className="col-6">
                    <Form.Group as={Row} controlId="editTime">
                      <Col md="auto">
                        <Form.Label>Collection Time</Form.Label>
                      </Col>
                      <Col md="auto">
                        <TimeRangePicker
                          onChange={this.onTimeChange}
                          value={timeRange}
                          format="hh:mm a"
                          disableClock={true}
                          maxDetail="minute"
                          required={true}
                          clearIcon={null}
                          disabled={this.disableDateTime()}
                        />
                        <Form.Text>
                          {invalidTime && (
                            <p style={{ color: "red" }}>
                              Please input a valid time range.
                            </p>
                          )}
                        </Form.Text>
                      </Col>
                    </Form.Group>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ marginBottom: "20px", fontSize: "18px" }}
                >
                  <div className="col-4">
                    <Form.Group as={Row} controlId="editVenue">
                      <Col md="auto">
                        <Form.Label style={{ lineHeight: "2" }}>
                          Venue
                        </Form.Label>
                      </Col>
                      <Col md="auto">
                        <Form.Control
                          name="venue"
                          value={venue}
                          type="text"
                          onChange={this.onChange}
                          required
                        />
                      </Col>
                    </Form.Group>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ marginBottom: "20px", fontSize: "18px" }}
                >
                  <div className="col-5">
                    <Form.Group as={Row} controlId="editFacultyLink">
                      <Col md="auto">
                        <Form.Label style={{ lineHeight: "2" }}>
                          Faculty Link
                        </Form.Label>
                      </Col>
                      <Col md="auto">
                        <Form.Control
                          name="facultyLink"
                          value={facultyLink}
                          type="text"
                          onChange={this.onChange}
                          required
                          style={{ width: "300px" }}
                          isInvalid={invalidUrl(facultyLink)}
                        />
                        <Form.Control.Feedback type="invalid">
                          The link is not a valid url.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </div>
                  <div className="col-7">
                    <Form.Group as={Row} controlId="editNussuLink">
                      <Col md="auto">
                        <Form.Label style={{ lineHeight: "2" }}>
                          NUSSU Link
                        </Form.Label>
                      </Col>
                      <Col md="auto">
                        <Form.Control
                          name="nussuLink"
                          value={nussuLink}
                          type="text"
                          onChange={this.onChange}
                          required
                          style={{ width: "300px" }}
                          isInvalid={invalidUrl(nussuLink)}
                        />
                        <Form.Control.Feedback type="invalid">
                          The link is not a valid url.
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </div>
                </div>

                <Button
                  variant="dark"
                  type="submit"
                  style={{ marginBottom: "10px", float: "right" }}
                  disabled={
                    invalidTime ||
                    invalidUrl(facultyLink) ||
                    invalidUrl(nussuLink)
                  }
                >
                  Save Changes
                </Button>

                {error && (
                  <Alert variant="danger" style={{ marginTop: "10px" }}>
                    {error.message}
                  </Alert>
                )}
              </Form>
            </Tab.Pane>

            <Tab.Pane eventKey="second">
              <ExcelChange
                excelFile={excelFile}
                authUser={this.props.authUser}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="third">
              <PasswordChangeForm />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default compose(
  withRouter,
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(EditAccountPage);
