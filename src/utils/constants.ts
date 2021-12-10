// APP
export const APP_LOGIN_URL = '/login';

// API
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_DRIVERS_FILTER = 'api/v1/drivers_entire_filter/';
export const API_SINGLE_REQUEST = '/api/v1/requests/';
export const API_REQUEST_INSTRUCTORS = '/api/v1/request_ins/?request=';
export const API_REQUEST_INSTRUCTORS_UPDATE = '/api/v1/request_instructors/';
export const API_REQUEST_PROVIDERS_UPDATE = '/api/v1/request_providers/';
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
export const API_PROVIDERS_SEARCH = '/api/v1/providers?search=';
export const API_ALL_PROVIDERS = '/api/v1/providers/';

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

// Profiles
export const PERFIL_ADMIN = {
  profile: 1,
  name: 'administrador',
  steps: {
    STATUS_CANCELADO: { step: 0, id: STATUS_IDS[0] },
    STATUS_ESPERANDO_CONFIRMACION: { step: 1, id: STATUS_IDS[1] },
    STATUS_CONFIRMAR_PROGRAMACION: { step: 2, id: STATUS_IDS[2] },
    STATUS_SERVICIO_PROGRAMADO: { step: 3, id: STATUS_IDS[3] },
    STATUS_ESPERANDO_RECEPCION_DOCUMENTOS: { step: 5, id: STATUS_IDS[5] },
    STATUS_ASIGNAR_FACTURA: { step: 6, id: STATUS_IDS[6] },
    STATUS_SERVICIO_FINALIZADO: { step: 7, id: STATUS_IDS[7] }
  }
};

export const PERFIL_CLIENTE = {
  profile: 2,
  name: 'cliente',
  steps: {
    STATUS_CANCELADO: { step: 0, id: STATUS_IDS[0] },
    STATUS_ESPERANDO_CONFIRMACION: { step: 1, id: STATUS_IDS[1] },
    STATUS_CONFIRMAR_PROGRAMACION: { step: 2, id: STATUS_IDS[2] },
    STATUS_SERVICIO_PROGRAMADO: { step: 3, id: STATUS_IDS[3] },
    STATUS_SERVICIO_FINALIZADO: { step: 5, id: STATUS_IDS[5] }
  }
};

export const PERFIL_OPERACIONES = {
  profile: 3,
  name: 'operaciones',
  steps: {
    STATUS_CANCELADO: { step: 0, id: STATUS_IDS[0] },
    STATUS_ESPERANDO_CONFIRMACION: { step: 1, id: STATUS_IDS[1] },
    STATUS_ESPERANDO_AL_CLIENTE: { step: 2, id: STATUS_IDS[2] },
    STATUS_PROGRAMACION_ACEPTADA: { step: 3, id: STATUS_IDS[3] },
    STATUS_CONFIRMAR_DOCUMENTOS: { step: 4, id: STATUS_IDS[4] },
    STATUS_SERVICIO_FINALIZADO: { step: 6, id: STATUS_IDS[6] }
  }
};

export const PERFIL_EJECUTIVO = {
  profile: 4,
  name: 'ejecutivo',
  steps: {
    STATUS_CANCELADO: { step: 0, id: STATUS_IDS[0] },
    STATUS_ESPERANDO_CONFIRMACION: { step: 1, id: STATUS_IDS[1] },
    STATUS_CONFIRMAR_PROGRAMACION: { step: 2, id: STATUS_IDS[2] },
    STATUS_SERVICIO_PROGRAMADO: { step: 3, id: STATUS_IDS[3] },
    STATUS_ESPERANDO_RECEPCION_DOCUMENTOS: { step: 5, id: STATUS_IDS[5] },
    STATUS_ASIGNAR_FACTURA: { step: 6, id: STATUS_IDS[6] },
    STATUS_SERVICIO_FINALIZADO: { step: 7, id: STATUS_IDS[7] }
  }
};
export const PERFIL_TECNICO = {
  profile: 5,
  name: 'tecnico',
  steps: {
    STATUS_CANCELADO: { step: 0, id: STATUS_IDS[0] },
    STATUS_ESPERANDO_CONFIRMACION: { step: 1, id: STATUS_IDS[1] },
    STATUS_ESPERANDO_AL_CLIENTE: { step: 2, id: STATUS_IDS[2] },
    STATUS_PROGRAMACION_ACEPTADA: { step: 3, id: STATUS_IDS[3] },
    STATUS_GENERAR_INFORMES: { step: 4, id: STATUS_IDS[4] },
    STATUS_SERVICIO_FINALIZADO: { step: 5, id: STATUS_IDS[5] }
  }
};

export const PERFIL_SUPERCLIENTE = {
  profile: 7,
  name: 'super-cliente',
  steps: {
    STATUS_CANCELADO: { step: 0, id: STATUS_IDS[0] },
    STATUS_ESPERANDO_CONFIRMACION: { step: 1, id: STATUS_IDS[1] },
    STATUS_CONFIRMAR_PROGRAMACION: { step: 2, id: STATUS_IDS[2] },
    STATUS_SERVICIO_PROGRAMADO: { step: 3, id: STATUS_IDS[3] },
    STATUS_SERVICIO_FINALIZADO: { step: 5, id: STATUS_IDS[5] }
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
