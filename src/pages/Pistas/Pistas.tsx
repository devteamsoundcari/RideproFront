import React, { useContext, useEffect, useState } from 'react';
import { textFilter } from 'react-bootstrap-table2-filter';
import { MainLayout } from '../../components/templates';
import { FaExternalLinkAlt, FaPlus, FaDownload, FaUndoAlt } from 'react-icons/fa';
import { TracksContext } from '../../contexts';
import { CustomTable } from '../../components/organisms';
import { CustomCard, ModalEditTrack, ModalNewTrack } from '../../components/molecules';
import { Track } from '../../interfaces';
import { Spinner } from 'react-bootstrap';

export interface IPistasProps {}

export function Pistas(props: IPistasProps) {
  const {
    getTracks,
    tracks,
    loadingTracks,
    setTracks,
    allTracksLoaded,
    setAllTracksLoaded,
    count
  } = useContext(TracksContext);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showTrackEditModal, setShowTrackEditModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

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
          background: `url(${cell ? cell : defaultImage}) no-repeat center center`,
          backgroundSize: 'cover',
          width: '4rem',
          height: '4rem',
          borderRadius: '50%',
          margin: 'auto'
        }}></div>
    );
  };

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true,
      classes: 'small-column',
      headerClasses: 'small-column'
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
      text: 'Nombre',
      filter: textFilter()
    },
    {
      dataField: 'municipality.department.name',
      text: 'Departamento',
      filter: textFilter(),
      sort: true
    },
    {
      dataField: 'municipality.name',
      text: 'Ciudad',
      filter: textFilter(),
      sort: true
    },
    {
      dataField: 'address',
      text: 'Dirección'
    },
    {
      dataField: 'company.name',
      text: 'Empresa',
      filter: textFilter(),
      sort: true
    },
    {
      dataField: 'latitude',
      text: 'Ubicación',
      formatter: formatLocation
    }
  ];

  const setTrackData = (row: any) => {
    const track: Track = row;
    track.contactName = row.contact_name;
    track.contactEmail = row.contact_email;

    setSelectedTrack(track);
  };

  // ================================ FETCH TRACKS ON LOAD =====================================================
  const fetchTracks = async () => {
    try {
      await getTracks();
    } catch (error) {
      throw new Error('Error getting the tracks');
    }
  };

  useEffect(() => {
    if (!loadingTracks && !allTracksLoaded) fetchTracks();
    //eslint-disable-next-line
  }, [allTracksLoaded]);

  const actionButtons = [
    {
      onClick: () => setAllTracksLoaded(false),
      icon: loadingTracks ? (
        <Spinner animation="border" size="sm" className="mt-2" />
      ) : (
        <FaUndoAlt />
      ),
      disabled: loadingTracks
    },
    {
      onClick: () => setShowAddTrack(true),
      icon: <FaPlus />,
      disabled: loadingTracks
    },
    {
      onClick: () => console.log('yex'),
      icon: <FaDownload />,
      disabled: true
    }
  ];

  const updateTrackInfo = (track: Track) => {
    let newTracks = [...tracks];
    let index = newTracks.findIndex((t) => t.id === track.id);
    if (index >= 0) newTracks[index] = track;
    setTracks(newTracks);
  };

  return (
    <MainLayout>
      <CustomCard
        title="Pistas"
        subtitle={`Detalle de tus pistas registrados ${
          loadingTracks ? `(${tracks.length} de ${count})` : `(${count})`
        }`}
        actionButtons={actionButtons}
        loading={loadingTracks}>
        <CustomTable
          keyField="id"
          loading={loadingTracks}
          columns={columns}
          data={tracks}
          onSelectRow={(row) => {
            setSelectedTrack(row);
            setTrackData(row);
            setShowTrackEditModal(true);
          }}
        />
      </CustomCard>
      {showAddTrack && (
        <ModalNewTrack
          handleClose={() => setShowAddTrack(false)}
          fetchTracks={() => fetchTracks()}
        />
      )}
      {showTrackEditModal && selectedTrack && (
        <ModalEditTrack
          onHide={() => setShowTrackEditModal(false)}
          onTrackUpdate={updateTrackInfo}
          track={selectedTrack}
        />
      )}
    </MainLayout>
  );
}
