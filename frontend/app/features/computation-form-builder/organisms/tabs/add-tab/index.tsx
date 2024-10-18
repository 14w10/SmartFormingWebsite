import { useCallback } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import { Field, FieldProps, Form, Formik, FormikHelpers } from 'formik';
import camelCase from 'lodash.camelcase';
import { TextField } from 'ui-legacy';

import { Modal } from '../../../atoms/modal';
import { useFormBuilderActions } from '../../../hooks/use-form-builder';
import { initialValues, validationSchema } from './validation-schema';

const useStyles = makeStyles(() => ({
  dialogContent: {
    overflow: 'initial',
  },
}));

export const AddTab = () => {
  const { state, actions, formErrorSet } = useFormBuilderActions();
  const { initialFieldValues, schema, currentStep, isOpen } = state;
  const { addTab, handleCloseModal, editTab } = actions;
  const classes = useStyles();

  const onSubmit = useCallback(
    async (values: { [x: string]: any; title?: any; description?: any; tabName?: any; }, actions: FormikHelpers<any>) => {
      const { tabName, ...restValues } = values;
      const newFieldValue = {
        type: 'array',
        ...restValues,
      };
      const properties: any = schema[currentStep].properties;
      const isExist = Object.keys(properties).filter(
        item => camelCase(properties[item].description) === camelCase(values.title),
      );
      if (tabName) {
        editTab(tabName, newFieldValue);
        handleCloseModal();
        return {};
      }
      if (
        isExist.length === 0 ||
        (isExist.length === 0 && camelCase((initialFieldValues as any).title))
      ) {
        handleCloseModal();
        addTab(values.title, values.description);
        formErrorSet(null);
      } else {
        actions.setFieldError('title', 'Field should be unique');
      }
    },
    [addTab, currentStep, editTab, formErrorSet, handleCloseModal, initialFieldValues, schema],
  );

  return (
    <Modal isOpen={isOpen == 'tab'} handleClose={handleCloseModal}>
      <DialogTitle>Add tab</DialogTitle>

      <Formik
        initialValues={{ ...initialValues, ...initialFieldValues }}
        validateOnChange={false}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, handleSubmit }) => {
          return (
            <Form>
              <DialogContent className={classes.dialogContent}>
                <Field
                  name="title"
                  render={({ field, form }: FieldProps) => (
                    <TextField field={field} form={form} label="Tab title*" error={errors.title} />
                  )}
                />
                <Field
                  name="description"
                  render={({ field, form }: FieldProps) => (
                    <TextField
                      field={field}
                      form={form}
                      label="Description"
                      error={errors.description}
                    />
                  )}
                />
              </DialogContent>
              <DialogActions>
                <Button color="primary" variant="outlined" type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="button"
                  variant="contained"
                  onClick={() => handleSubmit()}
                >
                  {(initialFieldValues as any).label ? 'Edit' : 'Add'}
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
