import React, { createContext, useState } from "react";

export const RequestsContext = createContext();

const RequestsContextProvider = (props) => {
  const [requestsInfoContext, setRequestsInfoContext] = useState([]);

  return (
    <RequestsContext.Provider
      value={{
        requestsInfoContext,
        setRequestsInfoContext,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};

export default RequestsContextProvider;
