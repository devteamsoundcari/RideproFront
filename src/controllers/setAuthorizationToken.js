import axios from "axios";

const setAuthorizationToken = async (token) => {
  if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Token ${token}`;
    // axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    // axios.defaults.headers.common["Access-Control-Allow-Credentials"] = "true";
    // axios.defaults.headers.common["Access-Control-Allow-Headers"] = "*";
    // axios.defaults.headers.common["Access-Control-Request-Methods"] =
    // ("GET,HEAD,OPTIONS,POST,PUT");
    // axios.defaults.headers.common["Access-Control-Request-Headers"] = "*";
  } else {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    // delete axios.defaults.headers.common["Access-Control-Allow-Origin"];
    // delete axios.defaults.headers.common["Access-Control-Allow-Headers"];
    // delete axios.defaults.headers.common["Access-Control-Request-Headers"];
    // delete axios.defaults.headers.common["Access-Control-Request-Method"];
  }
};

export default setAuthorizationToken;
