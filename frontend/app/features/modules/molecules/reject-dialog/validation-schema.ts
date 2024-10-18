import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  rejectReason: Yup.string().required('Reason is required'),
});

export const initialValues = {
  rejectReason: '',
};
