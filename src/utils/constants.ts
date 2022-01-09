// APP
export const COMPANY_NAME = 'ridepro';
export const COMPANY_EMAIL = 'soportealiados@ridepro.co';
export const HASH_KEYWORD = 'motorRidepro';
export const APP_LOGIN_URL = '/login';

// API
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_DRIVERS_FILTER = 'api/v1/drivers_entire_filter/';
export const API_SINGLE_REQUEST = '/api/v1/requests/';
export const API_REQUEST_INSTRUCTORS = '/api/v1/request_ins/?request=';
export const API_REQUEST_INSTRUCTOR_UPDATE = '/api/v1/request_ins/';
export const API_REQUEST_INSTRUCTORS_UPDATE = '/api/v1/request_instructors/';
export const API_REQUEST_PROVIDERS_UPDATE = '/api/v1/request_providers/';
export const API_REQUEST_PROVIDERS = '/api/v1/request_prov/?request=';
export const API_REQUEST_PROVIDER_UPDATE = '/api/v1/request_prov/';
export const API_REQUEST_DRIVERS = '/api/v1/drivers/';
export const API_REQUEST_DRIVER_REPORT = '/api/v1/request_drivers/?request=';
export const API_REQUEST_DRIVER_UPDATE_REPORT = '/api/v1/request_drivers/';
export const API_REQUEST_DOCUMENTS = '/api/v1/request_doc/?request=';
export const API_REQUEST_DOCUMENT_UPLOAD = '/api/v1/request_doc/';
export const API_REQUEST_BILLS = '/api/v1/bills/';
export const API_REQUEST_TRACKS = '/api/v1/tracks/';
export const API_REQUEST_COMPANY_TRACKS = '/api/v1/tracks/?company=';
export const API_REQUEST_TRACKS_SEARCH = 'api/v1/tracks?search=';
export const API_DEPARTMENTS = '/api/v1/departments/';
export const API_CITIES_BY_DEPARTMENT = 'api/v1/municipalities/?department_id=';
export const API_INSTRUCTORS_SEARCH = '/api/v1/instructors?search=';
export const API_ALL_INSTRUCTORS = '/api/v1/instructors/';
export const API_PROVIDERS_SEARCH = '/api/v1/providers?search=';
export const API_ALL_PROVIDERS = '/api/v1/providers/';
export const API_ALL_DOCUMENTS = '/api/v1/documents/';
export const API_UPDATE_REQUEST_DOCUMENTS = '/api/v1/request_documents/';
export const API_ALL_USERS = '/api/v1/users/';
export const API_ALL_COMPANIES = '/api/v1/companies/';
export const API_USER_COMPANIES = '/api/v1/user_companies/';
export const API_ALL_CREDITS = '/api/v1/sale_credits/';

// Auth
export const API_LOGIN_URL = '/rest-auth/login/';
export const API_LOGOUT_URL = '/rest-auth/logout/';
export const API_USER_DATA = '/rest-auth/user/';
export const API_REFRESH_TOKEN_URL = '/rest-auth/token/refresh/';
export const API_REGISTRATION_URL = '/rest-auth/registration/';
export const API_RESET_PASSWORD_URL = '/rest-auth/password/reset/';
export const API_RESET_PASSWORD_CONFIRM_URL = '/rest-auth/password/reset/confirm/';

