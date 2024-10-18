import { object, ref, string } from 'yup';
import * as Yup from 'yup';

export const userValidationSchema = object().shape({
    title: string().required('Title is required'),
    firstName: string().required('First name is required'),
    lastName: string().required('Last name is required'),
    phoneNumber: string().required('Phone number is required'),
    email: string().email('Email is invalid').required('Email is required'),
    password: string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    passwordConfirmation: string()
      .label('Confirm password')
      .oneOf([ref('password'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  });

export const orgValidationSchema = object().shape({
    organizationName: string().required('Organization Name is required'),
    organizationAddress: string().required('Organization Address is required'),
    organizationPostcode: string().required('Organization Post Code is required'),

    organizationCountry: string().required('Organization Country is required'),
    position: string().nullable(),
    role: string().nullable(),
    organizationBusiness: string().nullable(),
    website: string(),
    linkedin: string(),
    researchGate: string(),
    otherLink: string(),
  });

// export const validationSchema = [
//   object().shape({
//     title: string().required('Title is required'),
//     firstName: string().required('First name is required'),
//     lastName: string().required('Last name is required'),
//     phoneNumber: string().required('Phone number is required'),
//     email: string().email('Email is invalid').required('Email is required'),
//     password: string()
//       .min(8, 'Password must be at least 8 characters')
//       .required('Password is required'),
//     passwordConfirmation: string()
//       .label('Confirm password')
//       .oneOf([ref('password'), ''], 'Passwords must match')
//       .required('Confirm password is required'),
//   }),
//   object().shape({
//     organizationName: string().required('Organization Name is required'),
//     organizationAddress: string().required('Organization Address is required'),
//     organizationPostcode: string().required('Organization Post Code is required'),

//     organizationCountry: string().required('Organization Country is required'),
//     position: string().nullable(),
//     role: string().nullable(),
//     organizationBusiness: string().nullable(),
//     website: string(),
//     linkedin: string(),
//     researchGate: string(),
//     otherLink: string(),
//   }),
// ];

// export const initialValues = {
//   title: '',
//   firstName: '',
//   lastName: '',
//   phoneNumber: '',
//   email: '',
//   password: '',
//   passwordConfirmation: '',
//   organizationName: '',
//   organizationAddress: '',
//   organizationPostcode: '',
//   organizationCountry: '',
//   position: '',
//   role: '',
//   organizationBusiness: '',
//   website: '',
//   linkedin: '',
//   researchGate: '',
//   otherLink: '',
// };

export type UserFields = Yup.InferType<typeof userValidationSchema>;
export type OrgFields = Yup.InferType<typeof orgValidationSchema>;
export type SignUpFields = UserFields | OrgFields;

export const userInitialValues: UserFields = {
  title: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

export const orgInitialValues: OrgFields = {
  organizationName: '',
  organizationAddress: '',
  organizationPostcode: '',
  organizationCountry: '',
  position: '',
  role: '',
  organizationBusiness: '',
  website: '',
  linkedin: '',
  researchGate: '',
  otherLink: '',
}
