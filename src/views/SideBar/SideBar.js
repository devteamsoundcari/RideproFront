import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiFillDollarCircle,
  AiFillCalendar,
  AiOutlineHistory,
} from "react-icons/ai";
import {
  GiFullMotorcycleHelmet,
  GiTireTracks,
  GiThreeFriends,
} from "react-icons/gi";
import { Badge } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import Greeting from "../Usuarios/Greeting/Greeting";
import defaultCompanyLogo from "../../assets/img/companydefault.png";
import "./SideBar.scss";

const SideBar = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [profile, setProfile] = useState("");
  const profilePicture = userInfoContext.company.logo
    ? userInfoContext.company.logo
    : defaultCompanyLogo;

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

  return (
    <nav
      className={`col-md-2 d-none d-md-block bg-dark bg-${profile.toLowerCase()} sidebar`}
    >
      <div className="sidebar-sticky">
        <div
          className="sidebar-brand"
          style={{ cursor: "pointer" }}
          // onClick={() => history.push("/login")}
        >
          <img
            alt="RideproLogo"
            src="https://www.ridepro.co/wp-content/uploads/2020/03/logo-ride-pro.png"
          />
          <small style={{ fontSize: "12px" }}>{profile}</small>
        </div>
        <ul className="nav flex-column">
          <li>
            <img alt="profileImg" className="shadow" src={profilePicture} />
          </li>
          <Greeting
            name={userInfoContext.name}
            gender={userInfoContext.gender}
          />
          <li>
            <small>{userInfoContext.charge}</small>
          </li>
          <li>
            <small>{userInfoContext.company.name}</small>
          </li>
          {profile === "Cliente" ? (
            <li>
              <Badge>
                <AiFillDollarCircle />
                <small>{userInfoContext.company.credit}</small>
              </Badge>
            </li>
          ) : (
            ""
          )}
        </ul>
        <hr />
        <ul className="nav flex-column align-items-start">
          <Link to={`${props.url}/dashboard`} className="nav-link">
            <AiFillCalendar className="mb-1 mr-2" />
            Calendario
          </Link>
          {userInfoContext.profile === 1 && (
            <Link to={`${props.url}/usuarios`} className="nav-link">
              <GiThreeFriends className="mb-1 mr-2" />
              Usuarios
            </Link>
          )}
          <Link to={`${props.url}/historial`} className="nav-link">
            <AiOutlineHistory className="mb-1 mr-2" />
            Historial
          </Link>
          {userInfoContext.profile !== 3 && (
            <Link to={`${props.url}/solicitar`} className="nav-link">
              <GiFullMotorcycleHelmet className="mb-1 mr-2" />
              Solicitar{" "}
              <Badge pill variant="success">
                Nuevo!
              </Badge>
            </Link>
          )}

          <Link to={`${props.url}/pistas`} className="nav-link">
            <GiTireTracks className="mb-1 mr-2" />
            Mis Pistas{" "}
          </Link>

          {/* <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="shopping-cart"></span>
              Products
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="users"></span>
              Customers
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="bar-chart-2"></span>
              Reports
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="layers"></span>
              Integrations
            </a>
          </li> */}
        </ul>
        <hr />

        {/* <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>Saved reports</span>
          <a className="d-flex align-items-center text-muted" href="#123">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul className="nav flex-column mb-2">
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="file-text"></span>
              Current month
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="file-text"></span>
              Last quarter
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="file-text"></span>
              Social engagement
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#123">
              <span data-feather="file-text"></span>
              Year-end sale
            </a>
          </li>
        </ul> */}
      </div>
    </nav>
  );
};

export default SideBar;
