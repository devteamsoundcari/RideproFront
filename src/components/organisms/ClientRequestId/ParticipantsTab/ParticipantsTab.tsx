import React, { useContext } from 'react';
import { Button, Table } from 'react-bootstrap';
import { AuthContext, SingleRequestContext } from '../../../../contexts';
import SingleDriver from '../../AdminRequestId/DriversSection/SingleDriver/SingleDriver';

export interface IParticipantsTabProps {
  currentRequest: any;
}

export function ParticipantsTab({ currentRequest }: IParticipantsTabProps) {
  const { userInfo } = useContext(AuthContext);
  const { requestDrivers } = useContext(SingleRequestContext);

  return (
    <div>
      {currentRequest?.status?.step === 1 && userInfo.profile === 2 && requestDrivers ? (
        <React.Fragment>
          {/* <EditableTable
            size="sm"
            currentRequestSet={requestDrivers}
            fields={fields}
            onValidate={handleNewDriversValidation}
            onUpdate={handleAllDrivers}
            readOnly={true}
            readOnlyIf={isParticipantAlreadyRegistered}
            recordsForReplacing={driversForReplacing}
          /> */}
          {currentRequest?.status.step === 1 && (
            <Button
              variant="dark"
              //   onClick={saveDrivers}
              style={{ margin: 'auto' }}
              //   {...(!canSaveDrivers ? { disabled: 'true' } : {})}
            >
              Guardar
            </Button>
          )}
        </React.Fragment>
      ) : requestDrivers && requestDrivers.length > 0 ? (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              {currentRequest.status.step > 4 && (
                <React.Fragment>
                  <th className="text-white">Resultado</th>
                  <th className="text-white">Link</th>
                  <th className="text-white">Reporte</th>
                </React.Fragment>
              )}
            </tr>
          </thead>
          <tbody>
            {requestDrivers.length &&
              requestDrivers.map((driver, idx) => {
                return <SingleDriver driver={driver} key={idx} requestId={currentRequest.id} />;
              })}
          </tbody>
        </Table>
      ) : (
        ''
      )}
    </div>
  );
}
