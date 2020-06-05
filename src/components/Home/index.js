
// import React from 'react';
// import { withAuthorization } from '../Session';
// import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardGroup, MDBContainer } from "mdbreact";

// const HomePage = () => {
//   return (
//   <MDBContainer>
//     <MDBCardGroup>
//       <MDBCard>
//         <MDBCardBody>
//           <MDBCardTitle tag="h5">Current Serving Queue Number</MDBCardTitle>
//           <MDBCardText >
//             This is a wider panel with supporting text below as a natural
//             lead-in to additional content. This content is a little bit
//             longer.
//           </MDBCardText>
//           <MDBCardText small muted>
//             Last updated 3 mins ago
//           </MDBCardText>
//         </MDBCardBody>
//       </MDBCard>
//       <MDBCard>
//         <MDBCardBody>
//           <MDBCardTitle tag="h5">Last Issued Queue Number</MDBCardTitle>
//           <MDBCardText>
//             This panel has supporting text below as a natural lead-in to
//             additional content.
//           </MDBCardText>
//           <MDBCardText small muted>
//             Last updated 3 mins ago
//           </MDBCardText>
//         </MDBCardBody>
//       </MDBCard>
//       <MDBCard>
//         <MDBCardBody>
//           <MDBCardTitle tag="h5">Number of people in Queue</MDBCardTitle>
//           <MDBCardText>
//             This is a wider panel with supporting text below as a natural
//             lead-in to additional content. This panel has even longer
//             content than the first to show that equal height action.
//           </MDBCardText>
//           <MDBCardText small muted>
//             Last updated 3 mins ago
//           </MDBCardText>
//         </MDBCardBody>
//       </MDBCard>
//     </MDBCardGroup>
//   </MDBContainer>
//   );
//   };

 

import React, { Component } from "react";
import { compose } from "recompose";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
} from "../Session";
import { withFirebase } from "../Firebase";

const HomePage = () => (
  <AuthUserContext.Consumer>
    {(authUser) => 
      <div>
        <h1>Queue Details</h1>
        <p>Current Serving Queue Number:</p>
        <p>Last Issued Queue Number:</p>
        <p>Number of people in Queue:</p>
      </div>
    }
  </AuthUserContext.Consumer>
);


class QueueDetails extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      currServing:0,
      currQueueNum:0,
      left:0
    };
  }
  
  componentDidMount(){
    this.setState({loading:true});

    this.props.firebase.db.ref('14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ'/'queueDetails').on('value',snapshot => {
      var details =snapshot.val();

      this.setState({
        loading:false,
        currServing: details.currServing,
        currQueueNum: details.currQueueNum,
        left:currQueueNum-currServing});
    })
  }

  componentWillUnmount(){
    this.props.firebase.db.ref('14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ'/'queueDetails').off()
  }
  
  render(){
    const {loading, currServing, currQueueNum, left} = this.state;
    return(
      <div>
        {loading && <div>Loading...</div>}
        <HomePage currServing ={currServing}/>
        <HomePage currQueueNum ={currQueueNum}/>
        <HomePage left ={left}/>
      </div>
    );
  }
};


const QueueInfo = withFirebase(QueueDetails);

const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
