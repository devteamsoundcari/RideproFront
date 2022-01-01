import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Spinner, Card, Button } from 'react-bootstrap';
import BootstrapTable, { SelectRowProps } from 'react-bootstrap-table-next';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone
} from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { MainLayout } from '../../components/templates';
import { FaExternalLinkAlt, FaCheckCircle, FaPlus, FaDownload } from 'react-icons/fa';
import { useLocation } from 'react-router';
import { AuthContext } from '../../contexts';
import { CustomTable } from '../../components/organisms';
// import { getTracks } from '../../controllers/apiRequests';
import { CustomCard, ModalNewTrack } from '../../components/molecules';

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

export interface IPistasProps {}

export function Pistas(props: IPistasProps) {
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showTrackEditModal, setShowTrackEditModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);
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

  const updateTrackInfo = (track: Track) => {
    let newTracks = [...tracks];
    let index = newTracks.findIndex((t) => t.id === track.id);
    if (index >= 0) {
      newTracks[index] = track;
    }

    setTracks(newTracks);
  };

  // ================================ FETCH TRACKS ON LOAD =====================================================
  // const fetchTracks = async (url: string) => {
  //   let tempTracks: any = [];
  //   const response = await getTracks(url);
  //   response.results.forEach(async (item: any) => {
  //     tempTracks.push(item);
  //   });
  //   setTracks((oldArr) => oldArr.concat(tempTracks));
  //   if (response.next) {
  //     return await fetchTracks(response.next);
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   if (userInfo.profile === 1) {
  //     fetchTracks(`${process.env.REACT_APP_API_URL}/api/v1/tracks/`);
  //   } else {
  //     fetchTracks(
  //       `${process.env.REACT_APP_API_URL}/api/v1/tracks/?company=${userInfo.company.id}`
  //     );
  //   }
  //   //eslint-disable-next-line
  // }, []);

  useEffect(() => {
    tracks.forEach((item) => {
      if (userInfo.company.id === item.company.id) {
        setFilteredTracks((oldArr: any) => [...oldArr, item]);
      }
    });
  }, [tracks, userInfo.company.id]);

  // const handleFetch = () => {
  //   setFilteredTracks([]);
  //   setTracks([]);
  //   fetchTracks(
  //     `${process.env.REACT_APP_API_URL}/api/v1/tracks/?company=${userInfo.company.id}`
  //   );
  // };
  const actionButtons = [
    {
      onClick: () => setShowAddTrack(true),
      icon: <FaPlus />
    },
    {
      onClick: () => console.log('yex'),
      icon: <FaDownload />,
      disabled: true
    }
  ];

  return (
    <MainLayout>
      <CustomCard title="Pistas" subtitle="Detalle de tus pistas" actionButtons={actionButtons}>
        <CustomTable
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
          fetchTracks={() => {
            setTracks([]);
            // getTracksByCity(municipality.name);
          }}
        />
      )}
    </MainLayout>
  );
}
