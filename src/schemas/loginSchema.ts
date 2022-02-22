import * as Yup from 'yup';
import { ERROR_INVALID_EMAIL, ERROR_PASSWORD_TOO_SHORT, ERROR_REQUIRED } from '../utils';

export const loginFields = [
  {
    label: 'Email',
    required: true,
    props: {
      name: 'email',
      type: 'email',
      inputMode: 'email',
      placeholder: ''
    }
  },
  {
    label: 'Constraseña',
    required: true,
    props: {
      name: 'password',
      type: 'password',
      inputMode: 'text',
      placeholder: ''
    }
  }
];

export const loginSchema = Yup.object().shape({
  email: Yup.string().required(ERROR_REQUIRED).email(ERROR_INVALID_EMAIL),
  password: Yup.string().required(ERROR_REQUIRED).min(4, ERROR_PASSWORD_TOO_SHORT)
});
