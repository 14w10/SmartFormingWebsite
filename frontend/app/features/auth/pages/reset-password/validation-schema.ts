import { InferType, object, ref, string } from 'yup';

export const validationSchema = object()
  .shape({
    password: string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    passwordConfirmation: string()
      .label('Confirm password')
      .oneOf([ref('password'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  })
  .required();

export type ResetPasswordFields = InferType<typeof validationSchema>;
