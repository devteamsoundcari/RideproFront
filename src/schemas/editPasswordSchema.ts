import * as Yup from 'yup';
import {
  ERROR_PASSWORD_COMPLEXITY,
  ERROR_PASSWORD_TOO_LONG,
  ERROR_PASSWORD_TOO_SHORT,
  ERROR_REQUIRED,
  REGEX_8_CHARACTERS_1_UPPERCASE_1_LOWERCASE_1_NUMBER_1_SPECIAL_CHAR
} from '../utils';

export const editPasswordFields = [
  {
    label: 'Contraseña actual',
    required: true,
    props: {
      name: 'old_password',
      type: 'password',
      inputMode: 'password',
      placeholder: ''
    }
  },
  {
    label: 'Contraseña nueva',
    required: true,
    props: {
      name: 'new_password1',
      type: 'password',
      inputMode: 'password',
      placeholder: ''
    }
  },
  {
    label: 'Repetir Contraseña nueva',
    required: true,
    props: {
      name: 'new_password2',
      type: 'password',
      inputMode: 'password',
      placeholder: ''
    }
  }
];

export const editPasswordSchema = Yup.object().shape({
  old_password: Yup.string().required(ERROR_REQUIRED),
  new_password1: Yup.string()
    .required(ERROR_REQUIRED)
    .min(8, ERROR_PASSWORD_TOO_SHORT)
    .max(12, ERROR_PASSWORD_TOO_LONG)
    .matches(
      REGEX_8_CHARACTERS_1_UPPERCASE_1_LOWERCASE_1_NUMBER_1_SPECIAL_CHAR,
      ERROR_PASSWORD_COMPLEXITY
    ),
  new_password2: Yup.string()
    .required(ERROR_REQUIRED)
    .min(8, ERROR_PASSWORD_TOO_SHORT)
    .max(12, ERROR_PASSWORD_TOO_LONG)
    .oneOf([Yup.ref('new_password1')], 'Las contraseñas no coinciden')
});
