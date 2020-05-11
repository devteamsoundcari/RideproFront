import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
// import { RequestContext } from "../../contexts/RequestContext";
import RequestCard from "./RequestCard/RequestCard";
import {
  Card,
  Row,
  Col,
  Table,
  ProgressBar,
  Accordion,
  Button,
  ButtonGroup,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import {
  getUserRequests,
  fetchDriver,
  cancelRequestId,
} from "../../controllers/apiRequests";
import "./RequestsHistory.scss";

const RequestsHistory = (props) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [updateList, setUpdateList] = useState(false);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [defaultKey] = useState(location.state ? location.state.id : 0);
  const { userInfoContext, setUserInfoContext } = useContext(AuthContext);

  // const { setRequestInfoContext } = useContext(RequestContext)

  const [renderCancelRequesModal, setRenderCancelRequestModal] = useState({
    show: false,
    item: null,
  });

  const handleCancelRequest = (item) => {
    setRenderCancelRequestModal({ show: true, item: item });
  };

  // =============== CANCELING THE REQUEST AND REFIND CREDITS ========================================================

  const cancelRequest = async () => {
    let data = {
      id: renderCancelRequesModal.item.id,
      company: renderCancelRequesModal.item.customer.company.id,
      refund_credits:
        renderCancelRequesModal.item.drivers.length *
          renderCancelRequesModal.item.service.ride_value +
        renderCancelRequesModal.item.customer.company.credit,
    };
    let res = await cancelRequestId(data);
    if (res.canceled.status === 200 && res.refund.status === 200) {
      setRequests([]);
      setRenderCancelRequestModal({ show: false });
      setUpdateList(!updateList);
      // SET COMPANY CONTEXT
      setUserInfoContext({
        ...userInfoContext,
        company: {
          ...userInfoContext.company,
          credit: res.refund.data.credit,
        },
      });
    } else {
      alert("No se pudo cancelar");
    }
  };

  // ================================ FETCH REQUESTS ON LOAD =====================================================

  useEffect(() => {
    async function fetchRequests(url) {
      const response = await getUserRequests(url);
      response.results.map(async (item) => {
        // ================= GETTING CANCELING DATE ====================
        let cancelDate = new Date(item.start_time);
        cancelDate.setDate(cancelDate.getDate() - 1);
        item.cancelDate = cancelDate;
        // =========== GETTING INFO OF EACH DRIVER =================
        getDrivers(item.drivers).then((data) => {
          item.drivers = data;
          setRequests((prev) => [...prev, item]);
        });
        return true;
      });
      if (response.next) {
        return await fetchRequests(response.next);
      }
    }
    fetchRequests(`${process.env.REACT_APP_API_URL}/api/v1/user_requests/`);
  }, [updateList]);

  const getDrivers = async (driversUrls) => {
    return Promise.all(driversUrls.map((url) => fetchDriver(url)));
  };

  // ========================================= LOADING SPINNER =====================================

  useEffect(() => {
    // Sorting requests so that the most recent goes on top
    if (requests.length > 1) {
      requests.sort((a, b) => {
        return a.id - b.id;
      });
      // setRequestInfoContext(requests.reverse());
      setSortedRequests(requests.reverse());
      // Show and hide spinner
      if (sortedRequests.length) {
        setLoading(false);
      }
    } else {
      setSortedRequests(requests);
      if (requests.length > 0) {
        setLoading(false);
      }
    }
    //eslint-disable-next-line
  }, [requests]);
  //  ========================================================================================
  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Historial de Solicitudes</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2"></div>
        </div>
      </div>
      {loading && (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )}
      {!loading && (
        <Accordion defaultActiveKey={defaultKey} className="RequestsHistory">
          {sortedRequests.map((item, index) => {
            return (
              <RequestCard
                key={index}
                index={index}
                request={item}
                handleCancelRequest={handleCancelRequest}
              />
            );
          })}
        </Accordion>
      )}

      {/* =========== CANCEL REQUEST MODAL =============== */}
      {renderCancelRequesModal.show && (
        <Modal
          size="sm"
          show={renderCancelRequesModal.show}
          onHide={() => setRenderCancelRequestModal({ show: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Advertencia</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Estas segur@ de que quieres cancelar esta solicitud de servicio?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setRenderCancelRequestModal({ show: false })}
            >
              No
            </Button>
            <Button
              variant="danger"
              // onClick={() => removeUserFromList(showRemoveUserModal.idx)}
              onClick={cancelRequest}
            >
              Si, estoy segur@
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default RequestsHistory;
