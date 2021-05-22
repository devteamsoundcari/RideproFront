import React, { useState, useContext, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  FaPowerOff,
  FaUser,
  FaRegBuilding,
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
  ListGroup,
  Form,
  Spinner
} from 'react-bootstrap';
import ProfileEditModal from '../Profile/ProfileEditModal';
import PasswordChangeModal from '../Profile/Password/PasswordChangeModal';
import CompanyEditModal from '../Company/CompanyEditModal';
import { dateFormatter } from '../../utils/helpFunctions';
import ClientStatus from '../../utils/ClientStatus';
import { getFilteredDrivers } from '../../controllers/apiRequests';

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
  const { clear, isLoadingRequests } = useContext(RequestsContext);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchParams, setSearchParams] = useState(undefined);
  const [filterOption, setFilterOption] = useState('official_id');
  const [loading, setLoading] = useState(false);
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

  const fetchDrivers = async (url) => {
    setLoading(true);
    const response = await getFilteredDrivers(url);
    setFilteredRequests(response.results);
    setLoading(false);
    if (response.next) {
      return await fetchDrivers(response.next);
    }
  };

  const search = (value, param) => {
    const url = `https://app-db.ridepro.co/api/v1/drivers_entire_filter/?official_id=${
      param === 'official_id' ? value : '!'
    }&f_name=${param === 'f_name' ? value : '!'}&l_name=${
      param === 'l_name' ? value : '!'
    }&email=${param === 'email' ? value : '!'}`;
    fetchDrivers(url);
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
          {(userInfoContext.profile === 2 || userInfoContext.profile === 7) && (
            <InputGroup className="w-75 rounded" value={searchParams}>
              <FormControl
                disabled={isLoadingRequests || loading}
                className="border rounded"
                placeholder={
                  isLoadingRequests ? 'Cargando eventos...' : 'Buscar'
                }
                value={searchParams || ''}
                onChange={(e) => setSearchParams(e.target.value)}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  disabled={isLoadingRequests || loading}
                  onClick={() => {
                    if (searchParams !== null) {
                      search(searchParams, filterOption);
                    }
                  }}>
                  {isLoadingRequests || loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </InputGroup.Append>
              <InputGroup.Append className="ml-3">
                <Form.Check
                  inline
                  onChange={(x) => setFilterOption(x.target.value)}
                  as="input"
                  label="POR Cedula"
                  type="radio"
                  value="official_id"
                  id="search-official_id"
                  checked={filterOption === 'official_id'}
                />
                <Form.Check
                  as="input"
                  onChange={(x) => setFilterOption(x.target.value)}
                  inline
                  label="POR Nombre"
                  type="radio"
                  value="f_name"
                  id="search-f_name"
                  checked={filterOption === 'f_name'}
                />
                <Form.Check
                  as="input"
                  onChange={(x) => setFilterOption(x.target.value)}
                  inline
                  label="POR Apellido"
                  type="radio"
                  value="l_name"
                  checked={filterOption === 'l_name'}
                  id="search-l_name"
                />
                <Form.Check
                  as="input"
                  onChange={(x) => setFilterOption(x.target.value)}
                  inline
                  label="POR EMAIL"
                  type="radio"
                  value="email"
                  checked={filterOption === 'email'}
                  id="search-email"
                />
              </InputGroup.Append>
            </InputGroup>
          )}

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
      {(userInfoContext.profile === 2 || userInfoContext.profile === 7) &&
        filteredRequests.length > 0 && (
          <div className="w-50 ml-3 search-results shadow">
            <ListGroup ref={wrapperRef}>
              {filteredRequests.map(({ request }, idx) => (
                <ListGroup.Item
                  as="li"
                  className="border"
                  key={request.id + idx}
                  onClick={() => {
                    let newRoute = url.split('/');
                    newRoute[newRoute.length] = 'historial';
                    newRoute = newRoute.join('/');
                    setFilteredRequests([]);

                    history.push({
                      pathname: url.includes('historial')
                        ? `/${request.id}`
                        : `${newRoute}/${request.id}`,
                      state: { event: request }
                    });
                  }}>
                  <span>{dateFormatter(request.start_time)}</span>
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
                    <OperacionesStatus
                      step={request.status.step}
                      width="8rem"
                    />
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