// GOOGLE API
export const GOOGLE_MAPS_SEARCH = 'https://www.google.com/maps/search/?api=1&query=';
export const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&v=3.exp&libraries=geometry,drawing,places`;

const STATUS_IDS = {
  0: '59a9ee90-bc3a-4abd-a55b-f5957067442f',
  1: 'd4a51592-9cca-42dd-92d7-ef8582f91ff5',
  2: '1bcb0d07-2671-4dd5-bc90-fd6b38472731',
  3: '5e25ebcc-93b2-45d3-9583-aaac0c3a3ae0',
  4: '79cc60ac-0535-4e13-95cb-c7eddcbfe515',
  5: 'dc2c2359-434e-4a5c-ad8d-71da82f96c6b',
  6: '6e40941e-3417-446c-a7b1-cf9f165b7988',
  7: '657456b6-7828-4e8e-af7c-b4035c1c7a61',
  8: 'b362904f-5589-4057-8cb4-756aee54140e'
};

const STATUS_ESPERANDO_CONFIRMACION = {
  step: 1,
  id: STATUS_IDS[1],
  name: 'Esperando confirmación',
  variant: 'event-requested',
  bgColor: 'yellow',
  color: '#333',
  now: 20,
  level: 60
};

const STATUS_CANCELADO = {
  step: 0,
  id: STATUS_IDS[0],
  name: 'Solicitud cancelada',
  variant: 'event-canceled',
  bgColor: 'red',
  color: '#fff',
  now: 100,
  level: 100
};

const STATUS_CONFIRMAR_PROGRAMACION = {
  step: 2,
  id: STATUS_IDS[2],
  name: 'Confirmar programación',
  variant: 'confirm-event',
  bgColor: 'orange',
  color: '#fff',
  now: 40,
  level: 60
};

const STATUS_SERVICIO_PROGRAMADO = {
  step: 3,
  id: STATUS_IDS[3],
  name: 'Servicio programado',
  variant: 'event-confirmed',
  bgColor: 'dodgerblue',
  color: '#fff',
  now: 50,
  level: 60
};

const STATUS_SERVICIO_FINALIZADO = {
  step: 5,
  id: STATUS_IDS[5],
  name: 'Confirmar recepción de documentos',
  variant: 'confirm-docs',
  bgColor: 'mediumslateblue',
  color: '#fff',
  now: 60,
  level: 60
};

const STATUS_ESPERANDO_AL_CLIENTE = {
  step: 2,
  id: STATUS_IDS[2],
  name: 'Esperando confirmación cliente',
  variant: 'confirm-event',
  bgColor: 'orange',
  color: '#fff',
  now: 40,
  level: 60
};

const STATUS_PROGRAMACION_ACEPTADA = {
  step: 3,
  id: STATUS_IDS[3],
  name: 'Programación aceptada',
  variant: 'event-confirmed',
  bgColor: 'dodgerblue',
  color: '#fff',
  now: 50,
  level: 60
};

const STATUS_CONFIRMAR_DOCUMENTOS = {
  step: 4,
  id: STATUS_IDS[4],
  name: 'Confirmar recepción de documentos',
  variant: 'confirm-docs',
  bgColor: 'mediumslateblue',
  color: '#fff',
  now: 60,
  level: 60
};

const STATUS_GENERAR_INFORMES = {
  step: 4,
  id: STATUS_IDS[4],
  name: 'Generar Informes',
  variant: 'upload-reports',
  bgColor: 'deeppink',
  color: '#fff',
  now: 80,
  level: 80
};

const STATUS_ESPERANDO_RECEPCION_DOCUMENTOS = {
  step: 5,
  id: STATUS_IDS[5],
  name: 'Esperando recepción de documentos',
  variant: 'confirm-docs',
  bgColor: 'mediumslateblue',
  color: '#fff',
  now: 60,
  level: 60
};

const STATUS_ASIGNAR_FACTURA = {
  step: 6,
  id: STATUS_IDS[6],
  name: 'Adjuntar factura',
  variant: 'upload-reports',
  bgColor: 'deeppink',
  color: '#fff',
  now: 80,
  level: 80
};

// ============= Profiles =================
export const PERFIL_ADMIN = {
  profile: 1,
  name: 'admin',
  steps: {
    STATUS_CANCELADO,
    STATUS_ESPERANDO_CONFIRMACION,
    STATUS_ESPERANDO_AL_CLIENTE,
    STATUS_SERVICIO_PROGRAMADO,
    STATUS_CONFIRMAR_PROGRAMACION: {
      ...STATUS_PROGRAMACION_ACEPTADA,
      step: 4,
      id: STATUS_IDS[4]
    },
    STATUS_ESPERANDO_RECEPCION_DOCUMENTOS,
    STATUS_ASIGNAR_FACTURA,
    STATUS_SERVICIO_FINALIZADO: {
      step: 7,
      id: STATUS_IDS[7],
      name: 'Servicio finalizado',
      variant: 'event-finished',
      bgColor: 'lightgreen',
      color: '#333',
      now: 100,
      level: 100
    }
  }
};

export const PERFIL_TECNICO = {
  profile: 5,
  name: 'tecnico',
  steps: {
    STATUS_CANCELADO,
    STATUS_ESPERANDO_CONFIRMACION,
    STATUS_ESPERANDO_AL_CLIENTE,
    STATUS_PROGRAMACION_ACEPTADA,
    STATUS_GENERAR_INFORMES,
    STATUS_SERVICIO_FINALIZADO: {
      ...STATUS_SERVICIO_FINALIZADO,
      name: 'Evento Finalizado',
      variant: 'event-finished',
      bgColor: 'yellow',
      color: '#333',
      now: 100,
      level: 100
    }
  }
};

export const PERFIL_OPERACIONES = {
  profile: 3,
  name: 'operaciones',
  steps: {
    STATUS_CANCELADO,
    STATUS_ESPERANDO_CONFIRMACION,
    STATUS_ESPERANDO_AL_CLIENTE,
    STATUS_PROGRAMACION_ACEPTADA,
    STATUS_CONFIRMAR_DOCUMENTOS,
    STATUS_SERVICIO_FINALIZADO
  }
};

export const PERFIL_EJECUTIVO = {
  profile: 4,
  name: 'ejecutivo',
  steps: {
    STATUS_CANCELADO,
    STATUS_ESPERANDO_CONFIRMACION,
    STATUS_ESPERANDO_AL_CLIENTE,
    STATUS_SERVICIO_PROGRAMADO,
    STATUS_CONFIRMAR_PROGRAMACION: {
      ...STATUS_PROGRAMACION_ACEPTADA,
      step: 4,
      id: STATUS_IDS[4]
    },
    STATUS_ESPERANDO_RECEPCION_DOCUMENTOS,
    STATUS_ASIGNAR_FACTURA,
    STATUS_SERVICIO_FINALIZADO: {
      step: 7,
      id: STATUS_IDS[7],
      name: 'Servicio finalizado',
      variant: 'event-finished',
      bgColor: 'yellow',
      color: '#333',
      now: 100,
      level: 100
    }
  }
};

export const PERFIL_CLIENTE = {
  profile: 2,
  name: 'cliente',
  steps: {
    STATUS_CANCELADO,
    STATUS_ESPERANDO_CONFIRMACION,
    STATUS_CONFIRMAR_PROGRAMACION,
    STATUS_SERVICIO_PROGRAMADO,
    STATUS_SERVICIO_FINALIZADO
  }
};

export const PERFIL_SUPERCLIENTE = {
  profile: 7,
  name: 'super-cliente',
  steps: {
    STATUS_CANCELADO,
    STATUS_ESPERANDO_CONFIRMACION,
    STATUS_CONFIRMAR_PROGRAMACION,
    STATUS_SERVICIO_PROGRAMADO,
    STATUS_SERVICIO_FINALIZADO
  }
};

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
