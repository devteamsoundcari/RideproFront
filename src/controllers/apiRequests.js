import axios from "axios";

/* =================================     SEND EMAIL    ===================================== */

const sendEmail = async (data) => {
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_MAILER_URL}/api/sendEmail`,
    data,
  }).catch((err) => {
    console.log(err.response);
  });
  return true;
};

/* =================================  PASSWORD RESET  ===================================== */

const passwordReset = async (data) => {
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/password/reset/`,
    data: {
      email: data.email,
    },
  }).catch((err) => {
    console.log(err.response);
  });
  return true;
};

/* =================================  PASSWORD RESET  ===================================== */

const setNewPassword = async (data) => {
  // console.log(data);
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/password/reset/confirm/`,
    data: {
      new_password1: data.password,
      new_password2: data.passwordRepeat,
      uid: data.uid,
      token: data.token,
    },
  }).catch((err) => {
    return err.response.data;
  });
  if (result.status === 200) {
    return true;
  } else {
    return false;
  }
};

/* =================================     Add a user if not exist in db     ===================================== */

const saveNewUser = async (data) => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/registration/`,
    data: {
      email: data.email,
      password1: data.password,
      password2: data.passwordRepeat,
      first_name: data.name,
      last_name: data.lastName,
      profile: data.profileType,
      company: data.company,
      charge: data.charge,
      picture: data.picture ? data.picture : "https://via.placeholder.com/200",
    },
  }).catch((err) => {
    console.error(err);
    return err.response.data;
  });
  if (result.status === 201) {
    return true;
  } else {
    return false;
  }
};

/* =================================   Getting the token at login     ===================================== */

const getLoginToken = async (data) => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/login/`,
    data: {
      email: data.email,
      password: data.password,
    },
  }).catch((err) => {
    console.error(err);
    return err;
  });
  if (result.status === 200) {
    return {
      token: result.data.key,
    };
  }
  return {
    error: "Clave o Usuario Invalidos",
  };
};
/* =================================   GET USER'S INFO   ===================================== */
const getUserInfo = async () => {
  const getInfo = async (url) => {
    const userData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return userData;
  };
  let user = await getInfo(`${process.env.REACT_APP_API_URL}/rest-auth/user/`);
  return user.data;
};

/* =================================   GET SERVICES   ===================================== */
const getServices = async () => {
  const getInfo = async (url) => {
    const serviceData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return serviceData;
  };
  let services = await getInfo(
    `${process.env.REACT_APP_API_URL}/api/v1/services/`
  );
  return services.data.results;
};

/* =================================   GET COMPANIES   ===================================== */
const getCompanies = async () => {
  const getInfo = async (url) => {
    const compData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return compData;
  };
  let company = await getInfo(
    `${process.env.REACT_APP_API_URL}/api/v1/companies/`
  );
  return company.data;
};

/* =================================   GET DEPERTMENTS   ===================================== */
const getDepartments = async (url) => {
  const getInfo = async () => {
    const departmentsData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return departmentsData;
  };
  let departments = await getInfo();
  return departments.data;
};

/* =================================   GET MUNICIPALITIES   ===================================== */
const getMunicipalities = async (url) => {
  const getInfo = async () => {
    const citiesData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return citiesData;
  };
  let municipalities = await getInfo();
  return municipalities.data;
};

/* =================================   CREATE A REQUEST FROM CLIENT   ===================================== */
const createRequest = async (data) => {
  let {
    service,
    customer,
    municipality,
    place,
    start_time,
    finish_time,
    drivers,
  } = data;

  // =========================== MAPGIN DRIVER TO COVERT THEM INTO URLS ============================================
  drivers = drivers.map((driver) => {
    return `${process.env.REACT_APP_API_URL}/api/v1/drivers/${driver}/`;
  });

  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/requests/`,
    data: {
      service,
      customer,
      municipality,
      operator: null,
      instructor: "na",
      place,
      start_time,
      finish_time,
      status: "c25b4036-1d0f-4293-833b-15e342c80856", // This is first step
      new_request: 0,
      accept_msg: "na",
      reject_msg: "na",
      drivers,
    },
  }).catch((err) => {
    console.log("fallo", err.request.response);
    return err;
  });
  descreaseCredits(data.company, data.used_credits); // Calling decrease
  return result;
};

/* =================================   CREATE A DRIVER  ===================================== */

const createDriver = async (data) => {
  const { first_name, last_name, official_id, cellphone, email } = data;
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/drivers/`,
    data: {
      first_name,
      last_name,
      official_id,
      cellphone,
      email,
      requests: [], // Empty because it doesnot belong to any request yet
    },
  }).catch((err) => {
    return err;
  });
  return result;
};
/* =================================   GET ALL DRIVES IN DB  ===================================== */

const getAllDrivers = async (url) => {
  const getInfo = async () => {
    const driversData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return driversData;
  };
  let drivers = await getInfo();
  return drivers.data;
};

/* =================================   GET A DRIVER ===================================== */

const fetchDriver = async (url) => {
  const getInfo = async () => {
    const driverData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return driverData;
  };
  let driver = await getInfo();
  return driver.data;
};

/* =================================   DECREASE CREDITS IN COMPANY   ===================================== */
const descreaseCredits = async (company, credits) => {
  const newCredit = company.credit - credits;
  const { address, arl, name, nit, phone, id } = company;
  const result = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API_URL}/api/v1/companies/${id}/`,
    data: {
      credit: newCredit,
      address,
      arl,
      name,
      nit,
      phone,
    },
  }).catch((err) => {
    return err;
  });
  return result;
};

/* =================================   GET USER REQUESTS   ===================================== */
const getUserRequests = async (url) => {
  const getInfo = async () => {
    const requestsData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return requestsData;
  };
  let requests = await getInfo();
  return requests.data;
};
// ================================================================================

export {
  sendEmail,
  saveNewUser,
  getLoginToken,
  getUserInfo,
  passwordReset,
  setNewPassword,
  createRequest,
  getMunicipalities,
  getUserRequests,
  getDepartments,
  getCompanies,
  createDriver,
  getAllDrivers,
  fetchDriver,
  getServices,
};
