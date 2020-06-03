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
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <queuedet/>
  </div>
);

class queuedetbase extends Component {
  construct(props){
    super(props);

    this.state = {
      loading: false,
      queuedet: [],
    };
  }
  
  componentDidMount(){
    this.setState({loading:true});

    this.props.firebase.queuedet().on('value',snapshot => {
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