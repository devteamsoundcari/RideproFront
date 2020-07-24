import React, { useEffect, useState, useContext, useRef } from "react";
import { Toast } from "react-bootstrap";
import { RequestsContext } from "../../contexts/RequestsContext";
import "./RequestToast.scss";

interface RequestToastProps {
  index: number;
  id: number;
  status: {
    name: string;
    color: string;
  };
  onClose: () => void;
  show: boolean;
  delay: number;
}

const RequestToast: React.FC<RequestToastProps> = (
  props: RequestToastProps
) => {
  return (
    <Toast
      key={props.index}
      onClose={props.onClose}
      show={props.show}
      delay={props.delay}
      autohide
    >
      <Toast.Header closeButton closeLabel="Cerrar notificación">
        <strong className="mr-auto">Actualización</strong>
      </Toast.Header>
      <Toast.Body>
        La solicitud {props.id} ha sido actualizada con el estado{" "}
        <strong
          style={{
            backgroundColor: `black`,
            color: props.status.color,
          }}
        >
          <i>{props.status.name}</i>
        </strong>
        .
      </Toast.Body>
    </Toast>
  );
};

interface RequestStatus {
  index: number;
  id: number;
  status: {
    name: string;
    color: string;
  };
  show: boolean;
}

export const RequestToastContainer: React.FC = () => {
  const { statusNotifications } = useContext(RequestsContext);
  const [requests, setRequests] = useState<RequestStatus[]>([]);
  const requestsRef = useRef<any[]>([]);

  const requestToasts = () => {
    return requests.map((request) => {
      return (
        <RequestToast
          index={request.index}
          key={request.index}
          id={request.id}
          status={request.status}
          show={request.show}
          onClose={() => closeToast(request.index)}
          delay={10000}
        ></RequestToast>
      );
    });
  };

  const closeToast = (index: number) => {
    let newRequests = [...requestsRef.current];
    let i = newRequests.findIndex((request) => {
      return request.index === index;
    });
    if (i >= 0) {
      newRequests[i].show = false;
      setTimeout(() => {
        newRequests = newRequests.filter((r) => {
          return r.index !== index;
        });
        setRequests(newRequests);
      }, 500);
    }
  };

  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  useEffect(() => {
    if (statusNotifications.length > 0) {
      let lastRequestInfo = statusNotifications.slice(-1)[0];
      let notification = {
        index: statusNotifications.length,
        id: lastRequestInfo.id,
        status: {
          name: lastRequestInfo.newStatus.name,
          color: lastRequestInfo.newStatus.color,
        },
        show: true,
      };

      setRequests((prev) => [notification, ...prev]);
    }
  }, [statusNotifications]);

  return (
    <>
      <div
        className="request-toast-overlay"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="request-toast-container">{requestToasts()}</div>
      </div>
    </>
  );
};

export default RequestToastContainer;
