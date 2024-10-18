import { array, InferType, object, string } from 'yup';

export const validationSchema = object()
  .shape({
    title: string().required('Module title is required'),
    shortDescription: string()
      .max(150, 'Short description must be under 150 characters')
      .required('Short Description is required.'),
    description: string().required('Description is required.'),
    attachReport: string().required('Verified Report is required.'),
    attachModule: string().required('Verified Module is required.'),
    moduleType: string(),
    categoryId: string().required('Type is required.'),
    keywords: array(),
    cover: string().nullable(),
  })
  .required();

export const initialValues = {
  title: '',
  shortDescription: '',
  description: '',
  attachReport: '',
  attachModule: '',
  moduleType: '',
  categoryId: '',
  keywords: [],
};

export type ModuleFormType = InferType<typeof validationSchema>;
