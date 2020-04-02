import axios from "axios";

/* =================================     SEND EMAIL    ===================================== */

const sendEmail = async data => {
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_MAILER_URL}/api/sendEmail`,
    data
  }).catch(err => {
    console.log(err.response);
  });
  return true;
};

/* =================================  PASSWORD RESET  ===================================== */

const passwordReset = async data => {
  console.log("enviando a password reset");
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/password/reset/`,
    data: data.email
  }).catch(err => {
    console.log(err.response);
  });
  return true;
};

/* =================================     Add a user if not exist in db     ===================================== */

const saveNewUser = async data => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/registration/`,
    data: {
      email: data.email,
      password1: data.password,
      password2: data.passwordRepeat,
      first_name: data.name,
      last_name: data.lastName,
      profile: data.profileType
    }
  }).catch(err => {
    console.log(err.response.data);
    return err.response.data;
  });
  if (result.status === 201) {
    return true;
  } else {
    return false;
  }
};

/* =================================   Getting the token at login     ===================================== */

const getLoginToken = async data => {
  const result = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/rest-auth/login/`,
    data: {
      email: data.email,
      password: data.password
    }
  }).catch(err => {
    return err;
  });
  if (result.status === 200) {
    return {
      token: result.data.key
    };
  }
  return {
    error: "Clave o Usuario Invalidos"
  };
};
/* =================================   GET USER'S INFO BY EMAIL    ===================================== */
const getUserByEmail = async email => {
  let users = [];
  const getUsers = async url => {
    const result = await axios({
      method: "GET",
      url
    }).catch(error => {
      console.log(error);
    });
    result.data.results.map(user => {
      users.push(user);
      return true;
    });
    if (result.data.next !== null) {
      // getUsers(result.data.next);
      return getUsers(result.data.next);
    }
    return users.filter(user => {
      return user.email === email;
    });
  };
  let x = await getUsers(`${process.env.REACT_APP_API_URL}/api/v1/users/`);
  return x[0];
};

export { sendEmail, saveNewUser, getLoginToken, getUserByEmail, passwordReset };
