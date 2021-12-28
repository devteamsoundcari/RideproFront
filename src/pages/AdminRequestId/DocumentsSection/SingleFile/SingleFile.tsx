import React, { useState, useEffect, useContext } from 'react';
import swal from 'sweetalert';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext, SingleRequestContext } from '../../../../contexts';
import { dateFromNow } from '../../../../utils';
import './SingleFile.scss';
import { PERFIL_OPERACIONES } from '../../../../utils/constants';
import { FileIcon } from '../../../../components/atoms';

type SingleFileProps = any;

const SingleFile: React.FC<SingleFileProps> = ({ document, requestId, onUpdate }) => {
  const [doc, setDoc] = useState<any>('');
  const [fileName, setFileName] = useState('Vacio');
  const [loading, setLoading] = useState(false);
  const [truncate, setTruncate] = useState(true);
  const { userInfo } = useContext(AuthContext);
  const { uploadDocument } = useContext(SingleRequestContext);

  useEffect(() => {
    setDoc(document);
  }, [document]);

  const onFileUpload = (e: any) => {
    let uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setLoading(true);
      setFileName(uploadedFile.name);
      uploadDocument(requestId, doc?.id, doc?.document?.id, uploadedFile).then(async (result) => {
        if (result.status === 200) {
          setLoading(false);
          swal('Buen trabajo!', 'Carga exitosa!', 'success');
          onUpdate();
        }
      });
    } else {
      swal('Oops!', 'Sólo se permite formato .pdf', 'error');
    }
  };

  const renderFileName = () => {
    let name = doc?.file.split('/');
    name = name[name.length - 1];
    return name;
  };

  if (doc) {
    return (
      <Card className="single-file mt-2">
        <Card.Body>
          <Card.Title>
            {doc?.document?.name} {loading && <Spinner animation="border" size="sm" />}
            <Button
              variant="link"
              size="sm"
              className="p-0 m-0 m-auto"
              onClick={() => setTruncate(!truncate)}>
              {truncate ? <FaEye /> : <FaEyeSlash />}
            </Button>
          </Card.Title>
          <Card.Text className={`${truncate ? 'col-12 text-truncate' : ''}  mb-0`}>
            {doc?.document?.description}
          </Card.Text>
        </Card.Body>
        {doc?.file && <FileIcon loading={loading} file={doc.file} />}
        <Form className="m-2">
          <Form.File
            id={`custom-file-${doc?.id}`}
            label={doc?.file ? renderFileName() : fileName}
            custom
            disabled={userInfo.profile !== PERFIL_OPERACIONES.profile}
            onChange={onFileUpload}
          />
        </Form>
        <Card.Footer>
          Actualización:
          <small className="text-muted">{dateFromNow(doc?.document?.updated_at)}</small>
        </Card.Footer>
      </Card>
    );
  } else {
    return <small>Loading...</small>;
  }
};
export default SingleFile;
