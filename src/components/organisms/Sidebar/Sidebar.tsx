import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { AuthContext } from '../../../contexts/AuthContext';
// import { RequestsContext } from '../../contexts/RequestsContext';
import { Greeting } from '../../atoms';
// import defaultCompanyLogo from '../../assets/img/companydefault.png';
import ModalContact from '../../molecules/ModalContact/ModalContact';
// import logo from '../../assets/img/logo.png';
import './Sidebar.scss';

export const Sidebar = (props) => {
  const { userInfo, loadingAuth } = useContext(AuthContext);
  //   const { updateRequests } = useContext(RequestsContext);
  const [profile, setProfile] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (userInfo?.company?.logo !== '') {
      setProfilePicture(userInfo?.company?.logo);
    } else {
      setProfilePicture('defaultCompanyLogo.png');
    }

    switch (userInfo?.profile) {
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
  }, [userInfo]);

  // ========================= SETTING REQUESTS CONTEXT ON LOAD =======================================

  //   useEffect(() => {
  //     updateRequests();
  //     // eslint-disable-next-line
  //   }, []);

  //========================================================================================================

  return (
    <nav
      className={`col-md-2 d-md-block bg-dark bg-${profile.toLowerCase()} sidebar pr-0 pl-0`}>
      <div className="sidebar-sticky">
        <div className="sidebar-brand">
          <img alt="RideproLogo" src="logo.png" />
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
              <Greeting name={userInfo?.first_name} gender={userInfo?.gender} />
              <br />
              <small>{userInfo?.charge}</small>
              <br />
              <small>{userInfo?.company?.name}</small>
            </div>
          </li>
          {profile === 'Cliente' ? (
            <React.Fragment>
              <li>
                <Badge>
                  <AiFillDollarCircle />
                  <small>{userInfo.credit}</small>
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
          {userInfo.profile === 2 && (
            <React.Fragment>
              <Link to={`${props.url}/solicitar`} className="nav-link">
                <Badge pill variant="success">
                  Solicitar servicio
                </Badge>
              </Link>
              <hr />
            </React.Fragment>
          )}
          <Link to={`${props.url}/dashboard`} className="nav-link">
            <AiFillCalendar className="mb-1 mr-2" />
            Calendario
          </Link>
          <Link to={`${props.url}/historial`} className="nav-link">
            <AiOutlineHistory className="mb-1 mr-2" />
            Historial
          </Link>
          <hr />
          {userInfo.profile === 1 && (
            <React.Fragment>
              <li className="sidebar-nav-header">Administrar</li>
              <Link to={`${props.url}/usuarios`} className="nav-link">
                <GiThreeFriends className="mb-1 mr-2" />
                Usuarios
              </Link>
              <Link to={`${props.url}/empresas`} className="nav-link">
                <FaRegBuilding className="mb-1 mr-2" />
                Empresas
              </Link>
              <Link to={`${props.url}/superclientes`} className="nav-link">
                <FaUserShield className="mb-1 mr-2" />
                SuperClientes
              </Link>
              <Link to={`${props.url}/documentos`} className="nav-link">
                <FaPaperclip className="mb-1 mr-2" />
                Documentos
              </Link>
              <Link to={`${props.url}/creditos`} className="nav-link">
                <FaDollarSign className="mb-1 mr-2" />
                Créditos
              </Link>
            </React.Fragment>
          )}
          {userInfo.profile !== 5 && userInfo.profile !== 7 ? (
            <React.Fragment>
              <Link to={`${props.url}/pistas`} className="nav-link">
                <GiTireTracks className="mb-1 mr-2" />
                {userInfo.profile === 1 ? 'Pistas' : 'Ver pistas'}
              </Link>
              <hr />
            </React.Fragment>
          ) : (
            ''
          )}
          {userInfo.profile === 7 && (
            <React.Fragment>
              <Link to={`${props.url}/sucursales`} className="nav-link">
                <GiThreeFriends className="mb-1 mr-2" />
                Sucursales
              </Link>
              <hr />
            </React.Fragment>
          )}
          {userInfo.profile === 3 && (
            <React.Fragment>
              <Link to={`${props.url}/instructores`} className="nav-link">
                <FaUserGraduate className="mb-1 mr-2" />
                Instructores{' '}
              </Link>
              <hr />
              <Link to={`${props.url}/proveedores`} className="nav-link">
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
