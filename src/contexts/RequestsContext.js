import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getUserRequests, fetchDriver } from "../controllers/apiRequests";

export const RequestsContext = createContext();

const RequestsContextProvider = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [loadingContext, setLoadingContext] = useState(true);
  const [requestsInfoContext, setRequestsInfoContext] = useState([]);
  const [canceledRequestContext, setCanceledRequestContext] = useState([]);

  async function fetchRequests(url) {
    const response = await getUserRequests(url);
    response.results.map(async (item) => {
      // ================= GETTING CANCELING DATE ====================
      let cancelDate = new Date(item.start_time);
      cancelDate.setDate(cancelDate.getDate() - 1);
      item.cancelDate = cancelDate;

      item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
      item.start = new Date(item.start_time);
      item.end = new Date(item.finish_time);

      // =========== GETTING INFO OF EACH DRIVER =================
      getDrivers(item.drivers).then((data) => {
        item.drivers = data;

        if (item.status.step === 0) {
          setCanceledRequestContext((prev) => [...prev, item]);
        } else {
          setRequestsInfoContext((prev) => [...prev, item]);
        }
      });
      setLoadingContext(false);
      return true;
    });
    if (response.next) {
      setLoadingContext(true);
      return await fetchRequests(response.next);
    }
  }

  const getDrivers = async (driversIds) => {
    return Promise.all(driversIds.map((id) => fetchDriver(id)));
  };

  const updateRequestsContex = () => {
    let urlType = userInfoContext.profile === 2 ? "user_requests" : "requests";
    setRequestsInfoContext([]);
    setCanceledRequestContext([]);
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/${urlType}/`);
  };

  return (
    <RequestsContext.Provider
      value={{
        requestsInfoContext,
        setRequestsInfoContext,
        canceledRequestContext,
        setCanceledRequestContext,
        updateRequestsContex: updateRequestsContex,
        loadingContext,
        setLoadingContext,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};

export default RequestsContextProvider;
