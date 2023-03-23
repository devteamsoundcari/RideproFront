import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { TracksContext, AuthContext, ServiceContext } from '../../../contexts';
import { useDropdown } from '../../../utils';
import { COMPANY_NAME } from '../../../utils/constants';
import swal from 'sweetalert';
import './TabSelectPlace.scss';
export interface ITabSelectPlaceProps {}

export function TabSelectPlace(props: ITabSelectPlaceProps) {
  const {
    getDepartments,
    departments,
    getCitiesByDepartmentId,
    cities,
    setCities,
    loadingDepartments,
    loadingCities,
    getTracks,
    loadingTracks,
    allTracksLoaded,
    tracks
  } = useContext(TracksContext);
  const { selectedPlace, setSelectedPlace } = useContext(ServiceContext);
  const { userInfo } = useContext(AuthContext) as any;
  const [selectedDepartment, DepartmentsDropdown] = useDropdown(
    'Departamento',
    'Seleccione...',
    departments,
    loadingDepartments
  );
  const [selectedCity, CitiesDropdown] = useDropdown(
    'Ciudad',
    'Seleccione...',
    cities,
    loadingCities
  );
  const [filteredTracks, setFilteredTracks] = useState<any>([]);

  // =========================== FETCHING DEPARTMENTS ===================================

  useEffect(() => {
    // setSelectedPlace(null);
    getDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================== FETCHING CITIES ===================================

  useEffect(() => {
    if (selectedPlace?.department?.id && selectedPlace?.department?.name) {
      getCitiesByDepartmentId(selectedPlace.department.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlace?.department]);

  //   // =============================== SET DEPARTMENT ====================================

  useEffect(() => {
    if (!isNaN(selectedDepartment)) {
      const foundDepartment = departments.find(({ id }) => id === parseInt(selectedDepartment));
      setSelectedPlace({
        city: undefined,
        track: undefined,
        department: foundDepartment
      });
      setCities([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment]);

  // =============================== SET CITY ==========================================

  useEffect(() => {
    if (!isNaN(selectedCity)) {
      const foundCity = cities.find(({ id }) => id === parseInt(selectedCity));
      setSelectedPlace({
        ...selectedPlace,
        city: foundCity
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

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

  useEffect(() => {
    if (selectedDepartment !== 'Seleccione...' && selectedCity !== 'Seleccione...') {
      setFilteredTracks([]);
      const foundTracks = tracks.filter(
        (item) =>
          item.municipality.department.id === parseInt(selectedDepartment) &&
          userInfo.company.id === item.company.id
      );
      setFilteredTracks((oldArr) => [...oldArr, ...foundTracks]);
    }
    //eslint-disable-next-line
  }, [selectedDepartment, selectedCity, tracks]);

  const handleTrackChange = (trackId: any) => {
    const foundTrack = filteredTracks.find(({ id }) => id === trackId);
    setSelectedPlace({
      ...selectedPlace,
      track: foundTrack === undefined ? { id: trackId, name: trackId } : foundTrack
    });
    swal(
      'Lugar seleccionado',
      `${selectedPlace?.track?.name}, ${selectedPlace?.city?.name}, ${selectedPlace.department?.name}`,
      'success'
    );
  };

  return (
    <Form className="tab-select-place">
      <div className="form-item">
        <DepartmentsDropdown />
      </div>
      <div className="form-item">
        <CitiesDropdown />
      </div>
      <div className="form-item">
        <Form.Label>Pista</Form.Label>
        <Form.Control
          as="select"
          value={selectedPlace?.track ? selectedPlace?.track?.id : 'Seleccione...'}
          onChange={(e) => handleTrackChange(e.target.value)}
          onBlur={(e) => handleTrackChange(e.target.value)}
          disabled={loadingTracks || !selectedPlace?.department || !selectedPlace?.city}>
          <option>Seleccione...</option>
          <option value="na">Pista {COMPANY_NAME}</option>
          {filteredTracks.map((item) => (
            <option key={item.id} value={item.id} id={`use-dropdown-option-${item.id}`}>
              {item.name}
            </option>
          ))}
        </Form.Control>
      </div>
    </Form>
  );
}
