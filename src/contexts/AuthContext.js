import React, { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isLoggedInContext, setIsLoggedInContext] = useState(false);
  const [userInfoContext, setUserInfoContext] = useState({});

  return (
    <AuthContext.Provider
      value={{
        userInfoContext,
        setUserInfoContext,
        isLoggedInContext,
        setIsLoggedInContext,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
