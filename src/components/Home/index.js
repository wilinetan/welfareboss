
import React, { Component } from "react";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardGroup, MDBContainer } from "mdbreact";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";

const HomePage = () => {
  return (
    <QueueInfo />
  );
  };

 



// const HomePage = () => (
//   <AuthUserContext.Consumer>
//     {(authUser) => (
//       <div>
//         <h1>Queue Details</h1>
//         <QueueInfo />
//       </div>
//     )}
//   </AuthUserContext.Consumer>
// );

class QueueDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      currServing: 0,
      currQueueNum: 0,
      left: 0,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.db
      .ref("14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/queueDetails")
      .on("value", (snapshot) => {
        var details = snapshot.val();
        console.log("details", details);

        this.setState({
          loading: false,
          currServing: details.currServing,
          currQueueNum: details.currQueueNum,
          left: details.currQueueNum - details.currServing,
        });
      });
  }

  render() {
    const { loading, currServing, currQueueNum, left } = this.state;
    return (
      <div>
        {loading ? (
          "Loading details"
        ) : (
          <React.Fragment>
            <div class='text-center'>
            <MDBContainer >
              <MDBCardGroup>
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle tag="h5">Current Serving Queue Number</MDBCardTitle>
                    <MDBCardText tag='h2'>
                      {currServing}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle tag="h5">Last Issued Queue Number</MDBCardTitle>
                    <MDBCardText tag='h2'>
                    {currQueueNum}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard>
                  <MDBCardBody>
                    <MDBCardTitle tag="h5">Number of people in Queue</MDBCardTitle>
                    <MDBCardText tag='h2'>
                      {left}
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCardGroup>
            </MDBContainer>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

const QueueInfo = withFirebase(QueueDetails) 

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
