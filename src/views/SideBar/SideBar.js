import React from "react";
import { Link } from "react-router-dom";

const SideBar = props => {
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <Link to={`${props.url}/dashboard`} className="nav-link">
            Dashboard
          </Link>
          {props.profile === 1 && (
            <Link to={`${props.url}/usuarios`} className="nav-link">
              Usuarios
            </Link>
          )}
          <Link to={`${props.url}/solicitar`} className="nav-link">
            Solicitar
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
