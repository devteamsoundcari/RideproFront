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

const changePassword = async (data) => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/password/change/`,
    data: {
      new_password1: data.newPassword,
      new_password2: data.newPasswordConfirmation,
      old_password: data.oldPassword,
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
      gender: data.gender,
      profile: data.profileType,
      company: data.company,
      charge: data.charge,
      picture: data.picture ? data.picture : "../assets/img/userdefault.png",
      credit: data.credit,
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

const setUserProfilePicture = async (user, picture) => {
  const formData = new FormData();
  formData.append("picture", picture);
  formData.append("company_id", user.company.id);
  const result = await axios
    .patch(`${process.env.REACT_APP_API_URL}/rest-auth/user/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((err) => {
      console.error(err);
      return err.response.data;
    });
  return result;
};

const setRequestFile = async (requestId, id, docId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("request", requestId);
  formData.append("document_id", docId);
  const result = await axios
    .patch(
      `${process.env.REACT_APP_API_URL}/api/v1/request_doc/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .catch((err) => {
      console.error(err);
      return err.response.data;
    });
  return result;
};

const editUser = async (data) => {
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/user/`,
    data: {
      email: data.email,
      password1: data.password,
      password2: data.passwordRepeat,
      first_name: data.name,
      last_name: data.lastName,
      gender: data.gender,
      profile: data.profileType,
      company_id: data.company_id,
      charge: data.charge,
      picture: data.picture,
    },
  }).catch((err) => {
    console.error(err);
    return err.response.data;
  });
  if (result.status === 200) {
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

/* =================================   GET LINE SERVICES   ===================================== */

const getLineServices = async () => {
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
    `${process.env.REACT_APP_API_URL}/api/v1/service_lines/`
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

const editCompany = async (id, data) => {
  const result = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API_URL}/api/v1/companies/${id}/`,
    data: {
      name: data.name,
      nit: data.nit,
      address: data.address,
      arl: data.arl,
      phone: data.phone,
      credit: data.credit,
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

const setCompanyLogo = async (id, logo) => {
  const formData = new FormData();
  formData.append("logo", logo);
  const result = await axios
    .put(
      `${process.env.REACT_APP_API_URL}/api/v1/companies/${id}/logo/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .catch((err) => {
      console.error(err);
      return err.response.data;
    });
  return result;
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
/* =================================   GET ALL USERS IN DB   ===================================== */

const getUsers = async (url) => {
  const getInfo = async () => {
    const usersData = await axios({
      method: "GET",
      url,
    }).catch((err) => {
      return err;
    });
    return usersData;
  };
  let users = await getInfo();
  return users.data;
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
    spent_credit,
    track,
    new_request,
    accept_msg,
    fare_track,
  } = data;

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
      track,
      spent_credit,
      start_time,
      finish_time,
      status: `${process.env.REACT_APP_STATUS_CONFIRMATION_PROCESS}`, //"d02eaa22-8a5c-4904-b3c4-567782a53f51", // This is first step
      new_request: new_request,
      accept_msg: accept_msg,
      reject_msg: "na",
      drivers,
      fare_track,
    },
  }).catch((err) => {
    console.log(`Request error at /api/v1/requests/: `, err.request.response);
    return err;
  });
  let creditDecreasing = await decreaseUserCredits(
    result.data.customer,
    data.spent_credit
  ); // Calling decrease
  return { response: result, creditDecreasingResponse: creditDecreasing };
};

const editRequest = async (id, data) => {
  let {
    service,
    customer,
    municipality,
    place,
    start_time,
    finish_time,
    drivers,
    spent_credit,
    track,
    new_request,
    accept_msg,
    fare_track,
  } = data;

  const result = await axios({
    method: "PUT",
    url: `${process.env.REACT_APP_API_URL}/api/v1/requests/${id}/`,
    data: {
      service,
      customer,
      municipality,
      operator: null,
      instructor: "na",
      place,
      track,
      spent_credit,
      start_time,
      finish_time,
      status: `${process.env.REACT_APP_STATUS_CONFIRMATION_PROCESS}`,
      new_request: new_request,
      accept_msg: accept_msg,
      reject_msg: "na",
      drivers,
      fare_track,
    },
  }).catch((err) => {
    console.log(`Request error at /api/v1/requests/: `, err.request.response);
    return err;
  });
  let creditDecreasing = await decreaseUserCredits(
    result.data.customer,
    data.spent_credit - data.prev_credits
  );
  return { response: result, creditDecreasingResponse: creditDecreasing };
};

// ==================================== CANCEL REQUEST ID AND REFIND CREDITS ==================================================================

const cancelRequestId = async (data) => {
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/requests/${data.id}/`,
    data: {
      status: `${process.env.REACT_APP_STATUS_CANCELED}`, //"f973cb97-ac8a-4ec9-b288-c003bedd5d93", // Status setp canceled 0
      reject_msg: data.reject_msg,
    },
  }).catch((err) => {
    console.error(err);
    return err;
  });
  let result2 = await increaseCredits(data.userId, data.refund_credits); // Calling decrease
  return { canceled: result, refund: result2 };
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
      requests: [],
      report: "na",
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

const fetchDriver = async (id) => {
  const getInfo = async () => {
    const driverData = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/v1/drivers/${id}`,
    }).catch((err) => {
      return err;
    });
    return driverData;
  };
  let driver = await getInfo();
  return driver.data;
};

/* =================================   GET A INSTRUCTOR ===================================== */

