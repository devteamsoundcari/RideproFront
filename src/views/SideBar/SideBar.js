import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Badge } from "react-bootstrap";
import "./SideBar.scss";

const SideBar = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li>
            <img alt="profileImg" src={userInfoContext.picture} />
          </li>
          <small>
            <strong>Bienvenid@ {userInfoContext.name}</strong>
          </small>
          <li>
            <small>{userInfoContext.company.name}</small>
          </li>
          <li>
            {" "}
            <Badge variant="warning">
              Rides: {userInfoContext.company.credit}
            </Badge>
          </li>
          <hr />
          <Link to={`${props.url}/dashboard`} className="nav-link">
            Dashboard
          </Link>
          {userInfoContext.profile === 1 && (
            <Link to={`${props.url}/usuarios`} className="nav-link">
              Usuarios
            </Link>
          )}
          <Link to="/historial" className="nav-link">
            Historial
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
