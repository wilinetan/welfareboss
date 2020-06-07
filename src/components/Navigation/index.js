import React from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const Navigation = () => (
  <div className="nav">
    <img
      alt=""
      src="https://lh3.googleusercontent.com/WAj_qKdZbj8R5iPHhL03ygIZkVAVo2n7Y6-hALAyIWhtof7vr6kdEGL3wi3tWQA2pdCq_-5zFdZ1NjvBjnEjdEodAYGz0TfmmbrUMMuaipRvd33oQm6bl_3zVyBjy4ghw0E_InZIsA=w2400"
      width="230px"
      height="80px"
      style={{ marginLeft: "8px", marginTop: "8px" }}
    ></img>
    <AuthUserContext.Consumer>
      {(authUser) =>
        authUser && authUser.emailVerified ? (
          <NavigationAuth />
        ) : (
          <NavigationNonAuth />
        )
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <ul className="links">
    <li>
      <Link style={linkStyle} to={ROUTES.LANDING}>
        Main
      </Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.HOME}>
        Home
      </Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.ACCOUNT}>
        Account
      </Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.ADMIN}>
        Admin
      </Link>
    </li>
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul className="links">
    <li>
      <Link style={linkStyle} to={ROUTES.LANDING}>
        Main
      </Link>
    </li>
    <li>
      <Link style={linkStyle} to={ROUTES.SIGN_IN}>
        Sign In
      </Link>
    </li>
  </ul>
);

const linkStyle = {
  fontFamily: "Bookman",
  color: "black",
};

export default Navigation;
