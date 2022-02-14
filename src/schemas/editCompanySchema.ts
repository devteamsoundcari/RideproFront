import * as Yup from 'yup';
import { ERROR_REQUIRED } from '../utils';

export const editCompanyFields = [
  {
    label: 'Nombre',
    required: true,
    props: {
      name: 'name',
      type: 'text',
      inputMode: 'text',
      placeholder: '',
      disabled: true
    }
  },
  {
    label: 'NIT',
    required: true,
    props: {
      name: 'nit',
      type: 'text',
      inputMode: 'text',
      placeholder: '',
      disabled: true
    }
  },
  {
    label: 'Dirección',
    required: true,
    props: {
      name: 'address',
      type: 'text',
      inputMode: 'text',
      placeholder: '',
      disabled: true
    }
  },
  {
    label: 'ARL',
    required: true,
    props: {
      name: 'arl',
      type: 'text',
      inputMode: 'text',
      placeholder: '',
      disabled: true
    }
  },
  {
    label: 'Teléfono',
    required: true,
    props: {
      name: 'phone',
      type: 'number',
      inputMode: 'number',
      placeholder: '',
      disabled: true
    }
  }
];

export const editCompanySchema = Yup.object().shape({
  name: Yup.string().required(ERROR_REQUIRED),
  nit: Yup.string().required(ERROR_REQUIRED),
  address: Yup.string().required(ERROR_REQUIRED),
  arl: Yup.string().required(ERROR_REQUIRED),
  phone: Yup.number().required(ERROR_REQUIRED)
});
