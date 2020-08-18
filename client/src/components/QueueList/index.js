import React, { Component } from "react";
import { withFirebase } from "../Firebase";

import StudentList from "../StudentList";

import Button from "react-bootstrap/Button";

class QueueList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      students: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // Get all the students in the queue if there are students
    this.props.firebase.teleIds().on("value", (snapshot) => {
      if (snapshot.hasChildren()) {
        const usersObject = snapshot.val();

        const studentsList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
        }));

        /* Get all the students who have a queue number, did not miss their turn and have not collected
         and sort them according to their queue number */
        const students = studentsList
          .filter(
            (student) =>
              !student.missed && student.queueNum !== -1 && !student.collected
          )
          .sort((student1, student2) => student1.queueNum - student2.queueNum);

        this.setState({
          students: students,
          loading: false,
        });

        this.interval = setInterval(() => this.checkMissed(), 60000);

        // Update number of people left in the queue after taking into acount those who missed thier turn
        this.props.updateLeft(
          this.props.left === ""
            ? this.state.students.length
            : Math.min(this.props.left, this.state.students.length)
        );
      } else {
        // There are no students in the queue
        this.setState({
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.teleIds().off();
    clearInterval(this.interval);
  }

  checkMissed = () => {
    const currDate = Date.now();

    // When collection has not started
    if (!this.props.startCollection) {
      return;
    }

    // When there are no students in the queue
    if (this.state.students.length === 0) {
      return;
    }

    // Student at the front of the queue currently
    const currStudent = this.state.students[0];

    // If currrent student does not currently have a time, set time for student
    if (!currStudent.time) {
      this.props.firebase.teleUser(currStudent.teleid).update({
        time: currDate,
      });
    }

    // Separate students into 2 arrays: one for students with time, one without
    const [withTime, withoutTime] = this.state.students.reduce(
      ([withTime, withoutTime], student) =>
        student.time
          ? [[...withTime, student], withoutTime]
          : [withTime, [...withoutTime, student]],
      [[], []]
    );

    // Check students who currently have a time
    withTime.forEach((student) => {
      // Remove student from queue if it has been more than 5 minutes
      if (currDate - student.time >= 300000) {
        // Update user as missed in firebase
        this.props.firebase.teleUser(student.teleid).update({
          missed: true,
        });

        // Update firebase with this student that missed
        this.props.firebase.computing().update({ missed: student.teleid });

        // Set time for next student if he does not have a time and has not collected
        withoutTime
          .filter((student1) => student1.queueNum === student.queueNum + 1)
          .forEach((student) => {
            this.props.firebase.teleUser(student.teleid).update({
              time: currDate,
            });
          });
      }
    });

    // Update number of people left in the queue after taking into acount those who missed thier turn
    this.props.updateLeft(
      Math.min(this.props.left, this.state.students.length)
    );
  };

  // Indicate student has collected welfare pack
  markCollect = (teleid) => {
    this.props.firebase.teleUser(teleid).once("value", (snapshot) => {
      const details = snapshot.val();

      // Update student's data as collected
      this.props.firebase.teleUser(teleid).update({
        collected: true,
      });

      // Update current serving
      this.props.firebase
        .queueDetails()
        .update({
          currServing: Math.max(details.queueNum + 1, this.props.currServing),
        })
        .then(() => {
          // Update next student with time if student currently does not have time
          this.props.firebase
            .teleIds()
            .orderByChild("queueNum")
            .equalTo(details.queueNum + 1)
            .once("child_added", (snapshot) => {
              const teleid = snapshot.val().teleid;

              if (!snapshot.time) {
                this.props.firebase.teleUser(teleid).update({
                  time: Date.now(),
                });
              }
            });
        });
    });

    // Update number of students collected
    this.props.firebase.colDetails().once("value", (snapshot) => {
      const total = snapshot.val().total;

      // Update total number of students collected
      this.props.firebase.colDetails().update({
        total: total + 1,
      });

      // Update number of students collected for that day and hour and the total for that day
      this.props.firebase.adminDetails().once("value", (snapshot) => {
        const startDateArr = snapshot.val().startdate.split("/");
        const startDate = new Date(
          parseInt(startDateArr[2]) + 2000,
          parseInt(startDateArr[1]) - 1,
          parseInt(startDateArr[0])
        );

        const currDate = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

        console.log("startDate", startDate);
        console.log("currDate", currDate);

        const dayNumber =
          Math.round(Math.abs((currDate - startDate) / oneDay)) === 0
            ? 1
            : Math.round(Math.abs((currDate - startDate) / oneDay));
        const hour = currDate.getHours() * 100;

        console.log("dayNumber", dayNumber);
        console.log("hour", hour);

        this.props.firebase
          .colByDateTime()
          .child(dayNumber.toString())
          .once("value", (snapshot) => {
            console.log("snapshot val", snapshot.val());
            console.log(
              "child snapshot",
              snapshot.child(hour.toString()).val()
            );
            this.props.firebase
              .colByDateTime()
              .child(dayNumber.toString())
              .update({
                [hour]: snapshot.child(hour.toString()).val() + 1,
                total: snapshot.val().total + 1,
              });
          });
      });
    });

    // Update the state to reflect new changes
    this.props.firebase.teleIds().once("value", (snapshot) => {
      const usersObject = snapshot.val();

      const studentsList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
      }));

      /* Get all the students who have a queue number, did not miss their turn and have not collected
         and sort them according to their queue number */
      const students = studentsList
        .filter(
          (student) =>
            !student.missed && student.queueNum !== -1 && !student.collected
        )
        .sort((student1, student2) => student1.queueNum - student2.queueNum);

      this.setState(
        {
          students: students,
          loading: false,
        },
        () => {
          // Update number of people left in the queue after taking into account those who missed thier turn
          this.props.updateLeft(
            Math.min(this.props.left, this.state.students.length)
          );
        }
      );
    });
  };

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

      /* Get all the students who have a queue number, did not miss their turn and have not collected
         and sort them according to their queue number */
      const students = studentsList
        .filter(
          (student) =>
            !student.missed && student.queueNum !== -1 && !student.collected
        )
        .sort((student1, student2) => student1.queueNum - student2.queueNum);

      this.setState({
        students: students,
        loading: false,
      });
    });
  };

  render() {
    const { students, loading } = this.state;

    return (
      <React.Fragment>
        <div className="text-center" style={{ marginTop: "15px" }}>
          <Button
            type="submit"
            onClick={() => {
              students.length === 0
                ? this.props.handleStartCollection(0)
                : this.props.handleStartCollection(students[0].queueNum);
            }}
          >
            {this.props.startCollection
              ? "Stop Collection"
              : "Start Collection"}
          </Button>
        </div>
        <div
          className="queuelist-container"
          style={{ margin: "20px", textAlign: "center" }}
          data-test="queuelist"
        >
          <h1>Queue List</h1>
          {loading && <div>Loading ...</div>}

          {students.length === 0 ? (
            <p style={{ fontSize: "25px" }}>
              Currently no students in the queue
            </p>
          ) : (
            <StudentList
              students={students}
              markCollect={this.markCollect}
              checkVerified={this.checkVerified}
              startCollection={this.props.startCollection}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withFirebase(QueueList);
