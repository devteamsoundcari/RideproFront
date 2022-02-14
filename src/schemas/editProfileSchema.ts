import * as Yup from 'yup';
import { ERROR_INVALID_EMAIL, ERROR_REQUIRED } from '../utils';

export const editProfileFields = [
  {
    label: 'Nombre',
    required: true,
    props: {
      name: 'first_name',
      type: 'text',
      inputMode: 'text',
      placeholder: ''
    }
  },
  {
    label: 'Apellido',
    required: true,
    props: {
      name: 'last_name',
      type: 'text',
      inputMode: 'text',
      placeholder: ''
    }
  },
  {
    label: 'Correo electrónico',
    required: true,
    props: {
      name: 'email',
      type: 'email',
      inputMode: 'email',
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
      inputMode: 'text',
      placeholder: ''
    }
  }
];

export const editProfileSchema = Yup.object().shape({
  first_name: Yup.string().required(ERROR_REQUIRED),
  last_name: Yup.string().required(ERROR_REQUIRED),
  email: Yup.string().required(ERROR_REQUIRED).email(ERROR_INVALID_EMAIL),
  charge: Yup.string().required(ERROR_REQUIRED),
  gender: Yup.string().required(ERROR_REQUIRED)
});
