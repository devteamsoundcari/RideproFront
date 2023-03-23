import React, { useContext, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router';
import { AdminRequestId, ClientRequestId } from '../../components/organisms';
import { AuthContext, SingleRequestContext } from '../../contexts';
import { PERFIL_CLIENTE } from '../../utils/constants';

export interface IRequestIdProps {}

export function RequestId(props: IRequestIdProps) {
  const { requestId } = useParams() as any;
  const { getSingleRequest, loadingRequest, getRequestDocuments } =
    useContext(SingleRequestContext);
  const { userInfo } = useContext(AuthContext) as any;

  const fetchRequest = async (id: string) => {
    try {
      await getSingleRequest(id);
      await getRequestDocuments(id); // Load documents to have them ready
    } catch (error) {
      throw new Error('Error getting the request');
    }
  };

  useEffect(() => {
    fetchRequest(requestId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  // ============ Listening Socket==================
  useEffect(() => {
    let token = localStorage.getItem('token');
    let requestsSocket = new WebSocket(`${process.env.REACT_APP_SOCKET_URL}?token=${token}`);
    requestsSocket.addEventListener('open', () => {
      let payload = {
        action: 'subscribe_to_requests',
        request_id: userInfo.id
      };
      requestsSocket.send(JSON.stringify(payload));
    });
    requestsSocket.onmessage = async function (event) {
      let data = JSON.parse(event.data);
      if (data?.data?.id === parseInt(requestId)) {
        fetchRequest(data.data.id);
      }
    };
    // eslint-disable-next-line
  }, []);

  if (loadingRequest) {
    return <Spinner animation="border" />;
  } else if (userInfo.profile === PERFIL_CLIENTE.profile) {
    return <ClientRequestId />;
  } else {
    return <AdminRequestId />;
  }
}
