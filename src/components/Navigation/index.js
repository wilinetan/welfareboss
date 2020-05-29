import React from 'react';
import { Link } from 'react-router-dom';
 
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
 
const Navigation = () => (
  <div className="nav">
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul className="links">
    <li>
      <Link style={linkStyle} to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);


const NavigationNonAuth = () => (
  <ul className="links">
    <li>
      <Link style={linkStyle} to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

const linkStyle = {
  fontFamily:'Bookman',
  color: 'black',
  textDecoration: 'underline'
}
 
export default Navigation;
