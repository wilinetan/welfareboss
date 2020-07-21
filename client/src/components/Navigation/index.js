import React from "react";
import { Link } from "react-router-dom";

import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import { AuthUserContext } from "../Session";

const Navigation = () => (
  <div className="nav" style={navbarStyle}>
    <img
      alt=""
      src="https://lh3.googleusercontent.com/WAj_qKdZbj8R5iPHhL03ygIZkVAVo2n7Y6-hALAyIWhtof7vr6kdEGL3wi3tWQA2pdCq_-5zFdZ1NjvBjnEjdEodAYGz0TfmmbrUMMuaipRvd33oQm6bl_3zVyBjy4ghw0E_InZIsA=w2400"
      width="230px"
      height="80px"
      style={{ marginLeft: "8px", marginTop: "8px" }}
    />
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
    <li data-test="landingpage-btn">
      <Link style={linkStyle} to={ROUTES.LANDING}>
        Main
      </Link>
    </li>
    <li data-test="homepage-btn">
      <Link style={linkStyle} to={ROUTES.HOME}>
        Home
      </Link>
    </li>
    <li data-test="statisticspage-btn">
      <Link style={linkStyle} to={ROUTES.STATISTICS}>
        Statistics
      </Link>
    </li>
    <li data-test="accountpage-btn">
      <Link style={linkStyle} to={ROUTES.ACCOUNT}>
        Account
      </Link>
    </li>
    {/* <li data-test="adminpage-btn">
      <Link style={linkStyle} to={ROUTES.ADMIN}>
        Admin
      </Link>
    </li> */}
    <li>
      <SignOutButton />
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul className="links">
    <li data-test="landingpage-btn">
      <Link style={linkStyle} to={ROUTES.LANDING}>
        Main
      </Link>
    </li>
    <li data-test="signinpage-btn">
      <Link style={linkStyle} to={ROUTES.SIGN_IN}>
        Sign In
      </Link>
    </li>
  </ul>
);

const linkStyle = {
  // fontFamily: "Bookman bold",
  color: "rgba(253, 153, 153)",
  fontSize: "18px",
};

const navbarStyle = {
  background: "rgba(0, 0, 0)",
  padding: "2px",
  textAlign: "right",
  height: "100px",
  display: "flex",
  justifyContent: "space-between",
  verticalAlign: "bottom",
};

export default Navigation;
