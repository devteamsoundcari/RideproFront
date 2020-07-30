import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiFillDollarCircle,
  AiFillCalendar,
  AiOutlineHistory,
  // AiOutlinePlus,
} from "react-icons/ai";
import {
  // GiFullMotorcycleHelmet,
  GiTireTracks,
  GiThreeFriends,
} from "react-icons/gi";
import { FaPeopleCarry, FaUserGraduate } from "react-icons/fa";
import { Badge } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { RequestsContext } from "../../contexts/RequestsContext";
import Greeting from "../Usuarios/Greeting/Greeting";
import defaultCompanyLogo from "../../assets/img/companydefault.png";
import logo from "../../assets/img/logo.png";
import "./SideBar.scss";

const SideBar = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const { updateRequests } = useContext(RequestsContext);
  const [profile, setProfile] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    if (userInfoContext.company.logo !== "") {
      setProfilePicture(userInfoContext.company.logo);
    } else {
      setProfilePicture(defaultCompanyLogo);
    }

    switch (userInfoContext.profile) {
      case 1:
        setProfile("Admin");
        break;
      case 2:
        setProfile("Cliente");
        break;
      case 3:
        setProfile("Operaciones");
        break;
      case 7:
        setProfile("Super-Cliente");
        break;
      default:
        break;
    }
  }, [userInfoContext]);

  // ========================= SETTING REQUESTS CONTEXT ON LOAD =======================================

  useEffect(() => {
    updateRequests();
    // eslint-disable-next-line
  }, []);

  //========================================================================================================

  return (
    <nav
      className={`col-md-2 d-md-block bg-dark bg-${profile.toLowerCase()} sidebar pr-0 pl-0`}
    >
      <div className="sidebar-sticky">
        <div
          className="sidebar-brand"
          // onClick={() => history.push("/login")}
        >
          <img alt="RideproLogo" src={logo} />
          <small style={{ fontSize: "12px" }}>{profile}</small>
        </div>
        <ul className="nav flex-column">
          <li>
            <div
              className="company-logo"
              style={{
                background: `url(${profilePicture})`,
              }}
            ></div>
            {/* <img alt="profileImg" className="shadow" src={profilePicture} /> */}
          </li>
          <li>
            <div className="greeting">
              <Greeting
                name={userInfoContext.name}
                gender={userInfoContext.gender}
              />
              <br />
              <small>{userInfoContext.charge}</small>
              <br />
              <small>{userInfoContext.company.name}</small>
              {/* <Button className="nav-company" variant="link" size="sm"> */}
              {/* </Button> */}
            </div>
          </li>
          {profile === "Cliente" ? (
            <li>
              <Badge>
                <AiFillDollarCircle />
                <small>{userInfoContext.credit}</small>
              </Badge>
            </li>
          ) : (
            ""
          )}
        </ul>

        <hr />
        <ul className="nav flex-column align-items-start">
          {userInfoContext.profile === 2 && (
            <React.Fragment>
              {/* <li className="sidebar-nav-header">Destacado</li> */}

              <Link to={`${props.url}/solicitar`} className="nav-link">
                {/* <GiFullMotorcycleHelmet className="mb-1 mr-2" /> */}
                <Badge pill variant="success">
                  Solicitar servicio
                </Badge>
              </Link>
              <hr />
            </React.Fragment>
          )}
          {/* <li className="sidebar-nav-header">Menú</li> */}

          <Link
            to={`${props.url}/dashboard`}
            className="nav-link"
            // activeClassName="active"
            // exact={true}
          >
            <AiFillCalendar className="mb-1 mr-2" />
            Calendario
          </Link>
          {userInfoContext.profile === 1 && (
            <Link to={`${props.url}/usuarios`} className="nav-link">
              <GiThreeFriends className="mb-1 mr-2" />
              Usuarios
            </Link>
          )}
          <Link
            to={`${props.url}/historial`}
            // activeClassName="active"
            // exact={true}
            className="nav-link"
          >
            <AiOutlineHistory className="mb-1 mr-2" />
            Historial
          </Link>

          <hr />
          {/* <li className="sidebar-nav-header">Mis pistas</li> */}
          {userInfoContext.profile !== 7 && (
            <React.Fragment>
              <Link to={`${props.url}/pistas`} className="nav-link">
                <GiTireTracks className="mb-1 mr-2" />
                Ver pistas{" "}
              </Link>
              <hr />
            </React.Fragment>
          )}
          {userInfoContext.profile === 7 && (
            <React.Fragment>
              <Link to={`${props.url}/sucursales`} className="nav-link">
                <GiThreeFriends className="mb-1 mr-2" />
                Sucursales
              </Link>
              <hr />
            </React.Fragment>
          )}
          {/* <Link
            to={{ pathname: `${props.url}/pistas`, state: { show: true } }}
            className="nav-link"
          >
            <AiOutlinePlus className="mb-1 mr-2" />
            Añadir pista{" "}
          </Link> */}

          {userInfoContext.profile === 3 && (
            <React.Fragment>
              <li className="sidebar-nav-header">Instructores</li>
              <Link to={`${props.url}/instructores`} className="nav-link">
                <FaUserGraduate className="mb-1 mr-2" />
                Ver instructores{" "}
              </Link>
              {/* <Link
                to={{ pathname: `${props.url}/pistas`, state: { show: true } }}
                className="nav-link"
              >
                <FaUserPlus className="mb-1 mr-2" />
                Añadir instructor{" "}
              </Link> */}

              <hr />
              <li className="sidebar-nav-header">Proveedores</li>
              <Link to={`${props.url}/proveedores`} className="nav-link">
                <FaPeopleCarry className="mb-1 mr-2" />
                Ver proveedores{" "}
              </Link>
              {/* <Link
                to={{ pathname: `${props.url}/pistas`, state: { show: true } }}
                className="nav-link"
              >
                <AiOutlinePlus className="mb-1 mr-2" />
                Añadir proveedor{" "}
              </Link> */}

              <hr />
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
