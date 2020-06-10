import React, { Component } from "react";

// import QueueItem from "../QueueItem";
import { withFirebase } from "../Firebase";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

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

    this.props.firebase.db
      .ref("14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/ids")
      .on("value", (snapshot) => {
        const usersObject = snapshot.val();

        const queueList = Object.keys(usersObject).map((key) => ({
          ...usersObject[key],
        }));

        this.setState({
          students: queueList,
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.db
      .ref("14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/ids")
      .off();
  }

  markCollect = (teleid) => {
    console.log("teleid", teleid);

    this.props.firebase.db
      .ref(
        `14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/ids/${teleid}/collected`
      )
      .once("value", (snapshot) => {
        const isCollected = snapshot.val();
        this.props.firebase.db
          .ref(`14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/ids/${teleid}`)
          .update({
            collected: !isCollected,
          });
      });

    this.props.firebase.db
      .ref("14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/ids")
      .on("value", (snapshot) => {
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
      <div className="queuelist-container" style={{ margin: "20px" }}>
        <h1>Queue List</h1>
        {loading && <div>Loading ...</div>}

        <StudentList students={students} markCollect={this.markCollect} />
      </div>
    );
  }
}

const StudentList = ({ students, markCollect }) => (
  <Table striped bordered hover size="sm" style={{ width: "1400px" }}>
    <thead>
      <tr>
        <th>Queue Number</th>
        <th>Name</th>
        <th>Matric Number</th>
        <th>Faculty survey</th>
        <th>NUSSU survey</th>
        <th>Collected</th>
        <th>Checkbox</th>
      </tr>
    </thead>
    <tbody>
      {students.sort(studentComparator).map((student) => (
        <tr
          key={student.teleid}
          style={{
            background: student.collected ? "grey" : "white",
          }}
        >
          <td>{student.queueNum}</td>
          <td>{student.name}</td>
          <td>{student.matric}</td>
          <td>
            <a target="_blank" rel="noopener noreferrer" href={student.faculty}>
              {" "}
              Faculty
            </a>
          </td>
          <td>
            <a target="_blank" rel="noopener noreferrer" href={student.nussu}>
              {" "}
              NUSSU
            </a>
          </td>
          <td>{student.collected.toString()}</td>
          <td>
            <Form.Check
              id={student.teleid}
              type="checkbox"
              onClick={() => markCollect(student.teleid)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const studentComparator = (student1, student2) => {
  return student1.collected === student2.collected
    ? student1.queueNum - student2.queueNum
    : student1.collected
    ? 1
    : -1;
};

export default withFirebase(QueueList);
