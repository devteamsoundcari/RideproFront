import React, { createContext, useState, useEffect } from "react";
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

    setUserInfoContext(newUserInfo);
  }

  useEffect(() => {
    console.log(userInfoContext);
  }, [userInfoContext]);

  return (
    <AuthContext.Provider
      value={{
        userInfoContext,
        setUserInfoContext,
        isLoggedInContext,
        setIsLoggedInContext,
        updateUserInfo
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
