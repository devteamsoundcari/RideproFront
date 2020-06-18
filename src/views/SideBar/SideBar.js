import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AiFillDollarCircle,
  AiFillCalendar,
  AiOutlineHistory,
  AiOutlinePlus,
} from "react-icons/ai";
import {
  GiFullMotorcycleHelmet,
  GiTireTracks,
  GiThreeFriends,
} from "react-icons/gi";
import { Badge } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { RequestsContext } from "../../contexts/RequestsContext";
import Greeting from "../Usuarios/Greeting/Greeting";
import defaultCompanyLogo from "../../assets/img/companydefault.png";
import defaultCompanyImg from "../../assets/img/defaultCompanyImg.png";
import { getUserRequests, fetchDriver } from "../../controllers/apiRequests";

import "./SideBar.scss";

const SideBar = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const {
    setRequestsInfoContext,
    setCanceledRequestContext,
    setLoadingContext,
  } = useContext(RequestsContext);
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

  // ========================= SETTING REQUESTS CONTEXT ON LOAD =======================================

  useEffect(() => {
    let urlType = userInfoContext.profile === 2 ? "user_requests" : "requests";
    async function fetchRequests(url) {
      const response = await getUserRequests(url);
      response.results.map(async (item) => {
        // ================= GETTING CANCELING DATE ====================
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        item.cancelDate = cancelDate;

        item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
        item.start = new Date(item.start_time);
        item.end = new Date(item.finish_time);

        // =========== GETTING INFO OF EACH DRIVER =================
        getDrivers(item.drivers).then((data) => {
          item.drivers = data;
          if (item.status.step === 0) {
            setCanceledRequestContext((prev) => [...prev, item]);
          } else {
            setRequestsInfoContext((prev) => [...prev, item]);
          }
        });
        setLoadingContext(false);

        return true;
      });
      if (response.next) {
        setLoadingContext(true);
        return await fetchRequests(response.next);
      }
    }
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/${urlType}/`);
    // eslint-disable-next-line
  }, []);

  const getDrivers = async (driversIds) => {
    return Promise.all(driversIds.map((id) => fetchDriver(id)));
  };

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
          <img
            alt="RideproLogo"
            src="https://www.ridepro.co/wp-content/uploads/2020/03/logo-ride-pro.png"
          />
          <small style={{ fontSize: "12px" }}>{profile}</small>
        </div>
        <ul className="nav flex-column">
          <li>
            <img
              alt="profileImg"
              className="shadow"
              src={
                userInfoContext.profile === 2
                  ? profilePicture
                  : defaultCompanyImg
              }
            />
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
            </div>
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
          {userInfoContext.profile !== 3 && (
            <React.Fragment>
              <li className="sidebar-nav-header">Destacado</li>

              <Link to={`${props.url}/solicitar`} className="nav-link">
                <GiFullMotorcycleHelmet className="mb-1 mr-2" />
                Solicitar{" "}
                <Badge pill variant="success">
                  Nuevo!
                </Badge>
              </Link>
              <hr />
            </React.Fragment>
          )}
          <li className="sidebar-nav-header">Menú</li>

          <Link
            to={`${props.url}/dashboard`}
            className="nav-link"
            activeClassName="active"
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
            activeClassName="active"
            // exact={true}
            className="nav-link"
          >
            <AiOutlineHistory className="mb-1 mr-2" />
            Historial
          </Link>

          <hr />
          <li className="sidebar-nav-header">Mis pistas</li>
          <Link to={`${props.url}/pistas`} className="nav-link">
            <GiTireTracks className="mb-1 mr-2" />
            Ver pistas{" "}
          </Link>
          <Link
            to={{ pathname: `${props.url}/pistas`, state: { show: true } }}
            className="nav-link"
          >
            <AiOutlinePlus className="mb-1 mr-2" />
            Añadir pista{" "}
          </Link>

          <hr />
          {userInfoContext.profile === 3 && (
            <React.Fragment>
              <li className="sidebar-nav-header">Instructores</li>
              <Link to={`${props.url}/pistas`} className="nav-link">
                <GiTireTracks className="mb-1 mr-2" />
                Ver instructores{" "}
              </Link>
              <Link
                to={{ pathname: `${props.url}/pistas`, state: { show: true } }}
                className="nav-link"
              >
                <AiOutlinePlus className="mb-1 mr-2" />
                Añadir instructor{" "}
              </Link>

              <hr />
              <li className="sidebar-nav-header">Proveedores</li>
              <Link to={`${props.url}/pistas`} className="nav-link">
                <GiTireTracks className="mb-1 mr-2" />
                Ver proveedores{" "}
              </Link>
              <Link
                to={{ pathname: `${props.url}/pistas`, state: { show: true } }}
                className="nav-link"
              >
                <AiOutlinePlus className="mb-1 mr-2" />
                Añadir proveedor{" "}
              </Link>

              <hr />
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
