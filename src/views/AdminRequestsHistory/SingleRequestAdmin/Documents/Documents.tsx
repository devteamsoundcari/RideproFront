import React, { useEffect, useState } from "react";
import { CardDeck, Row, Col } from "react-bootstrap";
import { getRequestInstructors } from "../../../../controllers/apiRequests";
import "./Documents.scss";
import SingleFile from "./SingleFile/SingleFile";

type DocumentsProps = any;

const Documents: React.FC<DocumentsProps> = ({ requestId, documentsOk }) => {
  const [requestDocuments, setRequestDocuments] = useState<any>([]);
  // ================================ FETCH REQUEST INSTRUCTORS ON LOAD =====================================================
  const fetchRequestInstructors = async (url) => {
    const response = await getRequestInstructors(url);
    setRequestDocuments((oldArr) => [...oldArr, response.results]);
    if (response.next) {
      return await fetchRequestInstructors(response.next);
    }
  };
  useEffect(() => {
    fetchRequestInstructors(
      `${process.env.REACT_APP_API_URL}/api/v1/request_doc/?request=${requestId}`
    );
    //eslint-disable-next-line
  }, [requestId]);

  useEffect(() => {
    let arr = requestDocuments.filter((item) => item.file === null);
    if (arr.length === 0) {
      documentsOk(true);
    } else {
      documentsOk(false);
    }
  }, [requestDocuments, documentsOk]);

  return (
    <div className="card-body pt-0 mx-25 documents-section">
      <Row>
        <Col>
          <h6>DOCUMENTOS</h6>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={12}>
          <CardDeck>
            {requestDocuments.map((document: any, idx) => {
              return (
                <SingleFile
                  document={document}
                  key={idx}
                  requestId={requestId}
                  onUpdate={() =>
                    fetchRequestInstructors(
                      `${process.env.REACT_APP_API_URL}/api/v1/request_doc/?request=${requestId}`
                    )
                  }
                />
              );
            })}
          </CardDeck>
        </Col>
      </Row>
    </div>
  );
};
export default Documents;
