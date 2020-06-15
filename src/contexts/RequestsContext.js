import React, { createContext, useState } from "react";

export const RequestsContext = createContext();

const RequestsContextProvider = (props) => {
  const [requestsInfoContext, setRequestsInfoContext] = useState([]);
  const [canceledRequestContext, setCanceledRequestContext] = useState([]);

  return (
    <RequestsContext.Provider
      value={{
        requestsInfoContext,
        setRequestsInfoContext,
        canceledRequestContext,
        setCanceledRequestContext,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};

export default RequestsContextProvider;
