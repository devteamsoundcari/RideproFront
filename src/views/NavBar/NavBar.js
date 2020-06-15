import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  FaBell,
  // FaSearch,
  FaPowerOff,
  // FaQuestionCircle,
  // FaRoute,
} from "react-icons/fa";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import { AuthContext } from "../../contexts/AuthContext";
import { RequestsContext } from "../../contexts/RequestsContext";

import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./NavBar.scss";

const NavBar = () => {
  const history = useHistory();
  const [filled, setFilled] = useState(false);
  const {
    userInfoContext,
    setUserInfoContext,
    setIsLoggedInContext,
  } = useContext(AuthContext);
  const { setRequestsInfoContext, setCanceledRequestContext } = useContext(
    RequestsContext
  );
  const [profile, setProfile] = useState("");

  const logout = () => {
    console.log("Bye bye");
    setAuthorizationToken();
    setIsLoggedInContext(false);
    setUserInfoContext({});
    setRequestsInfoContext([]);
    setCanceledRequestContext([]);
    history.push({
      pathname: "/login",
    });
  };

  useEffect(() => {
    switch (userInfoContext.profile) {
      case 1:
        setProfile("Admin");
        break;
      case 2:
        setProfile("Cliente");
        break;
      case 3:
        setProfile("Operario");
        break;
      default:
        break;
    }
    // eslint-disable-next-line
  }, [userInfoContext]);

  useState(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY < 30) {
        setFilled(false);
      } else {
        setFilled(true);
      }
    });
  });

  return (
    <Navbar
      bg={filled ? "white" : ""}
      className={filled ? "nav-scrolled" : ""}
      sticky="top"
      expand="lg"
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* <Nav className="mr-auto">
          <Nav.Link href="#home">
            <FaQuestionCircle /> Ayuda
          </Nav.Link>
          <Nav.Link href="#link">
            <FaRoute />
          </Nav.Link>
        </Nav> */}
        <Nav className="ml-auto">
          {/* <Nav.Link href="#home">
            <FaSearch />
          </Nav.Link> */}
          <Nav.Link href="#link">
            <FaBell />
          </Nav.Link>
          <div className="userOptions">
            <NavDropdown
              alignRight
              title={`${userInfoContext.name} ${userInfoContext.lastName}`}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item onClick={logout}>
                <FaPowerOff /> Cerrar sesión
              </NavDropdown.Item>
            </NavDropdown>
            {/* <Image
              src={userInfoContext.company.logo}
              roundedCircle
              className="shadow-sm"
            /> */}
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
