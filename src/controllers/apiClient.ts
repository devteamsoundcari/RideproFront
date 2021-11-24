import axios from 'axios';
import {
  API_BASE_URL,
  APP_LOGIN_URL,
  API_REFRESH_TOKEN_URL
} from '../utils/constants';

// Return session storage token
const readAccessToken = (name) => {
  let tempLocalToken = sessionStorage.getItem(name);
  if (tempLocalToken) {
    return `Token ${tempLocalToken}`;
  } else {
    return '';
  }
};

// // Get refresh token from sessionStorage
const getRefreshToken = (name) => {
  let tempLocalToken = sessionStorage.getItem(name);
  if (tempLocalToken) {
    let { refresh_token } = JSON.parse(tempLocalToken);
    return refresh_token;
  } else {
    return '';
  }
};

// // Update session storage with new accessToken
const updateSessionStorageToken = (name, newToken) => {
  let tempLocalToken = sessionStorage.getItem(name);
  const { refresh_token } = JSON.parse(tempLocalToken as string);
  let payload = {
    access_token: newToken,
    refresh_token
  };
  sessionStorage.setItem(name, JSON.stringify(payload));
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken('Token');
  try {
    const res = await axios({
      method: 'post',
      url: `${API_REFRESH_TOKEN_URL}`,
      data: {
        refresh: refreshToken
      },
      headers: {
        'content-type': 'application/json'
      }
    });
    return res.data;
  } catch (e) {
    // If error with refreshing token, send to login page
    window.open(APP_LOGIN_URL, '_self');
  }
};

const buildClient = (
  baseUrl = API_BASE_URL,
  contentType = 'application/json'
) => {
  /**
   * Axios basic configuration
   * Some general configuration can be added like timeout, headers, params etc. More details can be found on https://github.com/axios/axios
   * */
  const options = {
    baseURL: baseUrl,
    timeout: 1000 * 30,
    withCredentials: false,
    headers: {
      'Content-Type': contentType
    }
  };

  /**
   * Creating the instance of Axios
   * It is because, in large scale application we may need to consume APIs from more than single server,
   * So, may need to create multiple http client with different config
   * Only this client will be used rather than axios in the application
   * */
  const httpClient = axios.create(options);

  /**
   * Auth interceptors
   * @description Configuration related to AUTH token can be done in interceptors.
   * Currently it is just doing nothing but idea to to show the capability of axios and its interceptors
   * In future, interceptors can be created into separate files and consumed into multiple http clients
   * @param {*} config
   */
  const authInterceptor = (config) => {
    const token = readAccessToken('Token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: token
      };
    } else if (!config.url.includes('login')) {
      window.open(APP_LOGIN_URL, '_self');
    }
    return config;
  };

  const loggerInterceptor = (config) => {
    /** Add logging here */
    return config;
  };

  /** Adding the request interceptors */
  httpClient.interceptors.request.use(authInterceptor);
  httpClient.interceptors.request.use(loggerInterceptor);

  /** Adding the response interceptors */
  httpClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // If unauthorized, refresh token
      if (error.response.status === 401) {
        const originalRequest = error.config;
        const { access } = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        // Update access token in session storage
        updateSessionStorageToken('Token', access);
        // Return updated httpClient
        return httpClient(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return httpClient;
};

class ApiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  constructor(url, contentType) {
    this.client = buildClient(url, contentType);
  }

  get(url, conf = {}) {
    return this.client
      .get(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  delete(url, conf = {}) {
    return this.client
      .delete(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  head(url, conf = {}) {
    return this.client
      .head(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  options(url, conf = {}) {
    return this.client
      .options(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  post(url, data = {}, conf = {}) {
    return this.client
      .post(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  put(url, data = {}, conf = {}) {
    return this.client
      .put(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }

  patch(url, data = {}, conf = {}) {
    return this.client
      .patch(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  }
}

const ApiClientSingleton = (function getInstances() {
  let ApiInstance;

  function createInstance(url, contentType) {
    const object = new ApiClient(url, contentType);
    return object;
  }

  return {
    getApiInstance(url?, contentType = 'application/json') {
      if (!ApiInstance || url) {
        ApiInstance = createInstance(url, contentType);
      }
      return ApiInstance;
    }
  };
})();

export default ApiClientSingleton;
