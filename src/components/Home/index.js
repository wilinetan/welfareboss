import React from 'react';
 
import { withAuthorization } from '../Session';

 
const HomePage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <h1>Queue List</h1>
  </div>
);
 
const condition = authUser => !!authUser;
 
export default withAuthorization(condition)(HomePage);
