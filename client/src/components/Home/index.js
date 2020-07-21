import React, { Component } from "react";
import { withAuthorization, withEmailVerification } from "../Session";

import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import QueueList from "../QueueList";

import {
	MDBCard,
	MDBCardBody,
	MDBCardTitle,
	MDBCardText,
	MDBCardGroup,
	MDBContainer,
} from "mdbreact";
import Button from "react-bootstrap/Button";

const HomePage = () => {
  return (
    <div className="homepage" id="homepage">
      <QueueInfo />s
    </div>
  );
};

class QueueDetails extends Component {
	constructor(props) {
		super(props);

    this.state = {
      loading: false,
      currServing: 0,
      currQueueNum: 0,
      left: "",
      startCollection: false,
    };
  }

  componentDidMount = () => {
    this.setState({ loading: true });

		this.props.firebase.queueDetails().on("value", (snapshot) => {
			var details = snapshot.val();

      this.setState({
        loading: false,
        currServing: details.currServing,
        currQueueNum: details.currQueueNum,
        startCollection: details.startCollection,
      });
    });
  };

  componentWillUnmount = () => {
    this.props.firebase.queueDetails().off();
  };

  // Update number of people left in the queue
  updateLeft = (left) => {
    this.setState({
      left: left,
    });
  };

  // Start the collection
  onClick = () => {
    const currState = this.state.startCollection;

    this.props.firebase.queueDetails().update({
      startCollection: !currState,
    });

    this.setState({
      startCollection: !currState,
    });
  };

  render() {
    const {
      loading,
      currServing,
      currQueueNum,
      left,
      startCollection,
    } = this.state;
    return (
      <React.Fragment>
        <div className="dashboard" data-test="dashboard" id="dashboard">
          {loading && <div>Loading ...</div>}

          <div className="text-center">
            <MDBContainer>
              <MDBCardGroup>
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle tag="h5">
                      Current Serving Queue Number
                    </MDBCardTitle>
                    <MDBCardText
                      tag="h2"
                      style={{
                        fontSize: startCollection ? "2rem" : "18px",
                        color: startCollection ? "black" : "red",
                      }}
                    >
                      {startCollection
                        ? currServing
                        : "Collection has not started. Click the Start collection button to start the collection."}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard>
                  <MDBCardBody data-test="currQueueNum-card">
                    <MDBCardTitle tag="h5" data-test="currQueueNum-cardtitle">
                      Last Issued Queue Number
                    </MDBCardTitle>
                    <MDBCardText tag="h2" data-test="dashboard-currQueueNum">
                      {currQueueNum}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle tag="h5">
                      Number of people in Queue
                    </MDBCardTitle>
                    <MDBCardText tag="h2">{left}</MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCardGroup>
            </MDBContainer>
          </div>
          <div className="text-center" style={{ marginTop: "15px" }}>
            <Button type="submit" onClick={this.onClick}>
              {startCollection ? "Stop Collection" : "Start Collection"}
            </Button>
          </div>
        </div>
        <QueueList
          startCollection={startCollection}
          currServing={currServing}
          left={left}
          updateLeft={this.updateLeft}
        />
      </React.Fragment>
    );
  }
}

const QueueInfo = withFirebase(QueueDetails);

const condition = (authUser) => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition)
)(HomePage);
