import { useCallback } from 'react';
import { Box, Button } from '@material-ui/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import { TextField } from 'ui-legacy';

import { initialValues, validationSchema } from './validation-schema';

interface IReasonForm {
  handleClose: () => void;
  handleChangeStatus: (values: { status: PortfolioRequestStatus; declineReason?: string }) => void;
}

export const ReasonForm = ({ handleClose, handleChangeStatus }: IReasonForm) => {
  const handleSubmit = useCallback(
    ({ declineReason }: { declineReason: string }) => {
      handleChangeStatus({ status: 'declined', declineReason });
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
                name="declineReason"
                render={({ field, form }: FieldProps) => (
                  <TextField
                    multiline
                    rows={5}
                    variant="outlined"
                    field={field}
                    form={form}
                    type="text"
                    label="Please enter a decline reason"
                    error={errors.declineReason}
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
                  Decline
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};
