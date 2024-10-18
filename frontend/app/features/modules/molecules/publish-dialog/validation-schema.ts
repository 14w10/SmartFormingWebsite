import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  uid: Yup.string()
    .min(10, 'The valid ID is minimum of 10 symbols.')
    .max(30, 'The valid ID is maximum of 30 symbols.')
    .required('Uid is required'),
});

export const initialValues = {
  uid: '',
};
