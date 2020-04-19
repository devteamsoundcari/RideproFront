import React, { createContext, useState } from "react";

export const ServiceContext = createContext();

const ServiceContextProvider = (props) => {
  const [serviceInfoContext, setServiceInfoContext] = useState({});

  return (
    <ServiceContext.Provider
      value={{
        serviceInfoContext,
        setServiceInfoContext,
      }}
    >
      {props.children}
    </ServiceContext.Provider>
  );
};

export default ServiceContextProvider;
