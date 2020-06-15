import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

class SignOutButton extends Component {
  handleClick = (firebase, history)  => {
    firebase.doSignOut()
      .then(() => history.push(ROUTES.LANDING))
      .catch((err) => console.log(err));
  }

  render() {
    const { history, firebase } = this.props;
    return (
      <button type="button" style={{color:'rgba(253, 153, 153)', backgroundColor:'black',borderBlockColor:'white'}}onClick={() => this.handleClick(firebase, history)}>
        Sign Out
      </button>
    );
  }
}
 
export default compose(withRouter, withFirebase)(SignOutButton);

