import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Container, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import BootstrapTable, { SelectRowProps } from "react-bootstrap-table-next";
import filterFactory from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import ModalNewTrack from "./ModalNewTrack/ModalNewTrack";
import { TrackEditModal } from "./TrackEditModal";
import { getTracks } from "../../controllers/apiRequests";
import { AuthContext } from "../../contexts/AuthContext";
import { FaExternalLinkAlt } from "react-icons/fa";
import "./Tracks.scss";

export interface Track {
  id: number;
  name: string;
  address: string;
  fare: number;
  description: string;
  municipality: any;
  company: any;
  cellphone: string;
  contactName: string;
  contactEmail: string;
  latitude: string;
  longitude: string;
  pictures: string;
}

const Tracks: React.FC = () => {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showTrackEditModal, setShowTrackEditModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const { userInfoContext } = useContext(AuthContext);
  const location = useLocation();

  const formatLocation = (cell, row) => {
    if (cell !== "4.681475271707987") {
      return (
        <a
          className="m-0 p-0 track-link"
          target="n_blank"
          href={`https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`}
        >
          Ver <FaExternalLinkAlt />
        </a>
      );
    } else {
      return "---";
    }
  };

  const fields = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "name",
      text: "Nombre",
    },
    {
      dataField: "municipality.department.name",
      text: "Departamento",
      sort: true,
    },
    {
      dataField: "municipality.name",
      text: "Ciudad",
      sort: true,
    },
    {
      dataField: "address",
      text: "Dirección",
    },
    {
      dataField: "latitude",
      text: "Ubicación",
      formatter: formatLocation,
    },
  ];

  const selectRow: SelectRowProps<any> = {
    mode: "radio",
    clickToSelect: true,
    hideSelectColumn: true,
    bgColor: "lightgreen",
    onSelect: (row) => {
      setSelectedTrack(row);
      setTrackData(row);
      setShowTrackEditModal(true);
    },
  };

  const setTrackData = (row: any) => {
    const track: Track = row;
    track.contactName = row.contact_name;
    track.contactEmail = row.contact_email;

    setSelectedTrack(track);
  };

  const updateTrackInfo = (track: Track) => {
    let newTracks = [...tracks];
    let index = newTracks.findIndex((t) => t.id === track.id);
    if (index >= 0) {
      newTracks[index] = track;
    }

    setTracks(newTracks);
  };

  useEffect(() => {
    if (location.state !== undefined) {
      setShowAddTrack(true);
    }
  }, [location]);

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
    fetchTracks(
      `${process.env.REACT_APP_API_URL}/api/v1/tracks/?company=${userInfoContext.company.id}`
    );
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    tracks.forEach((item) => {
      if (userInfoContext.company.id === item.company.id) {
        setFilteredTracks((oldArr: any) => [...oldArr, item]);
      }
    });
  }, [tracks, userInfoContext.company.id]);

  const handleFetch = () => {
    setFilteredTracks([]);
    fetchTracks(
      `${process.env.REACT_APP_API_URL}/api/v1/tracks/?company=${userInfoContext.company.id}`
    );
  };

  return (
    <Container fluid="md">
      <Row style={{ overflow: "hidden" }}>
        <Col>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 border-bottom">
            {/* <h1 className="h2">Mis pistas</h1> */}
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
          <Row className="p-3 tracks">
            <Card>
              {filteredTracks.length === 0 ? (
                <p className="text-muted p-5 m-auto">
                  Aqui podras administrar tus pistas. Por el momento no tienes
                  ninguna
                  <br />
                  Haz click en el boton "Agregar pista" para crear una nueva
                  pista.
                </p>
              ) : (
                <BootstrapTable
                  bootstrap4
                  keyField="id"
                  data={tracks}
                  columns={fields}
                  selectRow={selectRow}
                  filter={filterFactory()}
                  pagination={paginationFactory()}
                  rowClasses={"track-row"}
                />
              )}
            </Card>
          </Row>
        </Col>
        {showAddTrack && (
          <ModalNewTrack
            handleClose={() => setShowAddTrack(false)}
            fetchTracks={handleFetch}
          />
        )}
        {showTrackEditModal && selectedTrack && (
          <TrackEditModal
            onHide={() => setShowTrackEditModal(false)}
            onTrackUpdate={updateTrackInfo}
            track={selectedTrack}
          />
        )}
      </Row>
    </Container>
  );
};

export default Tracks;
