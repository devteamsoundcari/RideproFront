import React from 'react';
import ReactDOM from 'react-dom';
import {
  AuthContextProvider,
  // ServiceContextProvider,
  // ParticipantsContextProvider,
  RequestsContextProvider
  // ReportsContextProvider
} from './contexts';
import App from './App';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.scss';

ReactDOM.render(
  <AuthContextProvider>
    {/* <ServiceContextProvider> */}
    <RequestsContextProvider>
      {/* <ParticipantsContextProvider> */}
      {/* <ReportsContextProvider> */}
      <App />
      {/* </ReportsContextProvider> */}
      {/* </ParticipantsContextProvider> */}
    </RequestsContextProvider>
    {/* </ServiceContextProvider> */}
  </AuthContextProvider>,
  document.getElementById('root')
);
