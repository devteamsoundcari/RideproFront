import axios from "axios";

const setAuthorizationToken = async (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["Access-Control-Allow-Origin"];
  }
};

export default setAuthorizationToken;
