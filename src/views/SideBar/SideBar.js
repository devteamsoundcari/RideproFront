import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiFillDollarCircle,
  AiFillCalendar,
  AiOutlineHistory
} from 'react-icons/ai';
import { GiTireTracks, GiThreeFriends } from 'react-icons/gi';
import {
  FaPeopleCarry,
  FaUserGraduate,
  FaRegBuilding,
  FaUserShield,
  FaPaperclip,
  FaDollarSign
} from 'react-icons/fa';
import { Badge, Button } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import Greeting from '../../utils/Greeting/Greeting';
import defaultCompanyLogo from '../../assets/img/companydefault.png';
import ModalContact from '../ModalContact/ModalContact';
import logo from '../../assets/img/logo.png';
import './SideBar.scss';

const SideBar = (props) => {
  const location = useLocation();
  const { userInfoContext } = useContext(AuthContext);
  const [profile, setProfile] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    console.log({ location });
  }, [location]);

  useEffect(() => {
    if (userInfoContext.company.logo !== '') {
      setProfilePicture(userInfoContext.company.logo);
    } else {
      setProfilePicture(defaultCompanyLogo);
    }

    switch (userInfoContext.profile) {
      case 1:
        setProfile('Admin');
        break;
      case 2:
        setProfile('Cliente');
        break;
      case 3:
        setProfile('Operaciones');
        break;
      case 5:
        setProfile('Tecnico');
        break;
      case 7:
        setProfile('Super-Cliente');
        break;
      default:
        break;
    }
  }, [userInfoContext]);

  //========================================================================================================

  return (
    <nav
      className={`col-md-2 d-md-block bg-dark bg-${profile.toLowerCase()} sidebar pr-0 pl-0`}>
      <div className="sidebar-sticky">
        <div className="sidebar-brand">
          <img alt="RideproLogo" src={logo} />
          <small style={{ fontSize: '12px' }}>{profile}</small>
        </div>
        <ul className="nav flex-column">
          <li>
            <div
              className="company-logo"
              style={{
                background: `url(${profilePicture})`
              }}></div>
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
          {profile === 'Cliente' ? (
            <React.Fragment>
              <li>
                <Badge>
                  <AiFillDollarCircle />
                  <small>{userInfoContext.credit}</small>
                </Badge>
              </li>
              <Button
                variant="link"
                className="text-white pt-0"
                onClick={() => setShowContactModal(true)}>
                <small>¿Sin créditos?</small>
              </Button>
              {showContactModal && (
                <ModalContact handleClose={() => setShowContactModal(false)} />
              )}
            </React.Fragment>
          ) : (
            ''
          )}
        </ul>

        <hr />
        <ul className="nav flex-column align-items-start">
          {userInfoContext.profile === 2 && (
            <React.Fragment>
              <Link to={`${props.url}/solicitar`} className="nav-link">
                <Badge pill variant="success">
                  Solicitar servicio
                </Badge>
              </Link>
              <hr />
            </React.Fragment>
          )}
          <Link
            to={`${props.url}/dashboard`}
            className={`nav-link ${
              location.pathname.includes('dashboard') ? 'active' : ''
            }`}>
            <AiFillCalendar className="mb-1 mr-2" />
            Calendario
          </Link>
          <Link
            to={`${props.url}/historial`}
            className={`nav-link ${
              location.pathname.includes('historial') ? 'active' : ''
            }`}>
            <AiOutlineHistory className="mb-1 mr-2" />
            Historial
          </Link>

          <hr />
          {userInfoContext.profile === 1 && (
            <React.Fragment>
              <li className="sidebar-nav-header">Administrar</li>
              <Link
                to={`${props.url}/usuarios`}
                className={`nav-link ${
                  location.pathname.includes('usuarios') ? 'active' : ''
                }`}>
                <GiThreeFriends className="mb-1 mr-2" />
                Usuarios
              </Link>
              <Link
                to={`${props.url}/empresas`}
                className={`nav-link ${
                  location.pathname.includes('empresas') ? 'active' : ''
                }`}>
                <FaRegBuilding className="mb-1 mr-2" />
                Empresas
              </Link>
              <Link
                to={`${props.url}/superclientes`}
                className={`nav-link ${
                  location.pathname.includes('superclientes') ? 'active' : ''
                }`}>
                <FaUserShield className="mb-1 mr-2" />
                SuperClientes
              </Link>
              <Link
                to={`${props.url}/documentos`}
                className={`nav-link ${
                  location.pathname.includes('documentos') ? 'active' : ''
                }`}>
                <FaPaperclip className="mb-1 mr-2" />
                Documentos
              </Link>
              <Link
                to={`${props.url}/creditos`}
                className={`nav-link ${
                  location.pathname.includes('creditos') ? 'active' : ''
                }`}>
                <FaDollarSign className="mb-1 mr-2" />
                Créditos
              </Link>
            </React.Fragment>
          )}
          {userInfoContext.profile !== 5 && userInfoContext.profile !== 7 ? (
            <React.Fragment>
              <Link
                to={`${props.url}/pistas`}
                className={`nav-link ${
                  location.pathname.includes('pistas') ? 'active' : ''
                }`}>
                <GiTireTracks className="mb-1 mr-2" />
                {userInfoContext.profile === 1 ? 'Pistas' : 'Ver pistas'}
              </Link>
              <hr />
            </React.Fragment>
          ) : (
            ''
          )}
          {userInfoContext.profile === 7 && (
            <React.Fragment>
              <Link
                to={`${props.url}/sucursales`}
                className={`nav-link ${
                  location.pathname.includes('sucursales') ? 'active' : ''
                }`}>
                <GiThreeFriends className="mb-1 mr-2" />
                Sucursales
              </Link>
              <hr />
            </React.Fragment>
          )}
          {userInfoContext.profile === 3 && (
            <React.Fragment>
              <Link
                to={`${props.url}/instructores`}
                className={`nav-link ${
                  location.pathname.includes('instructores') ? 'active' : ''
                }`}>
                <FaUserGraduate className="mb-1 mr-2" />
                Instructores{' '}
              </Link>
              <hr />
              <Link
                to={`${props.url}/proveedores`}
                className={`nav-link ${
                  location.pathname.includes('proveedores') ? 'active' : ''
                }`}>
                <FaPeopleCarry className="mb-1 mr-2" />
                Proveedores{' '}
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
