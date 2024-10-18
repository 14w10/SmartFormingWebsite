import { object, string } from 'yup';

export const validationSchema = object({
  title: string().required(),
  description: string(),
});

export const initialValues = {
  title: '',
  description: '',
};
