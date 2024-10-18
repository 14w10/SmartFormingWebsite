import { number, object, string } from 'yup';

export const validationSchema = object().shape({
  firstName: string().required('First name is required'),
  lastName: string().required('Last name is required'),
  email: string().required('Email is required'),
  productContribution: string()
    .required('Intellectual product contribution is required'),
  generatedId: string().required("ID is required")
  // productContribution: number()
  //   .required('Intellectual product contribution is required')
  //   .moreThan(1)
  //   .lessThan(100),
});
