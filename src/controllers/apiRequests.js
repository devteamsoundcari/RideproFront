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
    console.error(err.response.data);
    return err.response.data;
  });
  if (result.status === 200) {
    return true;
  } else {
    return false;
  }
};

// /* =================================  PASSWORD RESET  ===================================== */

// const getTypesOfService = async (data) => {
//   // console.log(data);
//   // const result = await axios({
//   //   method: "POST",
//   //   url: `${process.env.REACT_APP_API_URL}/rest-auth/password/reset/confirm/`,
//   //   data: {
//   //     new_password1: data.password,
//   //     new_password2: data.passwordRepeat,
//   //     uid: data.uid,
//   //     token: data.token,
//   //   },
//   // }).catch((err) => {
//   //   console.log(err.response.data);
//   //   return err.response.data;
//   // });
//   // if (result.status === 200) {
//   //   return true;
//   // } else {
//   //   return false;
//   // }
//   return [
//     {
//       id: 32,
//       created_at: "20/04/2020",
//       updated_ad: "20/04/2020",
//       name: "Prueba de Ingreso Moto",
//       ride_value: 3,
//       service_type: "Persona",
//       description:
//         "Prueba para motociclistas que montan moto, y tienen moto y le gustan las motos.",
//       requirements: "Lorem Ipsum is simply dummy text of the ",
//       duration: "35",
//     },
//     {
//       id: 62,
//       created_at: "20/04/2020",
//       updated_ad: "20/04/2020",
//       name: "Prueba de Ingreso Taxi",
//       ride_value: 6,
//       service_type: "Persona",
//       description:
//         "Prueba para conductores que montan carro, y tienen carro y le gustan los carros.",
//       requirements: "Lorem Ipsum is simply dummy text of the ",
//       duration: "55",
//     },
//     {
//       id: 22,
//       created_at: "20/04/2020",
//       updated_ad: "20/04/2020",
//       name: "Prueba de Ingreso Carro",
//       ride_value: 2,
//       service_type: "Jornada",
//       description:
//         "Prueba para conductores que montan carro, y tienen carro y le gustan los carros.",
//       requirements: "Lorem Ipsum is simply dummy text of the ",
//       duration: "55",
//     },
//     {
//       id: 52,
//       created_at: "20/04/2020",
//       updated_ad: "20/04/2020",
//       name: "Prueba de Ingreso Taxi",
//       ride_value: 6,
//       service_type: "Persona",
//       description:
//         "Prueba para conductores que montan carro, y tienen carro y le gustan los carros.",
//       requirements: "Lorem Ipsum is simply dummy text of the ",

//       duration: "55",
//     },
//     {
//       id: 2,
//       created_at: "20/04/2020",
//       updated_ad: "20/04/2020",
//       name: "Prueba de Ingreso Taxi",
//       ride_value: 6,
//       service_type: "Persona",
//       description:
//         "Prueba para conductores que montan carro, y tienen carro y le gustan los carros.",
//       requirements: "Lorem Ipsum is simply dummy text of the ",
//       duration: "55",
//     },
//     {
//       id: 92,
//       created_at: "20/04/2020",
//       updated_ad: "20/04/2020",
//       name: "Prueba de Ingreso Taxi",
//       service_type: "Persona",
//       ride_value: 6,
//       description:
//         "Prueba para conductores que montan carro, y tienen carro y le gustan los carros.",
//       requirements: "Lorem Ipsum is simply dummy text of the ",
//       duration: "55",
//     },
//   ];
// };

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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
      console.error(err);
    });
    return citiesData;
  };
  let municipalities = await getInfo();
  return municipalities.data;
};

export {
  sendEmail,
  saveNewUser,
  getLoginToken,
  getUserInfo,
  passwordReset,
  setNewPassword,
  // getTypesOfService,\
  getMunicipalities,
  getDepartments,
  getCompanies,
  getServices,
};
