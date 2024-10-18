import { object, string } from 'yup';

export const validationFilesSchema = (values: IFileField[], isFiles: boolean) => {
  const newObj: any = values.reduce(
    (acc, item) => ({
      ...(acc as any),
      [item.fieldName]: string().required('Should be filled.'),
    }),
    {},
  );

  return isFiles
    ? object().shape({
        files: object(newObj),
      })
    : object().shape({});
};
