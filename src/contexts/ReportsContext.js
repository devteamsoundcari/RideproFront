import React, { createContext, useState } from 'react';

export const ReportsContext = createContext();

export const ReportsContextProvider = (props) => {
  const [reportsInfoContext, setReportsInfoContext] = useState([]);

  return (
    <ReportsContext.Provider
      value={{
        reportsInfoContext,
        setReportsInfoContext
      }}>
      {props.children}
    </ReportsContext.Provider>
  );
};
