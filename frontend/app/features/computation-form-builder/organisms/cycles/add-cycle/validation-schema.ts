import { number, object, string } from 'yup';

export const validationSchema = object({
  title: string().required(),
  maxItems: number().required().moreThan(0).positive('Must be greater than 1'),
});

export const initialValues = {
  title: '',
  maxItems: '',
};
