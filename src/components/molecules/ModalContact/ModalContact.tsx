import React, { useState, useContext } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from '../../../contexts/AuthContext';
import { sendEmail } from '../../../controllers/apiRequests';
import { COMPANY_NAME, COMPANY_EMAIL } from '../../../utils/constants';
import swal from 'sweetalert';

type ModalContactProps = any;
export const ModalContact: React.FC<ModalContactProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const { userInfoContext } = useContext(AuthContext) as any;

  return (
    <>
      <Modal show={true} onHide={props.handleClose}>
        <Modal.Header closeButton className="text-center">
          <Modal.Title className="text-center">¿Te quedaste sin créditos?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          Si tu saldo de créditos es insuficiente podemos hacer que un operario de {COMPANY_NAME} se
          ponga en contacto contigo.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              const { email, credit, name, lastName, picture, perfil, company } = userInfoContext;
              setLoading(true);

              const payload = {
                emailType: 'moreCredit',
                subject: 'Cliente sin crédito ⚠️',
                email: COMPANY_EMAIL,
                name: `${name} ${lastName}`,
                credit,
                userEmail: email,
                picture,
                perfil,
                companyName: company.name
              };
              await sendEmail(payload);
              swal('Listo!', 'Pronto estaremos en contacto contigo!', 'success');
              setLoading(false);
              props.handleClose();
            }}>
            {loading ? <Spinner animation="border" /> : 'Si, contactarme'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
