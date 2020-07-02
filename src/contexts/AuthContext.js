import React, { createContext, useState } from "react";
import { getUserInfo } from "../controllers/apiRequests";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isLoggedInContext, setIsLoggedInContext] = useState(false);
  const [userInfoContext, setUserInfoContext] = useState({});

  const updateUserInfo = async () => {
    let newUserInfo = await getUserInfo();
    newUserInfo.name = newUserInfo.first_name;
    newUserInfo.lastName = newUserInfo.last_name;
    newUserInfo.first_name = null;
    newUserInfo.last_name = null;
    newUserInfo.perfil =
      newUserInfo.profile === 1
        ? "admin"
        : newUserInfo.profile === 2
        ? "cliente"
        : newUserInfo.profile === 3
        ? "operario"
        : "";

    setUserInfoContext(newUserInfo);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfoContext,
        setUserInfoContext,
        isLoggedInContext,
        setIsLoggedInContext,
        updateUserInfo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
