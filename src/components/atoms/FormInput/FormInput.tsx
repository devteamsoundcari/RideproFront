import * as React from 'react';
import { Form, Col } from 'react-bootstrap';

export interface IFormInputProps {
  field: any;
  errors: any;
  register: any;
}

export function FormInput({ errors, register, field }: IFormInputProps) {
  const { label, required, requiredOptions, props } = field;
  return (
    <Form.Group as={Col}>
      <Form.Label>
        {label} {required && <span className="text-danger"> *</span>}
      </Form.Label>
      <Form.Control
        {...(props as any)}
        autoComplete="off"
        {...register(props.name, { required, ...requiredOptions })}
        // ref={register({
        //   required: true
        // })}
      />
      {required && errors[props.name] && (
        <small className="text-danger">{errors[props.name].message}</small>
      )}
      {/* <Form.Text>
        {errors.name && <span className="text-danger">Ingrese un nombre válido.</span>}
      </Form.Text> */}
    </Form.Group>
  );
}
