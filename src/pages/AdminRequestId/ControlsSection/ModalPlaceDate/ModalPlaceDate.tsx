import React, { useState, useEffect, useContext } from 'react';
import swal from 'sweetalert';
import { TracksContext, SingleRequestContext, AuthContext } from '../../../../contexts/';
import { Modal, Button, Form } from 'react-bootstrap';
import './ModalPlaceDate.scss';
import { useProfile } from '../../../../utils';
import { FaPlus } from 'react-icons/fa';
import { Alternative } from './Alternatve/Alternative';
import { ModalNewTrack } from '../../../../components/molecules';

interface ModalPlaceDateProps {
  requestId: number;
  handleClose: () => void;
}
interface Track {
  id: number;
  name: string;
  address: string;
  description: string;
  municipality: any;
  company: any;
}
type Tracks = Track[];

const ModalPlaceDate: React.FC<ModalPlaceDateProps> = ({ requestId, handleClose }) => {
  const { setTracks, getTracksByCity, loadingTracks } = useContext(TracksContext);
  const { userInfo } = useContext(AuthContext);
  const {
    currentRequest,
    requestTrackOpt1,
    setRequestTrackOpt1,
    requestDateOpt1,
    setRequestDateOpt1,
    requestTrackOpt2,
    setRequestTrackOpt2,
    requestDateOpt2,
    setRequestDateOpt2,
    updateRequestId
  } = useContext(SingleRequestContext);
  const { getSingleRequest } = useContext(SingleRequestContext);
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [showModalTracks, setShowModalTracks] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);
  const [profile] = useProfile();
  const { track, municipality } = currentRequest;

  useEffect(() => {
    if (showAlternative) {
      if (track || (requestTrackOpt1 && requestTrackOpt2)) {
        if (requestDateOpt1 && requestDateOpt2) {
          setContinueDisabled(false);
        }
      } else {
        setContinueDisabled(true);
      }
    } else {
      if (track && requestDateOpt1 !== '') {
        setContinueDisabled(false);
      } else if (requestTrackOpt1 && requestDateOpt1) {
        setContinueDisabled(false);
      } else {
        setContinueDisabled(true);
      }
    }
  }, [
    track,
    currentRequest,
    showAlternative,
    requestDateOpt1,
    requestDateOpt2,
    requestTrackOpt1,
    requestTrackOpt2
  ]);

  // =============================== CLEAR TRACKS ====================================

  useEffect(() => {
    setTracks([]);
    if (municipality) getTracksByCity(municipality.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipality]);

  // =============================== CLICK ON ADD TRACK ====================================
  const handleClickAddTrack = () => {
    setShowModalTracks(true);
  };

  return (
    <Modal size="lg" show={true} onHide={handleClose} className="modal-admin-placedate">
      <Modal.Header className={`bg-${profile}`} closeButton>
        <Modal.Title className="text-white">Lugar / Fecha & Hora</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alternative
          option={1}
          department={municipality.department.name}
          city={municipality.name}
          placeOpt={requestTrackOpt1}
          setPlaceOpt={setRequestTrackOpt1}
          dateOpt={requestDateOpt1}
          setDateOpt={setRequestDateOpt1}
          track={track}
        />
        {(showAlternative || requestTrackOpt2) && (
          <>
            <br />
            <Alternative
              option={2}
              department={municipality.department.name}
              city={municipality.name}
              placeOpt={requestTrackOpt2}
              setPlaceOpt={setRequestTrackOpt2}
              dateOpt={requestDateOpt2}
              setDateOpt={setRequestDateOpt2}
              track={track}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!loadingTracks && !currentRequest.optional_date1 && !currentRequest.optional_date2 && (
          <Button
            className="position-absolute ml-3"
            style={{ left: 0 }}
            variant="link"
            size="sm"
            onClick={handleClickAddTrack}>
            <FaPlus /> Agregar una pista
          </Button>
        )}
        {!currentRequest.optional_date1 && !currentRequest.optional_date2 && (
          <Form.Check
            type="checkbox"
            id="alternative-checkbox"
            label="Alternativa 2"
            onChange={() => {
              setRequestTrackOpt2(null);
              setShowAlternative(!showAlternative);
            }}
          />
        )}
        <Button variant="secondary" className="ml-3" onClick={handleClose}>
          Cerrar
        </Button>
        {!currentRequest.optional_date1 && (
          <Button
            variant="primary"
            disabled={continueDisabled}
            onClick={() => {
              swal({
                title: '¿Estas segur@?',
                text: 'Una vez confirmes, las opciones de Lugar, Fecha y Hora no podran ser modificadas.',
                icon: 'warning',
                buttons: ['No, volver', 'Si, confirmar'],
                dangerMode: true
              }).then(async (willUpdate) => {
                if (willUpdate) {
                  let payload = {
                    optional_place1: requestTrackOpt1.id,
                    optional_date1: requestDateOpt1,
                    operator: userInfo.id
                  };
                  let payload2 = {
                    optional_place1: requestTrackOpt1?.id,
                    optional_date1: requestDateOpt1,
                    optional_place2: requestTrackOpt2?.id,
                    optional_date2: requestDateOpt2,
                    operator: userInfo.id
                  };

                  let res = await updateRequestId(requestId, showAlternative ? payload2 : payload);
                  if (res.status === 200) {
                    getSingleRequest(requestId);
                    swal('Solicitud actualizada!', {
                      icon: 'success'
                    });
                  } else {
                    swal('Oops, no se pudo actualizar el servicio.', {
                      icon: 'error'
                    });
                  }
                }
              });
            }}>
            Confirmar
          </Button>
        )}
      </Modal.Footer>
      {showModalTracks && (
        <ModalNewTrack
          handleClose={() => setShowModalTracks(false)}
          fetchTracks={() => {
            setTracks([]);
            getTracksByCity(municipality.name);
          }}
        />
      )}
    </Modal>
  );
};
export default ModalPlaceDate;
