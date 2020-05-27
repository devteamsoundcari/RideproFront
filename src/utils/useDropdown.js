import React, { useState } from "react";
import { Form } from "react-bootstrap";

const useDropdown = (label, defaultState, options) => {
  const [state, setState] = useState(defaultState);
  // const id = `use-dropdown-${label.replace(" ", "").toLowerCase()}`;
  const Dropdown = () => (
    <React.Fragment>
      {/* <Form.Label htmlFor={id}> */}
      <Form.Label>
        <h5>{label}</h5>
      </Form.Label>
      <Form.Control
        as="select"
        // id={id}
        value={state}
        onChange={(e) => setState(e.target.value)}
        onBlur={(e) => setState(e.target.value)}
        disabled={options.length === 0 || state === "disabled"}
      >
        <option>Seleccione...</option>
        {options.map((item) => (
          <option
            key={item.id}
            value={item.id}
            id={`use-dropdown-option-${item.id}`}
          >
            {item.name}
          </option>
        ))}
      </Form.Control>
    </React.Fragment>
  );
  return [state, Dropdown, setState];
};

export default useDropdown;
