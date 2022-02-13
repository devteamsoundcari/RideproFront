import * as Yup from 'yup';
import {
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_PHONE_NUMBER,
  ERROR_REQUIRED,
  REGEX_PHONE_NUMBER
} from '../utils';

export const newParticipantFields = [
  {
    label: 'Identificación',
    required: true,
    props: {
      name: 'identification',
      type: 'number',
      inputmode: 'number',
      placeholder: ''
    }
  },
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
    label: 'Email',
    required: true,
    props: {
      name: 'email',
      type: 'email',
      inputmode: 'email',
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

export const newParticipantSchema = Yup.object().shape({
  identification: Yup.number().required(ERROR_REQUIRED),
  first_name: Yup.string().required(ERROR_REQUIRED),
  last_name: Yup.string().required(ERROR_REQUIRED),
  email: Yup.string().required(ERROR_REQUIRED).email(ERROR_INVALID_EMAIL),
  phone: Yup.string()
    .required(ERROR_REQUIRED)
    .matches(REGEX_PHONE_NUMBER, ERROR_INVALID_PHONE_NUMBER)
});
