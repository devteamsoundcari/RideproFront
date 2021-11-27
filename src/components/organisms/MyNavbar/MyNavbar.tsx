import React, { useState, useContext } from 'react';
import { SearchFiltersContextProvider } from '../../../contexts';
import { FaPowerOff, FaUser, FaRegBuilding } from 'react-icons/fa';
import {
  getProfile,
  PERFIL_CLIENTE,
  PERFIL_SUPERCLIENTE
} from '../../../utils';
import { AuthContext, RequestsContext } from '../../../contexts';
import { Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import {
  ModalEditProfile,
  ModalChangePassword,
  ModalEditCompany
} from '../../molecules';
import { FiltersInput } from '../FiltersInput/FiltersInput';
import { SearchResults } from '../SearchResults/SearchResults';
import './MyNavbar.scss';

export const MyNavbar = () => {
  const [filled, setFilled] = useState(false);
  const { userInfo, logOutUser, loadingAuth } = useContext(AuthContext);
  const { isLoadingRequests } = useContext(RequestsContext);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [showCompanyEditModal, setShowCompanyEditModal] = useState(false);

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

  const shouldRenderFilters =
    userInfo.profile === PERFIL_CLIENTE.profile ||
    userInfo.profile === PERFIL_SUPERCLIENTE.profile;

  return (
    <>
      <SearchFiltersContextProvider>
        <Navbar
          bg={filled ? getProfile(userInfo.profile) : ''}
          className={filled ? 'nav-scrolled' : ''}
          sticky="top"
          expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {shouldRenderFilters && <FiltersInput />}
            <Nav className="ml-auto">
              <div className="userOptions">
                <NavDropdown
                  alignRight
                  title={`${userInfo.first_name} ${userInfo.last_name}`}
                  id="basic-nav-dropdown">
                  <NavDropdown.Item
                    onClick={() => setShowProfileEditModal(true)}>
                    <FaUser /> Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setShowCompanyEditModal(true)}>
                    <FaRegBuilding /> Compañia
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logOut}>
                    <FaPowerOff /> Cerrar sesión
                  </NavDropdown.Item>
                </NavDropdown>
                <Image
                  src={userInfo.picture}
                  roundedCircle
                  className={`shadow-sm border border-${getProfile(
                    userInfo.profile
                  )}`}
                />
              </div>
            </Nav>
          </Navbar.Collapse>
          {loadingAuth ||
            (isLoadingRequests && (
              <div className="loader">
                <div
                  className={`loaderBar bg-${getProfile(userInfo.profile)}`}
                />
              </div>
            ))}
        </Navbar>

        {shouldRenderFilters && <SearchResults />}
      </SearchFiltersContextProvider>
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
