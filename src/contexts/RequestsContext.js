import React, { useCallback, useEffect, createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { getUserRequests, getRequest } from "../controllers/apiRequests";

export const RequestsContext = createContext();

const RequestsContextProvider = (props) => {
  const { userInfoContext } = useContext(AuthContext);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [requests, setRequests] = useState([]);
  const [cancelledRequests, setCancelledRequests] = useState([]);
  const requestsRef = React.useRef(requests);

  async function fetchRequests(url) {
    const fetchedRequests = [];
    const fetchedCancelledRequests = [];
    const response = await getUserRequests(url);
    response.results.map(async (item) => {
      let cancelDate = new Date(item.start_time);
      cancelDate.setDate(cancelDate.getDate() - 1);
      item.cancelDate = cancelDate;

      item.title = `${item.service.name}, ${item.place} - ${item.municipality.name} (${item.municipality.department.name})`;
      item.start = new Date(item.start_time);
      item.end = new Date(item.finish_time);

      if (item.status.step === 0) {
        fetchedCancelledRequests.push(item);
      } else {
        fetchedRequests.push(item);
      }
    });
    setRequests((prev) => [...prev, ...fetchedRequests]);
    setCancelledRequests((prev) => [...prev, ...fetchedCancelledRequests]);

    if (response.next !== null) {
      setIsLoadingRequests(true);
      return await fetchRequests(response.next);
    } else {
      setIsLoadingRequests(false);
    }
  }

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  const updateRequests = () => {
    let urlType = userInfoContext.profile === 2 ? "user_requests" : "requests";
    setRequests([]);
    setCancelledRequests([]);
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/${urlType}/`);
  };

  const updateRequestInfo = useCallback(async (id) => {
    let request = await getRequest(id);
    let requestsToEdit = [...requestsRef.current];
    if (request) {
      let instanceIndex = requestsToEdit.findIndex((request) => request.id === id);
      if (instanceIndex >= 0) {
        let cancelDate = new Date(request.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        request.cancelDate = cancelDate;

        request.title = `${request.service.name}, ${request.place} - ${request.municipality.name} (${request.municipality.department.name})`;
        request.start = new Date(request.start_time);
        request.end = new Date(request.finish_time);

        requestsToEdit[instanceIndex] = request;
      }
    }
    setRequests(requestsToEdit);
  }, []);

  useEffect(() => {
    if (!isLoadingRequests) {
      let token = localStorage.getItem("token");
      let requestsSocket = new WebSocket(
        `${process.env.REACT_APP_SOCKET_URL}?token=${token}`
      );

      requestsSocket.addEventListener("open", () => {
        let payload = {
          action: "subscribe_to_requests",
          request_id: userInfoContext.id,
        };
        requestsSocket.send(JSON.stringify(payload));
      });

      requestsSocket.onmessage = async function (event) {
        let data = JSON.parse(event.data);
        await updateRequestInfo(data.data.id);
      };
    }
  }, [isLoadingRequests, userInfoContext.id, updateRequestInfo]);

  return (
    <RequestsContext.Provider
      value={{
        requests,
        setRequests,
        cancelledRequests,
        setCancelledRequests,
        updateRequests,
        updateRequestInfo,
        isLoadingRequests
      }}
    >
      {props.children}
    </RequestsContext.Provider>
  );
};

export default RequestsContextProvider;
