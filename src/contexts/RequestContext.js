import React, { createContext, useState } from "react";

export const RequestContext = createContext();

const RequestContextProvider = (props) => {
  const [requestInfoContext, setRequestInfoContext] = useState({});

  return (
    <RequestContext.Provider
      value={{
        requestInfoContext,
        setRequestInfoContext,
      }}
    >
      {props.children}
    </RequestContext.Provider>
  );
};

export default RequestContextProvider;
