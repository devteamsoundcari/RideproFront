import React from 'react';
import ReactDOM from 'react-dom';
import {
  AuthContextProvider,
  // ServiceContextProvider,
  // ParticipantsContextProvider,
  SingleRequestContextProvider,
  RequestsContextProvider,
  TracksContextProvider
  // ReportsContextProvider
} from './contexts';
import App from './App';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.scss';

ReactDOM.render(
  <AuthContextProvider>
    {/* <ServiceContextProvider> */}
    <RequestsContextProvider>
      {/* <ParticipantsContextProvider> */}
      {/* <ReportsContextProvider> */}
      <TracksContextProvider>
        <SingleRequestContextProvider>
          <App />
        </SingleRequestContextProvider>
      </TracksContextProvider>
      {/* </ReportsContextProvider> */}
      {/* </ParticipantsContextProvider> */}
    </RequestsContextProvider>
    {/* </ServiceContextProvider> */}
  </AuthContextProvider>,
  document.getElementById('root')
);
