import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import StudentList from "../StudentList";
import MissedList from "../MissedList";

class QueueList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      students: [],
      missed: [],
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

        const sortedLists = sortStudents(studentsList);

        this.setState({
          students: sortedLists[0],
          missed: sortedLists[1],
          loading: false,
        });

        this.interval = setInterval(() => this.checkMissed(), 60000);

        // Update number of people left in the queue after taking into acount those who missed thier turn
        this.props.updateLeft(
          this.props.left === ""
            ? this.state.students.filter((student) => !student.collected).length
            : Math.min(
                this.props.left,
                this.state.students.filter((student) => !student.collected)
                  .length
              )
        );
      } else {
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

  checkMissed() {
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

    // Check students who currently have a time and have not collected
    const [withTime, withoutTime] = this.state.students
      .filter((student) => !student.collected)
      .reduce(
        ([withTime, withoutTime], student) =>
          student.time
            ? [[...withTime, student], withoutTime]
            : [withTime, [...withoutTime, student]],
        [[], []]
      );

    withTime.forEach((student) => {
      // Remove student from queue if it has been more than 5 minutes
      if (currDate - student.time >= 300000) {
        this.props.firebase.teleUser(student.teleid).update({
          missed: true,
        });

        // Update firebase with the student that missed
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
      Math.min(
        this.props.left,
        this.state.students.filter((student) => !student.collected).length
      )
    );
  }

  // Indicate student has collected welfare pack
  markCollect = (teleid) => {
    this.props.firebase.teleUser(teleid).once("value", (snapshot) => {
      const details = snapshot.val();
      const isCollected = details.collected;

      // Update student's data as collected
      this.props.firebase.teleUser(teleid).update({
        collected: !isCollected,
      });

      // Update current serving
      this.props.firebase
        .queueDetails()
        .update({
          currServing: Math.max(details.queueNum, this.props.currServing),
        })
        .then(() => {
          this.props.firebase
            .teleIds()
            .orderByChild("queueNum")
            .equalTo(this.props.currServing + 1)
            .once("child_added", (snapshot) => {
              const teleid = snapshot.val().teleid;

              // Update user with time if user currently does not have time
              if (!snapshot.time) {
                this.props.firebase.teleUser(teleid).update({
                  time: Date.now(),
                });
              }
            });
        });
    });

    // Update the state to reflect new changes
    this.props.firebase.teleIds().once("value", (snapshot) => {
      const usersObject = snapshot.val();

      const studentsList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
      }));

      const sortedLists = sortStudents(studentsList);

      this.setState({
        students: sortedLists[0],
        missed: sortedLists[1],
        loading: false,
      });
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

      const sortedLists = sortStudents(studentsList);

      this.setState({
        students: sortedLists[0],
        missed: sortedLists[1],
        loading: false,
      });
    });
  };

  render() {
    const { students, missed, loading } = this.state;

    return (
      <div
        className="queuelist-container"
        style={{ margin: "20px", textAlign: "center" }}
        data-test="queuelist"
      >
        <h1>Queue List</h1>
        {loading && <div>Loading ...</div>}

        {students.length === 0 ? (
          <p style={{ fontSize: "25px" }}>Currently no students in the queue</p>
        ) : (
          <StudentList
            students={students}
            markCollect={this.markCollect}
            checkVerified={this.checkVerified}
          />
        )}
        <MissedList students={missed} checkVerified={this.checkVerified} />
      </div>
    );
  }
}

// Sort students into those in the queue and those who missed their turn
const sortStudents = (studentsList) => {
  const [missedList, queueList] = studentsList.reduce(
    ([missed, queue], student) =>
      student.missed
        ? [[...missed, student], queue]
        : [missed, [...queue, student]],
    [[], []]
  );

  const studentList = queueList
    .filter((student) => student.queueNum !== -1)
    .sort(studentComparator);

  return [studentList, missedList];
};

// Sort students according to whether they have collected and queue number
const studentComparator = (student1, student2) => {
  return student1.collected === student2.collected
    ? student1.queueNum - student2.queueNum
    : student1.collected
    ? 1
    : -1;
};

export default withFirebase(QueueList);
