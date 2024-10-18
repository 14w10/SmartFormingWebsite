import { number, object, string } from 'yup';

export const validationSchema = object().shape({
  title: string().required('Title is required').max(100),
  description: string().required('Description is required.'),
});

export const initialValues = {
  title: '',
  description: '',
};
