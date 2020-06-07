import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  FaBell,
  FaSearch,
  FaPowerOff,
  FaQuestionCircle,
  FaRoute,
} from "react-icons/fa";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import { AuthContext } from "../../contexts/AuthContext";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import "./NavBar.scss";

const NavBar = (props) => {
  const history = useHistory();
  const [filled, setFilled] = useState(false);
  const {
    userInfoContext,
    setUserInfoContext,
    setIsLoggedInContext,
  } = useContext(AuthContext);
  const [profile, setProfile] = useState("");

  const logout = () => {
    console.log("Bye bye");
    setAuthorizationToken();
    setIsLoggedInContext(false);
    setUserInfoContext({});
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
  }, [userInfoContext]);

  useState(() => {
    window.addEventListener("scroll", () => {
      // let activeClass = 'normal';
      if (window.scrollY < 100) {
        // activeClass = 'top';
        setFilled(false);
        console.log("NORMAL");
      } else {
        console.log("CAMBIAR");
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
        <Nav className="mr-auto">
          <Nav.Link href="#home">
            <FaQuestionCircle /> Ayuda
          </Nav.Link>
          <Nav.Link href="#link">
            <FaRoute />
          </Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          <Nav.Link href="#home">
            <FaSearch />
          </Nav.Link>
          <Nav.Link href="#link">
            <FaBell />
          </Nav.Link>
          <NavDropdown
            alignRight
            title={userInfoContext.name}
            id="basic-nav-dropdown"
          >
            {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item> */}
            {/* <NavDropdown.Divider /> */}
            <NavDropdown.Item onClick={logout}>
              <FaPowerOff /> Cerrar sesión
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
