import React, { useContext, useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { useProfile } from '../../../utils';
import { DocumentsContext } from '../../../contexts';

export interface IModalAddNewDocumentProps {
  handleClose: () => void;
}

export function ModalAddNewDocument({ handleClose }: IModalAddNewDocumentProps) {
  const [profile] = useProfile();
  const { register, handleSubmit, errors } = useForm();
  const [filename, setFilename] = useState<any>('');
  const {
    loadingDocuments,

    createDocument
  } = useContext(DocumentsContext);

  const onSubmit = async (data) => {
    data['template'] = filename;
    try {
      const response = await createDocument(data);
      if (response) {
        swal('Perfecto!', `${data.name} fue registrado existosamente`, 'success');
        handleClose();
      }
    } catch (error) {
      swal('Oops!', 'No se pudo registrar el documento', 'error');
    }
  };

  return (
    <Modal show={true} onHide={handleClose} size="sm">
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Nuevo documento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="formGridDocument">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="name" ref={register({ required: true })} />
            {errors.name && <small className="text-danger">El nombre es obligatorio</small>}
          </Form.Group>

          <Form.Group controlId="formGridtemplate">
            <Form.Label>Plantilla</Form.Label>
            <Form.File
              id="custom-file"
              type="file"
              label={filename ? filename.name : ''}
              custom
              name="template"
              ref={register({ required: true })}
              onChange={(e) => setFilename(e.target.files[0])}
            />
            {errors.template && <small className="text-danger">La plantilla es obligatoria</small>}
          </Form.Group>

          <Form.Group controlId="docDescription">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" name="description" ref={register({ required: true })} />
            {errors.description && (
              <small className="text-danger">La descripción es obligatoria</small>
            )}
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button variant="primary" type="submit">
              {loadingDocuments ? (
                <Spinner animation="border" role="status" size="sm">
                  <span className="sr-only">Cargando...</span>
                </Spinner>
              ) : (
                'Registrar'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
