import React from 'react';
import ReactDOM from 'react-dom';
import {
  AuthContextProvider,
  // ServiceContextProvider,
  // ParticipantsContextProvider,
  SingleRequestContextProvider,
  RequestsContextProvider,
  TracksContextProvider,
  InstructorsContextProvider
  // ReportsContextProvider
} from './contexts';
import App from './App';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.scss';

ReactDOM.render(
  <AuthContextProvider>
    <RequestsContextProvider>
      <InstructorsContextProvider>
        <TracksContextProvider>
          <SingleRequestContextProvider>
            <App />
          </SingleRequestContextProvider>
        </TracksContextProvider>
      </InstructorsContextProvider>
    </RequestsContextProvider>
  </AuthContextProvider>,
  document.getElementById('root')
);
