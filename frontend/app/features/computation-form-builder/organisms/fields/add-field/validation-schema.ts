import { array, boolean, number, object, ref, string } from 'yup';

export const sliderValidationSchema = object().shape({
  type: string(),
  label: string().required('Title is required'),
  minLength: number().required('Min value is required'),
  stepValue: number()
    .required('Step value is required')
    .moreThan(0, 'Increment should be more than 0')
    // .when(
    //   ['maxLength', 'minLength'],
    //   (maxLength: number | undefined, minLength: number | undefined, schema: any) => {
    //     if (maxLength && minLength) {
    //       return schema.max(maxLength - minLength);
    //     } else if (maxLength) {
    //       return schema.max(maxLength);
    //     }
    //   },
    // ),
    .when(
      ['maxLength', 'minLength'],
      (schema: any) => {
        if (ref('maxLength') && ref('minLength')) {
          return schema.max((ref('maxLength') as any) - (ref('minLength') as any));
        } else if (ref('maxLength')) {
          return schema.max(ref('maxLength'));
        }
      },
    ),
    maxLength: number()
      .required('Max value is required')
      .when('minLength', {
        is: (val: any) => Boolean(val),
        then: (schema) => schema.min(ref('minLength'), 'Max length must be greater than or equal to min length'),
        otherwise: (schema) => schema,
      }
    ),
  default: number()
    .required('Default value is required')
    .min(ref('minLength'))
    .max(ref('maxLength')),
});

export const selectValidationSchema = object().shape({
  type: string(),
  label: string().required('Title is required'),
  required: boolean(),
  enum: array()
    .of(string().required('Option is required'))
    .required('At least 1 option is required'),
});

export const initialValues = {
  type: 'integer',
  label: '',
  minLength: '',
  maxLength: '',
  stepValue: '1',
  default: '',
  enum: '',
  required: true,
};
