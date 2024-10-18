import { FC, useMemo } from 'react';
import Link from 'next/link';
import { Box, Button, makeStyles, Paper, Typography } from '@material-ui/core';
import { Field, FieldProps, Form, Formik, FormikErrors, FormikHelpers, FormikProps } from 'formik';

import { FieldFile } from '../../molecules';
import { DynamicField } from './dynamic-field';
import { useDynamicForm } from './use-dynamic-form';
import { validationFilesSchema } from './validate-files';
import { Accept } from 'react-dropzone';

const useStyles = makeStyles(() => ({
  paperRoot: {
    marginTop: 16,
    padding: 24,
  },
  button: {
    marginRight: 16,
  },
}));

const acceptTypeDynamicForm: Accept = {
  'application/zip': ['.zip'],
};

export interface IDynamicFormProps {
  initialValues?: DynamicObj;
  onSubmit: (values: any, formikActions: FormikHelpers<any>) => void;
  schema: DynamicObj;
  moduleId?: number | string;
  countSteps: number;
  activeStep: number;
  handleBackStep: () => void;
  files: IFileField[];
}

export const DynamicForm: FC<IDynamicFormProps> = ({
  schema,
  onSubmit,
  initialValues,
  moduleId,
  countSteps,
  activeStep,
  handleBackStep,
  files,
}) => {
  const form = useDynamicForm(schema, initialValues);
  const classes = useStyles();

  const isFiles = files.length > 0 && activeStep === countSteps - 1;

  const initialFileValues = useMemo(() => {
    if (isFiles) {
      return files.reduce(
        (acc, item) => ({ files: { ...(acc as any).files, [item.fieldName]: '' } }),
        {},
      );
    }
    return {};
  }, [files, isFiles]);

  return (
    <Formik
      initialValues={{ ...form.initialValues, ...initialFileValues }}
      validateOnChange={false}
      validate={form.validate}
      validationSchema={() => validationFilesSchema(files, isFiles)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, isSubmitting, status }: FormikProps<FormikErrors<any>>) => {
        return (
          <Form>
            <Paper className={classes.paperRoot} elevation={0}>
              <Box pb={2}>
                {form.fields.map(item => (
                  <DynamicField key={item.name} errors={errors} {...item} />
                ))}
              </Box>
            </Paper>
            {isFiles && (
              <Paper className={classes.paperRoot} elevation={0}>
                {files.map(item => (
                  <Box key={item.fieldName} pb={2}>
                    <Field
                      name={`files.${item.fieldName}`}
                      render={({ field, form }: FieldProps) => (
                        <FieldFile
                          form={form}
                          field={field}
                          label={item.label}
                          accept={acceptTypeDynamicForm}
                          helperText={item.description}
                          error={errors.files && errors.files[item.fieldName as any]}
                          isComputation
                        />
                      )}
                    />
                  </Box>
                ))}
              </Paper>
            )}

            {status && (
              <Box mt={2}>
                <Typography color="error" align="left">
                  {status}
                </Typography>
              </Box>
            )}
            <Box mt={2}>
              {countSteps !== 1 && (
                <Button
                  variant="outlined"
                  color="primary"
                  type="button"
                  disabled={activeStep === 0}
                  onClick={handleBackStep}
                  className={classes.button}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                className={classes.button}
              >
                {countSteps === 1 || activeStep === countSteps - 1 ? 'Submit' : 'Next'}
              </Button>
              <Link href="/store/modules/[moduleId]" as={`/store/modules/${moduleId}`}>
                <Button component="a">Cancel</Button>
              </Link>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
