import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  CardColumns,
  Button,
} from "react-bootstrap";
import { FaTimesCircle, FaEdit } from "react-icons/fa";
import ModalNewTrack from "./ModalNewTrack/ModalNewTrack";
import { getTracks } from "../../controllers/apiRequests";
import { AuthContext } from "../../contexts/AuthContext";
import "./Tracks.scss";

interface Track {
  id: number;
  name: string;
  address: string;
  description: string;
  municipality: any;
  company: any;
}
type Tracks = Track[];

const Tracks: React.FC = () => {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [tracks, setTracks] = useState<Tracks>([]);
  const { userInfoContext } = useContext(AuthContext);

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async (url: string) => {
    let tempTracks: any = [];
    const response = await getTracks(url);
    response.results.forEach(async (item: any) => {
      tempTracks.push(item);
    });
    setTracks(tempTracks);
    if (response.next) {
      return await getTracks(response.next);
    }
  };
  useEffect(() => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
  }, []);

  const handleFetch = () => {
    fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
  };

  return (
    <Row>
      <Col>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">Mis pistas</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <button
                onClick={() => setShowAddTrack(true)}
                className="btn btn-success my-2"
              >
                Agregar pista
              </button>
            </div>
          </div>
        </div>
        <Row className="text-center tracks">
          <Container>
            {tracks.length === 0 && (
              <p className="text-muted p-5">
                Aqui podras administrar tus pistas. Por el momento no tienes
                ninguna
                <br />
                Haz click en el boton "Agregar pista" para crear una nueva
                pista.
              </p>
            )}
            <CardColumns>
              {tracks.map((item, idx) => {
                if (userInfoContext.company.id === item.company.id) {
                  return (
                    <Card key={idx}>
                      <FaTimesCircle />
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Img
                          variant="top"
                          src={require("../../assets/img/track.jpg")}
                          className="mb-3"
                        />
                        <Card.Text>{item.description}</Card.Text>
                      </Card.Body>
                      <Card.Footer>
                        {`${item.address}`}
                        <br />
                        {`${item.municipality.name} - ${item.municipality.department.name}`}
                        <br />
                        <Button variant="link">
                          <FaEdit />
                          editar
                        </Button>
                      </Card.Footer>
                    </Card>
                  );
                } else {
                  return "";
                }
              })}
            </CardColumns>
          </Container>
        </Row>
      </Col>
      {showAddTrack && (
        <ModalNewTrack
          handleClose={() => setShowAddTrack(false)}
          fetchTracks={handleFetch}
        />
      )}
    </Row>
  );
};

export default Tracks;
