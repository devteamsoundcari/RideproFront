import * as Yup from 'yup';

export const checkoutFields = [
  {
    label: 'Comendatios adicionales',
    required: false,
    props: {
      name: 'comments',
      type: 'textarea',
      inputMode: 'textarea',
      placeholder: ''
    }
  },
  {
    label: 'test',
    required: true,
    props: {
      name: 'accept',
      type: 'checkbox',
      inputMode: 'checkbox',
      placeholder: 'Tu email'
    }
  }
];

export const checkoutSchema = Yup.object().shape({
  comments: Yup.string(),
  acceptTerms: Yup.boolean().oneOf([true], 'Aceptar condiciones *')
});
