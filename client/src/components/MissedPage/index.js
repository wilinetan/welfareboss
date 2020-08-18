import React, { Component } from "react";

import SurveyImage from "../SurveyImage";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

import { withAuthorization, withEmailVerification } from "../Session";

import { compose } from "recompose";
import { withFirebase } from "../Firebase";

class MissedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      students: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // Get the students that missed their turn in the queue if there are students
    this.props.firebase.teleIds().on("value", (snapshot) => {
      if (snapshot.hasChildren()) {
        const usersObject = snapshot.val();

        const studentsList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
        }));

        // Get all students who missed their turn
        const students = studentsList.filter((student) => student.missed);

        this.setState({
          students: students,
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.teleIds().off();
  }

  // Indicate that a student's survey photos have been verified
  checkVerified = (teleid) => {
    // Update student's data to show that surveys have been verified
    this.props.firebase
      .teleUser(teleid)
      .child("surveyVerified")
      .once("value", (snapshot) => {
        const isVerified = snapshot.val();
        this.props.firebase.teleUser(teleid).update({
          surveyVerified: !isVerified,
        });
      });

    // Update the state to reflect new changes
    this.props.firebase.teleIds().once("value", (snapshot) => {
      const usersObject = snapshot.val();

      const studentsList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
      }));

      // Get all students who missed their turn
      const students = studentsList.filter((student) => student.missed);

      this.setState({
        students: students,
        loading: false,
      });
    });
  };

  render() {
    const { students, loading } = this.state;

    return (
      <div
        style={{
          width: "1200px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}
      >
        <h1>Missed</h1>
        {loading && <div>Loading ...</div>}

        {students.length === 0 ? (
          <p style={{ fontSize: "25px" }}>
            Currently no students who missed their turn
          </p>
        ) : (
          <MissedList students={students} checkVerified={this.checkVerified} />
        )}
      </div>
    );
  }
}

const MissedList = ({ students, checkVerified }) => (
  <div>
    <Table
      bordered
      hover
      size="sm"
      style={{
        width: "1200px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
      }}
    >
      <thead>
        <tr>
          <th>Queue Number</th>
          <th>Name</th>
          <th>Matric Number</th>
          <th>Faculty survey</th>
          <th>NUSSU survey</th>
          <th>Verified</th>
        </tr>
      </thead>
      <tbody>
        {students
          .sort((student1, student2) => student1.queueNum - student2.queueNum)
          .map((student) => (
            <tr key={student.teleid} data-test={"missedlist-" + student.teleid}>
              <td>{student.queueNum}</td>
              <td>{student.name}</td>
              <td>{student.matric}</td>
              <td>
                <SurveyImage imageUrl={student.faculty} />
              </td>
              <td>
                <SurveyImage imageUrl={student.nussu} />
              </td>
              <td>
                <Form.Check
                  id={student.teleid}
                  type="checkbox"
                  onChange={() => checkVerified(student.teleid)}
                  checked={student.surveyVerified}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  </div>
);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase
)(MissedPage);
