import React, { useState, useContext, useEffect, useRef } from 'react';
// import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  FaPowerOff,
  FaUser,
  FaRegBuilding,
  FaUserFriends
} from 'react-icons/fa';
import { PERFIL_CLIENTE, PERFIL_SUPERCLIENTE } from '../../../utils/constants';
import setAuthorizationToken from '../../../controllers/setAuthorizationToken';
import { AuthContext, RequestsContext } from '../../../contexts';
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
import {
  ModalEditProfile,
  ModalChangePassword,
  ModalEditCompany
} from '../../molecules';
// import ProfileEditModal from '../Profile/ProfileEditModal';
// import PasswordChangeModal from '../Profile/Password/PasswordChangeModal';
// import CompanyEditModal from '../Company/CompanyEditModal';
// import { dateFormatter } from '../../utils/helpFunctions';
// import ClientStatus from '../../utils/ClientStatus';
// import { getFilteredDrivers } from '../../controllers/apiRequests';
import './MyNavbar.scss';

// import OperacionesStatus from '../../utils/OperacionesStatus';
import { FiltersInput } from '../FiltersInput/FiltersInput';

export const MyNavbar = () => {
  // const history = useHistory();
  const [filled, setFilled] = useState(false);
  const { userInfo, setUserInfoContext, setIsLoggedInContext, logOutUser } =
    useContext(AuthContext);
  // const { clear, isLoadingRequests } = useContext(RequestsContext);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchParams, setSearchParams] = useState(null);
  const [filterBy, setFilterBy] = useState('official_id');
  const [loading, setLoading] = useState(false);
  // let { url } = useRouteMatch();
  const wrapperRef = useRef(null);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
  //       setSearchParams(null);
  //       setFilteredRequests([]);
  //     }
  //   }
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [wrapperRef]);

  const logOut = () => logOutUser();

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

  // const profileEditModal = () => {
  //   return (
  //     <ProfileEditModal
  //       show={showProfileEditModal}
  //       onHide={hideProfileEditModal}
  //       onClickOnChangePassword={displayPasswordChangeModal}
  //     />
  //   );
  // };

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

  // const passwordChangeModal = () => {
  //   return (
  //     <PasswordChangeModal
  //       show={showPasswordChangeModal}
  //       onHide={hideAll}
  //       onExit={hidePasswordChangeModal}
  //     />
  //   );
  // };

  // const fetchDrivers = async (url) => {
  //   setLoading(true);
  //   const response = await getFilteredDrivers(url);
  //   setFilteredRequests(response.results);
  //   setLoading(false);
  //   if (response.next) {
  //     return await fetchDrivers(response.next);
  //   }
  // };

  // const search = (value, param) => {
  //   const url = `https://app-db.ridepro.co/api/v1/drivers_entire_filter/?official_id=${
  //     param === 'official_id' ? value : '!'
  //   }&f_name=${param === 'f_name' ? value : '!'}&l_name=${
  //     param === 'l_name' ? value : '!'
  //   }&email=${param === 'email' ? value : '!'}`;
  //   fetchDrivers(url);
  // };

  const shouldRenderFilters = () => {
    if (
      userInfo.profile === PERFIL_CLIENTE ||
      userInfo.profile === PERFIL_SUPERCLIENTE
    ) {
      return <FiltersInput selectedFilter={(opt) => setFilterBy(opt)} />;
    }
    return '';
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
          {shouldRenderFilters()}
          <Nav className="ml-auto">
            <div className="userOptions">
              <NavDropdown
                alignRight
                title={`${userInfo.first_name} ${userInfo.last_name}`}
                id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setShowProfileEditModal(true)}>
                  <FaUser /> Perfil
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setShowCompanyEditModal(true)}>
                  <FaRegBuilding /> Compañia
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logOut}>
                  <FaPowerOff /> Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
              <Image
                src={userInfo.picture}
                roundedCircle
                className={`shadow-sm border border-${userInfo.profile}`}
              />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {/* {(userInfo.profile === 2 || userInfo.profile === 7) &&
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
                  {userInfo.profile === 2 ? (
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
        )} */}
      {showProfileEditModal && (
        <ModalEditProfile
          show
          onHide={hideProfileEditModal}
          onClickOnChangePassword={displayPasswordChangeModal}
        />
      )}
      {showPasswordChangeModal && (
        <ModalChangePassword
          show
          onHide={hideAll}
          onExit={hidePasswordChangeModal}
        />
      )}
      {showCompanyEditModal && (
        <ModalEditCompany show onHide={() => setShowCompanyEditModal(false)} />
      )}
    </>
  );
};
