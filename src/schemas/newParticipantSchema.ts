import * as Yup from 'yup';
import {
  ERROR_INVALID_EMAIL,
  ERROR_INVALID_PHONE_NUMBER,
  ERROR_ONLY_LETTERS_AND_SPACES,
  ERROR_REQUIRED,
  ERROR_VERY_LONG,
  ERROR_VERY_SHORT,
  REGEX_LETTERS_AND_SPACES,
  REGEX_OFFICIAL_ID,
  REGEX_PHONE_NUMBER
} from '../utils';

export const newParticipantFields = [
  {
    label: 'Identificación',
    required: true,
    props: {
      name: 'official_id',
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
      name: 'cellphone',
      type: 'number',
      inputmode: 'number',
      placeholder: ''
    }
  }
];

export const newParticipantSchema = Yup.object().shape({
  official_id: Yup.string()
    .required(ERROR_REQUIRED)
    .matches(REGEX_OFFICIAL_ID, 'Debe ser un numero de identificación valido')
    .min(6, ERROR_VERY_SHORT)
    .max(10, ERROR_VERY_LONG),
  first_name: Yup.string()
    .required(ERROR_REQUIRED)
    .matches(REGEX_LETTERS_AND_SPACES, ERROR_ONLY_LETTERS_AND_SPACES),
  last_name: Yup.string()
    .required(ERROR_REQUIRED)
    .matches(REGEX_LETTERS_AND_SPACES, ERROR_ONLY_LETTERS_AND_SPACES),
  email: Yup.string().required(ERROR_REQUIRED).email(ERROR_INVALID_EMAIL),
  cellphone: Yup.string()
    .required(ERROR_REQUIRED)
    .matches(REGEX_PHONE_NUMBER, ERROR_INVALID_PHONE_NUMBER)
});
