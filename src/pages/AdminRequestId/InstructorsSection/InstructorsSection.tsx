import React, { useEffect, useContext } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { SingleRequestContext } from '../../../contexts';
import swal from 'sweetalert';
import './InstructorsSection.scss';
import { PERFIL_OPERACIONES } from '../../../utils/constants';

interface InstructorsProps {
  requestId: number;
}

const InstructorsSection: React.FC<InstructorsProps> = ({ requestId }) => {
  const {
    getRequestInstructors,
    requestInstructors,
    loadingInstructors,
    deleteRequestInstructor,
    currentRequest
  } = useContext(SingleRequestContext);

  const fetchRequestInstructors = async () => await getRequestInstructors(requestId);

  const handleDeleteRequestInstructor = (instructor) => {
    swal({
      title: 'Importante',
      text: `Estas segur@ que quieres borrar a ${instructor.instructors.email} de esta solicitud?`,
      icon: 'warning',
      buttons: ['Cancelar', 'Borrar'],
      dangerMode: true
    }).then(async (willDelete) => {
      if (willDelete && instructor.id) {
        await deleteRequestInstructor(instructor.id, requestId);
      }
    });
  };

  useEffect(() => {
    fetchRequestInstructors();
    //eslint-disable-next-line
  }, [requestId]);

  if (loadingInstructors) {
    return <Spinner animation="border" />;
  }
  return (
    <Table bordered hover size="sm" className="mb-0 instructors-table-admin">
      <thead>
        <tr className="border-0 bg-primary">
          <th className="text-white">ID</th>
          <th className="text-white">Nombre</th>
          <th className="text-white">Apellido</th>
          <th className="text-white">Email</th>
          <th className="text-white">Teléfono</th>
          <th className="text-white">Ciudad</th>
          <th className="text-white">Tarifa</th>
          <th className="text-white">Primer pago</th>
          {currentRequest?.status?.step <
            PERFIL_OPERACIONES.steps.STATUS_ESPERANDO_AL_CLIENTE.step && (
            <th className="text-white">Borrar</th>
          )}
        </tr>
      </thead>
      <tbody>
        {requestInstructors.map((item, idx) => (
          <tr key={idx}>
            <td>{item?.instructors?.official_id}</td>
            <td className="text-capitalize">{item?.instructors?.first_name}</td>
            <td className="text-capitalize">{item?.instructors?.last_name}</td>
            <td className="text-primary font-weight-bold">{item?.instructors?.email}</td>
            <td>{item?.instructors?.cellphone}</td>
            <td className="text-capitalize">{item?.instructors?.municipality?.name}</td>
            <td className="tarifa-cell">{Number(item?.fare).toLocaleString('es')}</td>
            <td className="tarifa-cell">{Number(item?.first_payment).toLocaleString('es')}</td>
            {currentRequest?.status?.step <
              PERFIL_OPERACIONES.steps.STATUS_ESPERANDO_AL_CLIENTE.step && (
              <td>
                <span role="button" onClick={() => handleDeleteRequestInstructor(item)}>
                  <FaTrash />
                </span>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default InstructorsSection;
