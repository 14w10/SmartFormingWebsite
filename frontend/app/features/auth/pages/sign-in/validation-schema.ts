import * as yup from 'yup';

export const validationSchema = yup
  .object()
  .shape({
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup.string().required('Password is required'),
  })
  .required();

export type LoginFields = yup.InferType<typeof validationSchema>;
