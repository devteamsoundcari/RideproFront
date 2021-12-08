// APP
export const APP_LOGIN_URL = '/login';

// API
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_DRIVERS_FILTER = 'api/v1/drivers_entire_filter/';
export const API_SINGLE_REQUEST = '/api/v1/requests/';
export const API_REQUEST_INSTRUCTORS = '/api/v1/request_ins/?request=';
export const API_REQUEST_INSTRUCTORS_UPDATE = '/api/v1/request_instructors/';
export const API_REQUEST_PROVIDERS = '/api/v1/request_prov/?request=';
export const API_REQUEST_DRIVERS = '/api/v1/drivers/';
export const API_REQUEST_DRIVER_REPORT = '/api/v1/request_drivers/?request=';
export const API_REQUEST_DOCUMENTS = '/api/v1/request_doc/?request=';
export const API_REQUEST_DOCUMENT_UPLOAD = '/api/v1/request_doc/';
export const API_REQUEST_BILLS = '/api/v1/bills/';
export const API_REQUEST_TRACKS = '/api/v1/tracks/';
export const API_REQUEST_TRACKS_SEARCH = 'api/v1/tracks?search=';
export const API_DEPARTMENTS = '/api/v1/departments/';
export const API_CITIES_BY_DEPARTMENT = 'api/v1/municipalities/?department_id=';
export const API_INSTRUCTORS_SEARCH = '/api/v1/instructors?search=';
export const API_ALL_INSTRUCTORS = '/api/v1/instructors/';

// Auth
export const API_LOGIN_URL = '/rest-auth/login/';
export const API_LOGOUT_URL = '/rest-auth/logout/';
export const API_USER_DATA = '/rest-auth/user/';
export const API_REFRESH_TOKEN_URL = '/rest-auth/token/refresh/';
export const API_REGISTRATION_URL = '/rest-auth/registration/';
export const API_RESET_PASSWORD_URL = '/rest-auth/password/reset/';
export const API_RESET_PASSWORD_CONFIRM_URL =
  '/rest-auth/password/reset/confirm/';

// GOOGLE API
export const GOOGLE_MAPS_SEARCH =
  'https://www.google.com/maps/search/?api=1&query=';

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

// ReqEx common patterns
export const REGEX_PHONE_NUMBER = /^\d{7,10}$/;
export const REGEX_OFFICIAL_ID = /^E?\d+$/;
export const REGEX_EMAIl =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const REGEX_LETTERS_AND_SPACES = /^[a-zA-Z\s]*$/;
