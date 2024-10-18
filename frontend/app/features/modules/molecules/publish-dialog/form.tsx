import { useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Button } from '@material-ui/core';
import { Field, FieldProps, Form as FormComponent, Formik, FormikHelpers } from 'formik';

import { useCurrentUser } from 'features/user';

import { changeStatusReq, getModuleQueryKey } from '../../api';
import { MaskedInput } from './masked-input';
import { initialValues, validationSchema } from './validation-schema';

interface IForm {
  handleClose: () => void;
}

export const Form = ({ handleClose }: IForm) => {
  const cache = useQueryClient();
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const { mutate: changeStatus } = useMutation(changeStatusReq, {
    onSuccess: () => {
      cache.invalidateQueries(
        getModuleQueryKey({ isUser: currentUser?.role === 'user', moduleId: query.moduleId as ID }),
      );
      handleClose();
    },
  });

  const handleSubmit = useCallback(
    async ({ uid }: { uid: string }, helpers: FormikHelpers<any>) => {
      await changeStatus(
        { uid, moduleId: query.moduleId as ID, status: 'published' },
        {
          onError: data => {
            helpers.setFieldError(
              'uid',
              (data as any)?.errors?.data?.attributes?.uid || 'Incorrect field',
            );
          },
        },
      );
    },
    [changeStatus, query.moduleId],
  );

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors }) => {
          return (
            <FormComponent>
              <Field
                name="uid"
                render={({ field }: FieldProps) => (
                  <MaskedInput field={field} label="ID *" error={errors.uid} />
                )}
              />

              <Box
                display="flex"
                minWidth={320}
                mt={3}
                flexGrow={0}
                flexShrink={0}
                justifyContent="flex-end"
              >
                <Box mr={1}>
                  <Button onClick={handleClose} variant="outlined" color="primary" autoFocus>
                    Cancel
                  </Button>
                </Box>
                <Button type="submit" variant="contained" color="primary">
                  Publish
                </Button>
              </Box>
            </FormComponent>
          );
        }}
      </Formik>
    </Box>
  );
};
