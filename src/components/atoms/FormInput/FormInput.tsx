import * as React from 'react';
import { Form, Col } from 'react-bootstrap';

export interface IFormInputProps {
  field: any;
  errors: any;
  register: any;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export function FormInput({
  errors,
  register,
  field,
  className,
  labelClassName,
  errorClassName = 'text-danger'
}: IFormInputProps) {
  const { label, required, requiredOptions, props } = field;
  return (
    <Form.Group as={Col}>
      <Form.Label className={labelClassName}>
        {label} {required && <span className="text-danger"> *</span>}
      </Form.Label>
      <Form.Control
        className={className}
        {...(props as any)}
        autoComplete="off"
        {...register(props.name, { required, ...requiredOptions })}
      />
      {required && errors[props.name] && (
        <small className={errorClassName}>{errors[props.name].message}</small>
      )}
    </Form.Group>
  );
}
