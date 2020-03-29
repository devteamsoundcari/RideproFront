import axios from "axios";

/* =================================     SEND EMAIL    ===================================== */

const sendEmail = async data => {
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/sendEmail`,
    data
  });
  return true;
};

/* =================================     Add a user if not exist in db     ===================================== */

const saveNewUser = async data => {
  await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}/api/users`,
    headers: {
      token: process.env.REACT_APP_ZAFRA_KEY
    },
    data
  });
  return true;
};
export { sendEmail, saveNewUser };
