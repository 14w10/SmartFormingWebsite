import { useCallback } from 'react';
import { useMutation } from 'react-query';
import Link from 'next/link';
import { Box, Button, Paper, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Field, FieldProps, Form, Formik } from 'formik';
import { TextField } from 'ui-legacy';

import { redirect } from 'libs/redirect';

import { createEditorReq } from '../../api';
import { initialValues, validationSchema } from './validation-schema';

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      marginRight: theme.spacing(1),
    },
  }),
);

export const CreateEditorForm = () => {
  const { mutate: createEditor } = useMutation(createEditorReq, {
    onSuccess: () => {
      redirect(null, '/editors');
    },
  });
  const classes = useStyles();

  const onSubmit = useCallback(
    (values: { firstName: string; lastName: string; email: string; }, actions: { setErrors: (arg0: any) => void; }) => {
      createEditor(values, {
        onError: (errorData: any) => {
          actions.setErrors(errorData?.errors.data.attributes);
        },
      });
    },
    [createEditor],
  );

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, status }) => {
        return (
          <Form>
            <Paper elevation={0}>
              <Box p={2} pt={0} pb={4}>
                <Field
                  name="firstName"
                  render={({ field, form }: FieldProps) => (
                    <TextField
                      field={field}
                      form={form}
                      label="First Name"
                      placeholder="Enter your first name"
                      error={errors.firstName}
                    />
                  )}
                />

                <Field
                  name="lastName"
                  render={({ field, form }: FieldProps) => (
                    <TextField
                      field={field}
                      form={form}
                      label="Last Name"
                      placeholder="Enter your last name"
                      error={errors.lastName}
                    />
                  )}
                />

                <Field
                  name="email"
                  render={({ field, form }: FieldProps) => (
                    <TextField
                      field={field}
                      form={form}
                      type="email"
                      label="Email"
                      placeholder="Enter your Email"
                      error={errors.email}
                    />
                  )}
                />

                {status && (
                  <Box>
                    <Typography color="error" align="center">
                      {status}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" className={classes.button}>
                Save
              </Button>
              <Link href="/editors">
                <Button component="a" color="default">
                  Cancel
                </Button>
              </Link>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
