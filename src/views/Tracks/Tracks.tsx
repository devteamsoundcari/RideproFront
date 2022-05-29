import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Card, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { SelectRowProps } from 'react-bootstrap-table-next';
import ModalNewTrack from './ModalNewTrack/ModalNewTrack';
import { TrackEditModal } from './TrackEditModal';
import { AuthContext } from '../../contexts/AuthContext';
import { FaExternalLinkAlt } from 'react-icons/fa';
import './Tracks.scss';
import { PaginationTable } from '../PaginationTable/PaginationTable';
import { TracksContext } from '../../contexts/TracksContext';

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

const SIZE_PER_PAGE = 25;

const Tracks: React.FC = () => {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showTrackEditModal, setShowTrackEditModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const { userInfoContext } = useContext(AuthContext);
  const {
    getTracks,
    tracks,
    loadingTracks,
    totalTracks,
    currentPage,
    getSearchTracks
  } = useContext(TracksContext);
  const location = useLocation();
  const defaultImage = require('../../assets/img/track.jpg');

  const formatLocation = (cell, row) => {
    if (cell !== '4.681475271707987') {
      return (
        <a
          className="m-0 p-0 track-link"
          target="n_blank"
          href={`https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`}>
          Ver <FaExternalLinkAlt />
        </a>
      );
    } else {
      return '---';
    }
  };

  const formatImg = (cell) => {
    return (
      <div
        style={{
          background: `url(${
            cell ? cell : defaultImage
          }) no-repeat center center`,
          backgroundSize: 'cover',
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          margin: 'auto'
        }}></div>
    );
  };

  const fields = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true
    },
    {
      dataField: 'pictures',
      text: 'Img',
      formatter: formatImg,
      headerStyle: {
        width: '5rem'
      },
      style: {
        padding: '5px 0px'
      }
    },
    {
      dataField: 'name',
      text: 'Nombre'
      // filter: textFilter()
    },
    {
      dataField: 'municipality.department.name',
      text: 'Departamento',
      // filter: textFilter(),
      sort: true
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      // filter: textFilter(),
      sort: true
    },
    {
      dataField: 'address',
      text: 'Dirección'
    },
    {
      dataField: 'latitude',
      text: 'Ubicación',
      formatter: formatLocation
    }
  ];

  const selectRow: SelectRowProps<any> = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    // @ts-ignore
    bgColor: 'lightgreen',
    onSelect: (row) => {
      setSelectedTrack(row);
      setTrackData(row);
      setShowTrackEditModal(true);
    }
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
  };

  useEffect(() => {
    if (location.state !== undefined) {
      setShowAddTrack(true);
    }
  }, [location]);

  // ================================ FETCH TRACKS ON LOAD =====================================================

  useEffect(() => {
    getTracks(1);
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
    getTracks(1);
  };

  const handlePageChange = (page) => {
    getTracks(page);
  };

  return (
    <Container fluid="md">
      <Row style={{ overflow: 'hidden' }} className="mb-5">
        <Col>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 border-bottom">
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                <button
                  onClick={() => setShowAddTrack(true)}
                  className="btn btn-success my-2">
                  Agregar pista
                </button>
                {loadingTracks && <Spinner animation="border" size="sm" />}
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
                <PaginationTable
                  onTableSearch={(text) => getSearchTracks(text)}
                  columns={fields}
                  data={tracks.slice(
                    (currentPage - 1) * SIZE_PER_PAGE,
                    (currentPage - 1) * SIZE_PER_PAGE + SIZE_PER_PAGE
                  )}
                  page={currentPage}
                  sizePerPage={SIZE_PER_PAGE}
                  totalSize={totalTracks}
                  onPageChange={(page) => handlePageChange(page)}
                  onRowClick={selectRow}
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
