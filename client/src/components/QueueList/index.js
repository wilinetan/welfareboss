import React, { Component } from "react";

import { withFirebase } from "../Firebase";
import StudentList from "../StudentList";

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

        const queueList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
        }));

        this.setState({
          students: queueList,
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
        .child("currServing")
        .once("value", (snapshot) => {
          const currServing = snapshot.val();

          this.props.firebase.queueDetails().update({
            currServing: Math.max(details.queueNum, currServing),
          });
        });
    });

    // Update the state to reflect new changes
    this.props.firebase.teleIds().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const queueList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
      }));

      this.setState({
        students: queueList,
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
    this.props.firebase.teleIds().on("value", (snapshot) => {
      const usersObject = snapshot.val();

      const queueList = Object.keys(usersObject).map((key) => ({
        ...usersObject[key],
      }));

      this.setState({
        students: queueList,
        loading: false,
      });
    });
  };

  render() {
    const { students, loading } = this.state;

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
      </div>
    );
  }
}

export default withFirebase(QueueList);
