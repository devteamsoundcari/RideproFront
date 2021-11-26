// APP
export const APP_LOGIN_URL = '/login';

// API
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_DRIVERS_FILTER = 'api/v1/drivers_entire_filter/';

// Auth
export const API_LOGIN_URL = '/rest-auth/login/';
export const API_LOGOUT_URL = '/rest-auth/logout/';
export const API_USER_DATA = '/rest-auth/user/';
export const API_REFRESH_TOKEN_URL = '/rest-auth/token/refresh/';
export const API_REGISTRATION_URL = '/rest-auth/registration/';
export const API_RESET_PASSWORD_URL = '/rest-auth/password/reset/';
export const API_RESET_PASSWORD_CONFIRM_URL =
  '/rest-auth/password/reset/confirm/';

// Perfiles
export const PERFIL_ADMIN = { profile: 1, name: 'administrador' };
export const PERFIL_CLIENTE = { profile: 2, name: 'cliente' };
export const PERFIL_OPERACIONES = { profile: 3, name: 'operaciones' };
export const PERFIL_EJECUTIVO = { profile: 4, name: 'ejecutivo' };
export const PERFIL_TECNICO = { profile: 5, name: 'tecnico' };
export const PERFIL_SUPERCLIENTE = { profile: 7, name: 'super-cliente' };
export const ALL_PROFILES = [
  PERFIL_ADMIN,
  PERFIL_CLIENTE,
  PERFIL_OPERACIONES,
  PERFIL_EJECUTIVO,
  PERFIL_TECNICO,
  PERFIL_SUPERCLIENTE
];
