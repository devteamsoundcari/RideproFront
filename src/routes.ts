import {
  PERFIL_ADMIN,
  PERFIL_CLIENTE,
  PERFIL_OPERACIONES,
  PERFIL_EJECUTIVO,
  PERFIL_SUPERCLIENTE,
  ALL_PROFILES
} from './utils/constants';

export const routes = [
  {
    name: 'login',
    visibleInSidebar: false,
    url: '/login',
    component: 'Login',
    isProtected: false,
    icon: 'AiFillCalendar',
    profiles: ALL_PROFILES
  },
  {
    name: 'reset-password',
    visibleInSidebar: false,
    url: '/reset-password',
    component: 'PasswordRecover',
    isProtected: false,
    icon: 'AiFillCalendar',
    profiles: ALL_PROFILES
  },
  {
    name: 'calendario',
    visibleInSidebar: true,
    url: '/calendar',
    component: 'Calendar',
    isProtected: true,
    icon: 'AiFillCalendar',
    profiles: ALL_PROFILES
  },
  {
    name: 'solicitar',
    visibleInSidebar: true,
    url: '/solicitar',
    component: 'Solicitar',
    isProtected: true,
    icon: 'badge',
    profiles: [PERFIL_CLIENTE]
  },
  {
    name: 'historial',
    visibleInSidebar: true,
    url: '/historial',
    component: 'Historial',
    isProtected: true,
    icon: 'AiOutlineHistory',
    profiles: ALL_PROFILES,
    children: {
      url: ':requestId',
      component: 'AdminRequestId'
    }
  },
  {
    name: 'usuarios',
    visibleInSidebar: true,
    url: '/usuarios',
    component: 'Usuarios',
    isProtected: true,
    icon: 'GiThreeFriends',
    profiles: [PERFIL_ADMIN]
  },
  {
    name: 'empresas',
    visibleInSidebar: true,
    url: '/empresas',
    component: 'Empresas',
    isProtected: true,
    icon: 'FaRegBuilding',
    profiles: [PERFIL_ADMIN]
  },
  {
    name: 'superusuarios',
    visibleInSidebar: true,
    url: '/superusuarios',
    component: 'SuperUsuarios',
    isProtected: true,
    icon: 'FaUserShield',
    profiles: [PERFIL_ADMIN]
  },
  {
    name: 'documentos',
    visibleInSidebar: true,
    url: '/documentos',
    component: 'Documentos',
    isProtected: true,
    icon: 'FaPaperclip',
    profiles: [PERFIL_ADMIN]
  },
  {
    name: 'créditos',
    visibleInSidebar: true,
    url: '/creditos',
    component: 'Creditos',
    isProtected: true,
    icon: 'FaDollarSign',
    profiles: [PERFIL_ADMIN]
  },
  {
    name: 'pistas',
    visibleInSidebar: true,
    url: '/pistas',
    component: 'Pistas',
    isProtected: true,
    icon: 'GiTireTracks',
    profiles: [PERFIL_ADMIN, PERFIL_CLIENTE, PERFIL_OPERACIONES, PERFIL_EJECUTIVO]
  },
  {
    name: 'sucursales',
    visibleInSidebar: true,
    url: '/sucursales',
    component: 'Sucursales',
    isProtected: true,
    icon: 'GiTireTracks',
    profiles: [PERFIL_SUPERCLIENTE]
  },
  {
    name: 'instructores',
    visibleInSidebar: true,
    url: '/instructores',
    component: 'Instructores',
    isProtected: true,
    icon: 'FaUserGraduate',
    profiles: [PERFIL_OPERACIONES]
  },
  {
    name: 'proveedores',
    visibleInSidebar: true,
    url: '/proveedores',
    component: 'Proveedores',
    isProtected: true,
    icon: 'FaPeopleCarry',
    profiles: [PERFIL_OPERACIONES]
  }
];
