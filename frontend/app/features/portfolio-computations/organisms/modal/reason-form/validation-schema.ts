import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  declineReason: Yup.string().required('Reason is required'),
});

export const initialValues = {
  declineReason: '',
};
