import axios from "axios";

const setAuthorizationToken = token => {
  if (token) {
    localStorage.setItem("jwtToken", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] =
      "http://localhost:3000";
  } else {
    localStorage.removeItem("jwtToken");
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["Access-Control-Allow-Origin"];
  }
};

export default setAuthorizationToken;
