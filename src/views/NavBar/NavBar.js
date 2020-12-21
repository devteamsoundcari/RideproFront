import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  FaPowerOff,
  FaUser,
  FaRegBuilding,
  FaSearch,
  FaUserFriends
} from 'react-icons/fa';
import setAuthorizationToken from '../../controllers/setAuthorizationToken';
import { AuthContext } from '../../contexts/AuthContext';
import { RequestsContext } from '../../contexts/RequestsContext';
import {
  Nav,
  Navbar,
  NavDropdown,
  Image,
  InputGroup,
  FormControl,
  Button,
  ListGroup
} from 'react-bootstrap';
import ProfileEditModal from '../Profile/ProfileEditModal';
import PasswordChangeModal from '../Profile/Password/PasswordChangeModal';
import CompanyEditModal from '../Company/CompanyEditModal';
import { dateFormatter } from '../../utils/helpFunctions';
import ClientStatus from '../../utils/ClientStatus';

import './NavBar.scss';
import OperacionesStatus from '../../utils/OperacionesStatus';

const NavBar = () => {
  const history = useHistory();
  const [filled, setFilled] = useState(false);
  const {
    userInfoContext,
    setUserInfoContext,
    setIsLoggedInContext
  } = useContext(AuthContext);
  const { clear, requests, isLoadingRequests } = useContext(RequestsContext);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  let { url } = useRouteMatch();
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSearchParams(null);
        setFilteredRequests([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (searchParams) search(searchParams);
    else setFilteredRequests([]);
    // eslint-disable-next-line
  }, [searchParams]);

  const logout = () => {
    console.log('Bye bye');
    setAuthorizationToken();
    setIsLoggedInContext(false);
    setUserInfoContext({});
    clear();
    history.push({
      pathname: '/login'
    });
  };

  useState(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 30) {
        setFilled(false);
      } else {
        setFilled(true);
      }
    });
  });

  const hideProfileEditModal = () => {
    setShowProfileEditModal(false);
  };

  const profileEditModal = () => {
    return (
      <ProfileEditModal
        show={showProfileEditModal}
        onHide={hideProfileEditModal}
        onClickOnChangePassword={displayPasswordChangeModal}
      />
    );
  };

  const hideAll = () => {
    setShowProfileEditModal(false);
    setShowPasswordChangeModal(false);
  };

  const displayPasswordChangeModal = () => {
    setShowProfileEditModal(false);
    setShowPasswordChangeModal(true);
  };

  const hidePasswordChangeModal = () => {
    setShowPasswordChangeModal(false);
    setShowProfileEditModal(true);
  };

  const passwordChangeModal = () => {
    return (
      <PasswordChangeModal
        show={showPasswordChangeModal}
        onHide={hideAll}
        onExit={hidePasswordChangeModal}
      />
    );
  };

  const search = (value) => {
    const filteredId = requests.filter((o) => String(o.id).includes(value));
    const filteredDate = requests.filter((o) =>
      String(dateFormatter(o.start)).includes(value)
    );
    const filteredTrack = requests.filter((o) => {
      if (o.track) {
        return Object.keys(o.track).some((k) =>
          String(o.track[k]).toLowerCase().includes(value.toLowerCase())
        );
      } else {
        return o;
      }
    });
    const filtered = filteredId.concat(filteredTrack, filteredDate);
    setFilteredRequests([...new Set(filtered)]);
  };

  return (
    <>
      <Navbar
        bg={filled ? 'white' : ''}
        className={filled ? 'nav-scrolled' : ''}
        sticky="top"
        expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <InputGroup className="w-50  rounded" value={searchParams}>
            <FormControl
              disabled={isLoadingRequests}
              className="border rounded"
              placeholder={isLoadingRequests ? 'Cargando eventos...' : 'Buscar'}
              onChange={(e) => setSearchParams(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary">
                {isLoadingRequests ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <FaSearch />
                )}
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <Nav className="ml-auto">
            <div className="userOptions">
              <NavDropdown
                alignRight
                title={`${userInfoContext.name} ${userInfoContext.lastName}`}
                id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setShowProfileEditModal(true)}>
                  <FaUser /> Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setShowCompanyEditModal(true)}>
                  <FaRegBuilding /> Compañia
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>
                  <FaPowerOff /> Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
              <Image
                src={userInfoContext.picture}
                roundedCircle
                className={`shadow-sm border border-${userInfoContext.perfil}`}
              />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {filteredRequests.length > 0 && (
        <div className="w-50 ml-3 search-results shadow">
          <ListGroup ref={wrapperRef}>
            {filteredRequests.map((request) => (
              <ListGroup.Item
                as="li"
                className="border"
                key={request.id}
                onClick={() => {
                  let newRoute = url.split('/');
                  newRoute[newRoute.length] = 'historial';
                  newRoute = newRoute.join('/');
                  setFilteredRequests([]);
                  history.push({
                    pathname: url.includes('historial')
                      ? `/${request.id}`
                      : newRoute,
                    state: { event: request }
                  });
                }}>
                <span>{dateFormatter(request.start)}</span>
                <span className="font-weight-bold">#{request.id}</span>
                {request.track && (
                  <span className="text-capitalize">
                    {request.track.municipality.name.toLowerCase()},{' '}
                    {request.track.municipality.department.name}
                  </span>
                )}
                <span className="font-weight-bold">
                  {request.drivers.length} <FaUserFriends />
                </span>
                {userInfoContext.profile === 2 ? (
                  <ClientStatus step={request.status.step} width="8rem" />
                ) : (
                  <OperacionesStatus step={request.status.step} width="8rem" />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      {showProfileEditModal && profileEditModal()}
      {showPasswordChangeModal && passwordChangeModal()}
      {showCompanyEditModal && (
        <CompanyEditModal
          show={true}
          onHide={() => setShowCompanyEditModal(false)}
        />
      )}
    </>
  );
};

export default NavBar;
