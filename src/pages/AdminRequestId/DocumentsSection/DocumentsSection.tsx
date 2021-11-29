import React, { useEffect, useContext } from 'react';
import { CardDeck, Row, Col } from 'react-bootstrap';
import SingleFile from './SingleFile/SingleFile';
import { SingleRequestContext } from '../../../contexts/';
import './DocumentsSection.scss';

type DocumentsProps = any;

const DocumentsSection: React.FC<DocumentsProps> = ({
  requestId,
  setDocumentsOk
}) => {
  const { getRequestDocuments, requestDocuments } =
    useContext(SingleRequestContext);

  const fetchRequestDocuments = async () =>
    await getRequestDocuments(requestId);

  useEffect(() => {
    fetchRequestDocuments();
    //eslint-disable-next-line
  }, [requestId]);

  useEffect(() => {
    let arr = requestDocuments.filter((item) => item.file === null);
    if (arr.length === 0) {
      setDocumentsOk(true);
    } else {
      setDocumentsOk(false);
    }
  }, [requestDocuments, setDocumentsOk]);

  return (
    <div className="card-body pt-0 mx-25 documents-section">
      <Row>
        <Col>
          <h6>DOCUMENTOS REQUERIDOS</h6>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={12}>
          <CardDeck>
            {requestDocuments?.map((document: any, idx) => {
              return (
                <SingleFile
                  document={document}
                  key={idx}
                  requestId={requestId}
                  onUpdate={() => fetchRequestDocuments()}
                />
              );
            })}
          </CardDeck>
        </Col>
      </Row>
    </div>
  );
};
export default DocumentsSection;
