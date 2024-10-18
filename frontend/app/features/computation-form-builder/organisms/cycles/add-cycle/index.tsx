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

export const AddCycle = () => {
  const { state, actions } = useFormBuilderActions();
  const { initialFieldValues, schema, currentStep, isOpen } = state;
  const { handleCloseModal, editTab, addCycle } = actions;
  const classes = useStyles();

  const onSubmit = useCallback(
    async (values: { [x: string]: any; title?: any; tabName?: any; label?: any; }, actions: FormikHelpers<any>) => {
      const { tabName, label, ...restValues } = values;
      const fieldValue = {
        type: 'array',
        minItems: 1,
        items: {
          properties: {},
          type: 'object',
        },
        ...restValues,
      };
      const properties: any = schema[currentStep].properties;
      const isExist = Object.keys(properties).filter(
        item => camelCase(properties[item].description) === camelCase(values.title),
      );
      if (tabName) {
        editTab(tabName, fieldValue);
        handleCloseModal();
        return {};
      }
      if (
        isExist.length === 0 ||
        (isExist.length === 0 && camelCase((initialFieldValues as any).title))
      ) {
        handleCloseModal();
        addCycle(fieldValue);
      } else {
        actions.setFieldError('title', 'Field should be unique');
      }
    },
    [addCycle, currentStep, editTab, handleCloseModal, initialFieldValues, schema],
  );

  return (
    <Modal isOpen={isOpen == 'cycle'} handleClose={handleCloseModal}>
      <DialogTitle>Add cycle</DialogTitle>

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
                    <TextField field={field} form={form} label="Title*" error={errors.title} />
                  )}
                />
                <Field
                  name="maxItems"
                  render={({ field, form }: FieldProps) => (
                    <TextField
                      field={field}
                      form={form}
                      type="number"
                      onWheel={(event: any) => event.currentTarget.blur()}
                      label="Number of cycle elements*"
                      error={errors.maxItems}
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
