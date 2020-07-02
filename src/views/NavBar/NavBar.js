import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { FaBell, FaPowerOff, FaUser } from "react-icons/fa";
import setAuthorizationToken from "../../controllers/setAuthorizationToken";
import { AuthContext } from "../../contexts/AuthContext";
import { RequestsContext } from "../../contexts/RequestsContext";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import ProfileEditModal from "../Profile/ProfileEditModal";
import PasswordChangeModal from "../Profile/Password/PasswordChangeModal";
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
  //eslint-disable-next-line
  const [profile, setProfile] = useState("");
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

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
  
  const hideProfileEditModal = () => {
    setShowProfileEditModal(false);
  }

  const profileEditModal = () => {
    return (
      <ProfileEditModal
       show={showProfileEditModal}
       onHide={hideProfileEditModal} 
       onClickOnChangePassword={displayPasswordChangeModal}
      /> 
    ) 
  }

  const hideAll = () => {
    setShowProfileEditModal(false);
    setShowPasswordChangeModal(false);
  }

  const displayPasswordChangeModal = () => {
    setShowProfileEditModal(false);
    setShowPasswordChangeModal(true);
  }

  const hidePasswordChangeModal = () => {
    setShowPasswordChangeModal(false);
    setShowProfileEditModal(true);
  }

  const passwordChangeModal = () => {
    return (
      <PasswordChangeModal
       show={showPasswordChangeModal}
       onHide={hideAll}
       onExit={hidePasswordChangeModal}
      />
    )
  }

  return (
    <>
      <Navbar
        bg={filled ? "white" : ""}
        className={filled ? "nav-scrolled" : ""}
        sticky="top"
        expand="lg"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#link">
              <FaBell />
            </Nav.Link>
            <div className="userOptions">
              <NavDropdown
                alignRight
                title={`${userInfoContext.name} ${userInfoContext.lastName}`}
                id="basic-nav-dropdown" >
                <NavDropdown.Item onClick={() => setShowProfileEditModal(true)}>
                  <FaUser /> Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>
                  <FaPowerOff /> Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {showProfileEditModal && profileEditModal()}
      {showPasswordChangeModal && passwordChangeModal()}
    </>
  );
};

export default NavBar;
