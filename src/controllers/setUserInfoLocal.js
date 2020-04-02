const setUserInfoLocal = data => {
  if (data) {
    localStorage.setItem("userInfo", JSON.stringify(data));
  } else {
    localStorage.removeItem("userInfo");
  }
};

export default setUserInfoLocal;
