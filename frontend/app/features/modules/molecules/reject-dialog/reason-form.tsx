import { useCallback } from 'react';
import { Box, Button } from '@material-ui/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import { TextField } from 'ui-legacy';

import { initialValues, validationSchema } from './validation-schema';

interface IReasonForm {
  handleClose: () => void;
  handleChangeStatus: (rejectReason: string) => void;
}

export const ReasonForm = ({ handleClose, handleChangeStatus }: IReasonForm) => {
  const handleSubmit = useCallback(
    ({ rejectReason }: { rejectReason: string }) => {
      handleChangeStatus(rejectReason);
      handleClose();
    },
    [handleChangeStatus, handleClose],
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
            <Form>
              <Field
                name="rejectReason"
                render={({ field, form }: FieldProps) => (
                  <TextField
                    multiline
                    rows={5}
                    variant="outlined"
                    field={field}
                    form={form}
                    type="text"
                    label="Please enter a reject reason"
                    error={errors.rejectReason}
                  />
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
                  Reject
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
