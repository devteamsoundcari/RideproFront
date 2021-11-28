import React, { useContext, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaUserFriends } from 'react-icons/fa';
import { AuthContext, SearchFiltersContext } from '../../../contexts';
import { useNavigate } from 'react-router';
import { allStatus } from '../../../allStatus';
import { StatusRenderer } from '../../atoms';
import { dateDDMMYYY } from '../../../utils';

export function SearchResults() {
  let navigate = useNavigate();
  const wrapperRef: any = useRef(null);
  const { results, setResults } = useContext(SearchFiltersContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setResults, wrapperRef]);

  // STATUS FORMATTER
  const statusFormatter = (requestStep: number) => {
    const foundProfile = allStatus.find(
      (user) => user.profile.profile === userInfo.profile
    );
    const foundStep = foundProfile?.steps.find(
      ({ step }) => step === requestStep
    );
    return <StatusRenderer step={foundStep} />;
  };

  return (
    <div className="w-50 ml-3 search-results shadow">
      <ListGroup ref={wrapperRef}>
        {results.map(({ request }, idx) => (
          <ListGroup.Item
            as="li"
            className="border"
            key={request.id + idx}
            onClick={() => navigate(`/historial/${request.id}`)}>
            <span>{dateDDMMYYY(request.start_time)}</span>
            <span className="font-weight-bold">#{request.id}</span>
            {request.track && (
              <span className="text-capitalize">
                {request.track.municipality.name.toLowerCase()},{' '}
                {request.track.municipality.department.name}
              </span>
            )}
            <span className="font-weight-bold">
              {request.drivers.length} <FaUserFriends />
            </span>
            {/* {userInfo.profile === 2 ? (
              <ClientStatus step={request.status.step} width="8rem" />
            ) : (
              <OperacionesStatus step={request.status.step} width="8rem" />
            )} */}
            {statusFormatter(request.status.step)}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
