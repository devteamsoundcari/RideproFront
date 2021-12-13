import React, { useState, useContext } from 'react';
import moment from 'moment';
import { FaSearch, FaCheckCircle } from 'react-icons/fa';
import { Col, Form, InputGroup, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { TracksContext, SingleRequestContext } from '../../../../../contexts';
import './Alternative.scss';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
registerLocale('es', es);

export interface IAlternativeProps {
  option: number;
  department: string;
  city: string;
  track: any;
  placeOpt: any;
  setPlaceOpt: any;
  dateOpt: any;
  setDateOpt: any;
}

export function Alternative({
  option,
  department,
  city,
  track,
  placeOpt,
  setPlaceOpt,
  dateOpt,
  setDateOpt
}: IAlternativeProps) {
  const [key, setKey] = useState('place');
  const { tracks, loadingTracks } = useContext(TracksContext);
  const { currentRequest } = useContext(SingleRequestContext);

  const columns = [
    {
      dataField: 'name',
      text: 'Nombre'
    },
    {
      dataField: 'address',
      text: 'Dirección'
    }
  ];

  const MySearch = (searchProps) => {
    let input;
    const handleSearch = () => {
      searchProps.onSearch(input.value);
    };

    const handleClear = () => {
      setPlaceOpt(null);
    };

    return (
      <Form.Group as={Col} md="6" controlId="validationCustomUsername">
        <Form.Label>
          PISTAS EN:{' '}
          <strong>
            {city}, {department}
          </strong>
        </Form.Label>

        <InputGroup>
          <Form.Control
            value={
              track
                ? `${track.name} (Cliente)`
                : placeOpt
                ? `${placeOpt.name}, ${placeOpt.address}`
                : undefined
            }
            disabled={!tracks.length || track || placeOpt || loadingTracks}
            type="text"
            placeholder={
              loadingTracks
                ? `Cargando ${city}...`
                : tracks.length
                ? 'Buscar'
                : 'No hay pistas en esta ciudad.'
            }
            aria-describedby="inputGroupPrepend"
            ref={(n) => (input = n)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.target.value !== null) {
                  handleSearch();
                }
              }
            }}
          />
          {(!placeOpt || !dateOpt) && (
            <InputGroup.Text
              id="inputGroupPrepend"
              className="icon-search"
              onClick={placeOpt ? handleClear : handleSearch}>
              {loadingTracks ? (
                <Spinner animation="border" size="sm" />
              ) : placeOpt ? (
                'Borrar'
              ) : (
                <FaSearch />
              )}
            </InputGroup.Text>
          )}
        </InputGroup>
      </Form.Group>
    );
  };

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectColumn: true,
    onSelect: (row) => {
      setPlaceOpt(row);
    }
  };

  const getPlaceTitle = () => (
    <span>
      Lugar
      {(track || placeOpt) && (
        <span className="text-success">
          {' '}
          <FaCheckCircle />
        </span>
      )}
    </span>
  );

  const getDateTitle = () => (
    <span>
      Fecha y hora{' '}
      {dateOpt && (
        <span className="text-success">
          {' '}
          <FaCheckCircle />
        </span>
      )}
    </span>
  );

  const checkIfDateDisabled = () => {
    if (option === 1) {
      return currentRequest.optional_date1 ? true : false;
    } else {
      return currentRequest.optional_date2 ? true : false;
    }
  };

  return (
    <Tabs activeKey={key} onSelect={(k) => setKey(k as any)} className="mb-3 alternative-tabs">
      <Tab eventKey={`Opción ${option}`} title={`Opción ${option}`} disabled />
      <Tab eventKey="place" title={getPlaceTitle()} className="tab ">
        <ToolkitProvider keyField="id" search data={tracks} columns={columns} bordered={false}>
          {(props) => (
            <>
              <Row>
                <Col className="text-center d-flex justify-content-center">
                  <MySearch {...props.searchProps} />
                </Col>
              </Row>
              {!loadingTracks && !track && !placeOpt && (
                <div className="results-container">
                  <BootstrapTable
                    {...props.baseProps}
                    striped
                    classes="small-results-table"
                    selectRow={selectRow}
                    pagination={paginationFactory({ custom: true })}
                  />
                </div>
              )}
            </>
          )}
        </ToolkitProvider>
      </Tab>
      <Tab eventKey="date" title={getDateTitle()} className="tab">
        <Row className="mx-4">
          <Col className="text-center">
            <Form.Group as={Col} controlId="formGridEmail" className="w-75 m-auto">
              <Form.Label>Fecha del servicio</Form.Label>
              <DatePicker
                className={`red-border text-center ${checkIfDateDisabled() ? 'disabled' : ''}`}
                disabled={checkIfDateDisabled()}
                selected={dateOpt ? moment(dateOpt).valueOf() : moment().valueOf()}
                onChange={(date) => setDateOpt(date)}
              />
            </Form.Group>
          </Col>
          <Col className="text-center">
            <Form.Group as={Col} controlId="formGridEmail" className="w-75 m-auto">
              <Form.Label>Hora del servicio</Form.Label>
              <DatePicker
                className={`red-border text-center ${checkIfDateDisabled() ? 'disabled' : ''}`}
                disabled={checkIfDateDisabled()}
                selected={dateOpt ? moment(dateOpt).valueOf() : moment().valueOf()}
                onChange={(hour) => setDateOpt(hour)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Hora"
                dateFormat="h:mm aa"
              />
            </Form.Group>
          </Col>
        </Row>
      </Tab>
    </Tabs>
  );
}