const fetchInstructor = async (id) => {
  const getInfo = async () => {
    const instructorData = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/v1/instructors/${id}`,
    }).catch((err) => {
      return err;
    });
    return instructorData;
  };
  let instructor = await getInfo();
  return instructor.data;
};

/* =================================   UPDATE A DRIVER ===================================== */

const updateDriver = async (data, id) => {
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/drivers/${id}/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};

/* =================================   UPDATE A REQUEST ===================================== */

const updateRequest = async (data, id) => {
  if (data.start_time) {
    data.finish_time = data.start_time;
  }
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/requests/${id}/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};

/* =================================   GET A REQUEST ===================================== */
const getRequest = async (id) => {
  const getInfo = async () => {
    const requestData = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/api/v1/requests/${id}/`,
    }).catch((err) => {
      return err;
    });
    return requestData;
  };
  let request = await getInfo();
  return request.data;
};

/* =================================  ADD DOCUMENTS TO A REQUEST  ===================================== */

const updateRequestDocuments = async (data) => {
  // console.log("ENVIA", data);
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/request_documents/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};

/* =================================   POST REQUEST INSTRUCTORS FARE  ===================================== */

const updateRequestInstructors = async (data) => {
  // console.log("ENVIA", data);
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/request_instructors/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};

const updateInstructorFares = async (data, id) => {
  // console.log("ENVIA", data);
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/request_ins/${id}/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};
/* =================================   POST REQUEST PROVIDERS FARE  ===================================== */

const updateRequestProviders = async (data) => {
  // console.log("ENVIA", data);
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/request_providers/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};

const updateProviderFares = async (data, id) => {
  // console.log("ENVIA", data);
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/request_prov/${id}/`,
    data,
  }).catch((err) => {
    return err;
  });
  return result;
};

/* =================================   GET REQUEST DOCUMENTS  ===================================== */

const getRequestDocuments = async (url) => {
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

/* =================================   GET REQUEST INSTRUCTORS  ===================================== */

const getRequestInstructors = async (url) => {
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

/* =================================   GET REQUEST PROVIDERS  ===================================== */

const getRequestProviders = async (url) => {
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

/* =================================   DECREASE CREDITS IN COMPANY   ===================================== */
// eslint-disable-next-line
const decreaseCredits = async (company, credits) => {
  const newCredit = company.credit - credits;
  const { id } = company;
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/companies/${id}/`,
    data: {
      credit: newCredit,
    },
  }).catch((err) => {
    return err;
  });
  return result;
};

const decreaseUserCredits = async (user, credits) => {
  const newCredit = user.credit - credits;
  const { company } = user;
  const result = await axios({
    auth: false,
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/user/`,
    data: {
      credit: newCredit,
      company_id: company.id,
    },
  }).catch((err) => {
    return err;
  });
  return result;
};

/* =================================   INCREASE CREDITS IN COMPANY   ===================================== */
const increaseCredits = async (userId, credits) => {
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/users/${userId}/`,
    data: {
      credit: credits,
    },
  }).catch((err) => {
    return err;
  });
  return result;
};

const setUserCredits = async (id, credits) => {
  const result = await axios({
    method: "PATCH",
    url: `${process.env.REACT_APP_API_URL}/api/v1/users/${id}/`,
    data: {
      credit: credits,
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

// ====================================== GET GENDER BASED ON NAME =============================================

const getGender = async (name) => {
  const getInfo = async () => {
    const requestsData = await axios({
      method: "GET",
      url: `https://api.genderize.io/?name=${name}`,
    }).catch((err) => {
      return err;
    });
    return requestsData;
  };
  let requests = await getInfo();
  return requests.data;
};

/* =================================   GET COMPANY TRACKS   ===================================== */
const getTracks = async (url) => {
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

/* =================================   CRATE A NEW TRACK   ===================================== */

const createNewTrack = async (data) => {
  const {
    companyId,
    trackAddress,
    trackDescription,
    trackMunicipality,
    trackName,
    fare,
    cellphone,
    latitude,
    longitude,
    contact_email,
    contact_name,
    pictures,
  } = data;
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/tracks/`,
    data: {
      company: companyId,
      address: trackAddress,
      municipality: trackMunicipality,
      name: trackName,
      description: trackDescription,
      fare,
      cellphone,
      latitude,
      longitude,
      contact_email,
      contact_name,
      pictures,
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

/* =================================   GET ALL INSTRUCTORS  ===================================== */

const getInstructors = async (url) => {
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

const createInstructor = async (data) => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/instructors/`,
    data: {
      official_id: data.official_id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      cellphone: data.cellphone,
      municipality: data.municipality.id,
      documents: "na",
      picture: "na",
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

/* =================================   GET ALL PROVIDERS  ===================================== */

const getProviders = async (url) => {
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

const createProvider = async (data) => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/v1/providers/`,
    data: {
      official_id: data.official_id,
      name: data.name,
      email: data.email,
      cellphone: data.cellphone,
      municipality: data.municipality.id,
      services: data.services,
      documents: "na",
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
// ================================================================================

export {
  sendEmail,
  saveNewUser,
  getUsers,
  editUser,
  getLoginToken,
  getUserInfo,
  setUserCredits,
  setUserProfilePicture,
  setRequestFile,
  decreaseUserCredits,
  passwordReset,
  setNewPassword,
  changePassword,
  createRequest,
  editRequest,
  getMunicipalities,
  getUserRequests,
  getDepartments,
  getCompanies,
  editCompany,
  setCompanyLogo,
  getGender,
  createDriver,
  getAllDrivers,
  updateRequest,
  getRequest,
  updateRequestDocuments,
  getRequestDocuments,
  updateRequestInstructors,
  updateInstructorFares,
  updateRequestProviders,
  updateProviderFares,
  updateDriver,
  getRequestInstructors,
  getRequestProviders,
  fetchDriver,
  fetchInstructor,
  cancelRequestId,
  getServices,
  getLineServices,
  createNewTrack,
  getTracks,
  getInstructors,
  createInstructor,
  getProviders,
  createProvider,
};
