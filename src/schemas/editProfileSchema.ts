import * as Yup from 'yup';
import {
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_PHONE_NUMBER,
  ERROR_REQUIRED,
  REGEX_PHONE_NUMBER
} from '../utils';

export const editProfileFields = [
  {
    label: 'Nombre',
    required: true,
    props: {
      name: 'first_name',
      type: 'text',
      inputmode: 'text',
      placeholder: ''
    }
  },
  {
    label: 'Apellido',
    required: true,
    props: {
      name: 'last_name',
      type: 'text',
      inputmode: 'text',
      placeholder: ''
    }
  },
  {
    label: 'Correo electrónico',
    required: true,
    props: {
      name: 'email',
      type: 'email',
      inputmode: 'email',
      placeholder: '',
      disabled: true
    }
  },
  {
    label: 'Cargo',
    required: true,
    props: {
      name: 'charge',
      type: 'text',
      inputmode: 'text',
      placeholder: ''
    }
  },

  {
    label: 'Numero de celular',
    required: true,
    props: {
      name: 'phone',
      type: 'number',
      inputmode: 'number',
      placeholder: ''
    }
  }
];

export const editProfileSchema = Yup.object().shape({
  first_name: Yup.string().required(ERROR_REQUIRED),
  last_name: Yup.string().required(ERROR_REQUIRED),
  email: Yup.string().required(ERROR_REQUIRED).email(ERROR_INVALID_EMAIL),
  charge: Yup.string().required(ERROR_REQUIRED),
  phone: Yup.string()
    .required(ERROR_REQUIRED)
    .matches(REGEX_PHONE_NUMBER, ERROR_INVALID_PHONE_NUMBER)
});
