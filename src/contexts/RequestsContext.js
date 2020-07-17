import React, { useEffect, createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getUserRequests, getRequest } from "../controllers/apiRequests";

export const RequestsContext = createContext();

const RequestsContextProvider = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [loadingContext, setLoadingContext] = useState(true);
  const [requestsInfoContext, setRequestsInfoContext] = useState([]);
  const [canceledRequestContext, setCanceledRequestContext] = useState([]);

  async function fetchRequests(url) {
    const response = await getUserRequests(url);
    setRequestsInfoContext([]);
    setCanceledRequestContext([]);
    if (response.count === 0) {
      setLoadingContext(false);
      return;
    } 

    response.results.map(async (item) => { 
      // ================= GETTING CANCELING DATE ====================
      let cancelDate = new Date(item.start_time);
      cancelDate.setDate(cancelDate.getDate() - 1);
      item.cancelDate = cancelDate;

      item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
      item.start = new Date(item.start_time);
      item.end = new Date(item.finish_time);

      if (item.status.step === 0) {
        setCanceledRequestContext((prev) => [...prev, item]);
      } else {
        setRequestsInfoContext((prev) => [...prev, item]);
      }
      setLoadingContext(false);
      if (response.next) {
        setLoadingContext(true);
        return await fetchRequests(response.next);
      }
    });
  };

  const updateRequestsContext = () => {
    let urlType = userInfoContext.profile === 2 ? "user_requests" : "requests";
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/${urlType}/`);
  };

  const updateRequestInfo = async (id) => {
    let request = await getRequest(id);
    let requests = [...requestsInfoContext];
    if (request) {
      let instanceIndex = requests.findIndex((request) => request.id === id);
      if (instanceIndex) {
        let cancelDate = new Date(request.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        request.cancelDate = cancelDate;

        request.title = `${request.service.name}, ${request.place} - ${request.municipality.name} (${request.municipality.department.name})`;
        request.start = new Date(request.start_time);
        request.end = new Date(request.finish_time);

        requests[instanceIndex] = request;
      }
    }
    setRequestsInfoContext(requests);
  }

  return (
    <RequestsContext.Provider
      value={{
        requestsInfoContext,
        setRequestsInfoContext,
        canceledRequestContext,
        setCanceledRequestContext,
        updateRequestsContext: updateRequestsContext,
        updateRequestInfo,
        loadingContext,
        setLoadingContext,
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};

export default RequestsContextProvider;
