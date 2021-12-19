import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiFillDollarCircle, AiFillCalendar, AiOutlineHistory } from 'react-icons/ai';
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
import { AuthContext } from '../../../contexts';
import { Greeting } from '../../atoms';
import { ModalContact } from '../../molecules';
import { routes } from '../../../routes';
import { PERFIL_CLIENTE, useProfile } from '../../../utils';
import defaultCompanyImg from '../../../assets/img/defaultCompanyImg.png';
import logo from '../../../assets/img/logo.png';
import './Sidebar.scss';

export const Sidebar = () => {
  const { pathname } = useLocation();
  const { userInfo } = useContext(AuthContext);
  const [profile] = useProfile();
  const [profilePicture, setProfilePicture] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (userInfo?.company?.logo !== '') {
      setProfilePicture(userInfo?.company?.logo);
    } else {
      setProfilePicture(defaultCompanyImg);
    }
  }, [userInfo]);

  const Icon = (props) => {
    const { name } = props;
    switch (name) {
      case 'AiFillCalendar':
        return <AiFillCalendar {...props} />;
      case 'FaPeopleCarry':
        return <FaPeopleCarry {...props} />;
      case 'FaUserGraduate':
        return <FaUserGraduate {...props} />;
      case 'FaRegBuilding':
        return <FaRegBuilding {...props} />;
      case 'FaUserShield':
        return <FaUserShield {...props} />;
      case 'FaPaperclip':
        return <FaPaperclip {...props} />;
      case 'FaDollarSign':
        return <FaDollarSign {...props} />;
      case 'AiOutlineHistory':
        return <AiOutlineHistory {...props} />;
      case 'GiTireTracks':
        return <GiTireTracks {...props} />;
      case 'GiThreeFriends':
        return <GiThreeFriends {...props} />;
      default:
        return <AiFillCalendar {...props} />;
    }
  };

  const isLinkActive = (url: string) => {
    if (pathname === '/historial' && url === '/') return true;
    return pathname === url;
  };

  const profilesContainsCurrentProfile = (arr: any[]) => {
    return arr.find(({ profile }: any) => profile === userInfo.profile);
  };

  return (
    <nav className={`col-md-2 d-md-block bg-dark bg-${profile || 'primary'} sidebar pr-0 pl-0`}>
      <div className="sidebar-sticky">
        <div className="sidebar-brand">
          <Badge variant="warning" id="version-badge">
            BETA
          </Badge>
          <img alt="RideproLogo" src={logo} className="mb-3" />
          <small style={{ fontSize: '12px' }} className="text-capitalize">
            {profile || 'desconocido'}
          </small>
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
          {userInfo.profile === PERFIL_CLIENTE.profile && (
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
              {showContactModal && <ModalContact handleClose={() => setShowContactModal(false)} />}
            </React.Fragment>
          )}
        </ul>
        <hr />
        <ul className="nav flex-column align-items-start links-list">
          {routes.map(({ name, url, icon, profiles, visibleInSidebar }) => {
            if (profilesContainsCurrentProfile(profiles) && visibleInSidebar) {
              return (
                <Link
                  to={url}
                  className={`nav-link text-capitalize ${isLinkActive(url) && 'active'}`}
                  key={url}>
                  <Icon name={icon} className="mb-1 mr-2" />
                  {name}
                </Link>
              );
            }
            return '';
          })}
        </ul>
      </div>
    </nav>
  );
};
