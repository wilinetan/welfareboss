<<<<<<< HEAD
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

 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(HomePage);

import React, { Component } from 'react';
import { compose } from 'recompose'; 
import { withAuthorization, AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
=======
import React from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
>>>>>>> 667de024f909d45326cdb647bd879594003381d6

const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => 
      <div>
        <h1>Queue Details</h1>
        <p>Current Serving Queue Number:</p>
        <p>Last Issued Queue Number:</p>
        <p>Number of people in Queue:</p>
      </div>
    }
  </AuthUserContext.Consumer>
);

<<<<<<< HEAD

class queuedetbase extends Component {
  constructor(props){
    super(props);

    this.state = {
      loading: false,
      queuedet: [],
    };
  }
  
  componentDidMount(){
    this.setState({loading:true});

    this.props.firebase.db.ref(14MeO__j9jCngVkWmjCB4H4HetHmfE15V8fJNnTVAaXQ/queueDetails).on('value',snapshot => {
      var queuedet = snapshot.val().
      this.setState({loading:false});
    })
  }

  componentWillUnmount(){
    this.props.firebase.queuedet().off();
  }
  
  render(){
    const {queuedet, loading} = this.state;
    return(
      <div>
        {loading && <div>Loading...</div>}
        <queuedetlist queuedet ={queuedet}/>
      </div>
    );
  }
}
const queuedet = withFirebase(queuedetbase)

const queuedetlist= ({queuedet}) => (
  <ul>
    {queuedet.map(queued => (
      <queuedetitem key={queued.uid} queued = {queued}/>
    ))}
  </ul>
);

const queuedetitem = ({queued}) => (
  <li>
    <strong>{queued.userID}</strong> {queued.text}
  </li>
)
=======
const condition = (authUser) => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
>>>>>>> 667de024f909d45326cdb647bd879594003381d6
