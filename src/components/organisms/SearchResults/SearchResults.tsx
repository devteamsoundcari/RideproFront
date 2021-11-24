import React, { useContext, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaUserFriends } from 'react-icons/fa';
import ClientStatus from '../../../utils/ClientStatus';
import { dateFormatter } from '../../../utils/helpFunctions';
import OperacionesStatus from '../../../utils/OperacionesStatus';
import { AuthContext, SearchFiltersContext } from '../../../contexts';
import { useNavigate } from 'react-router';

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

  return (
    <div className="w-50 ml-3 search-results shadow">
      <ListGroup ref={wrapperRef}>
        {results.map(({ request }, idx) => (
          <ListGroup.Item
            as="li"
            className="border"
            key={request.id + idx}
            onClick={() => navigate(`/historial/${request.id}`)}>
            <span>{dateFormatter(request.start_time)}</span>
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
            {userInfo.profile === 2 ? (
              <ClientStatus step={request.status.step} width="8rem" />
            ) : (
              <OperacionesStatus step={request.status.step} width="8rem" />
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
