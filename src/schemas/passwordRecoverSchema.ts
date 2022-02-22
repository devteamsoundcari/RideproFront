import * as Yup from 'yup';
import { ERROR_INVALID_EMAIL, ERROR_REQUIRED } from '../utils';

export const passwordRecoverFields = [
  {
    label: 'Email',
    required: true,
    props: {
      name: 'email',
      type: 'email',
      inputmode: 'email',
      placeholder: 'Tu email'
    }
  }
];

export const passwordRecoverSchema = Yup.object().shape({
  email: Yup.string().required(ERROR_REQUIRED).email(ERROR_INVALID_EMAIL)
});
