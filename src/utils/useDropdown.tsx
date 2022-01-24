import React, { useState } from 'react';
import { Form, Spinner } from 'react-bootstrap';

export const useDropdown = (label, defaultState, options, loading) => {
  const [state, setState] = useState(defaultState);

  const Dropdown = () => (
    <React.Fragment>
      <Form.Label>
        {label.length > 0 ? label : null}{' '}
        {loading && <Spinner size="sm" variant="primary" animation="border" />}
      </Form.Label>
      <Form.Control
        as="select"
        value={state}
        onChange={(e) => setState(e.target.value)}
        onBlur={(e) => setState(e.target.value)}
        disabled={loading || options.length === 0 || state === 'disabled'}>
        <option>{loading ? 'Cargando...' : 'Seleccione...'}</option>
        {options.map((item) => (
          <option key={item.id} value={item.id} id={`use-dropdown-option-${item.id}`}>
            {item.name}
          </option>
        ))}
      </Form.Control>
    </React.Fragment>
  );
  return [state, Dropdown, setState];
};
