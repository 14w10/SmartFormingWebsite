import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { AddOutlined, Close } from '@material-ui/icons';
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik';
import { SelectField, TextField } from 'ui-legacy';

import { Modal } from '../../../atoms/modal';
import { useFormBuilderActions } from '../../../hooks/use-form-builder';
import { initialValues, selectValidationSchema, sliderValidationSchema } from './validation-schema';

const typeOptions = [
  { label: 'Slider', value: 'integer' },
  { label: 'Select', value: 'string' },
];

const schemaByType = {
  integer: sliderValidationSchema,
  string: selectValidationSchema,
};

const useStyles = makeStyles(() => ({
  dialogContent: {
    overflow: 'initial',
  },
  removeButton: { padding: '4px', height: '32px', margin: 'auto' },
}));

const SchemaSet: FC<{ values: { type: string }; schemaSet: (newType: any) => any }> = ({
  values,
  schemaSet,
}) => {
  useEffect(() => {
    schemaSet((schemaByType as any)[values.type]);
  }, [values.type, schemaSet]);

  return null;
};

export const AddField = () => {
  const { state, actions, formErrorSet } = useFormBuilderActions();
  const { initialFieldValues, isOpen } = state;

  const initialFormValues = useMemo(() => ({ ...initialValues, ...initialFieldValues }), [
    initialFieldValues,
  ]);

  const { addField, handleCloseModal, editField } = actions;
  const classes = useStyles();
  const [schema, schemaSet] = useState((schemaByType as any)[initialFormValues.type]);

  const onSubmit = useCallback(
    async (values?: any) => {
      const newFieldKey = new Date().getTime();
      const { stepValue, required, enum: enumField, ...restValues } = values;
      const newFieldValue =
        restValues.type === 'integer'
          ? { description: restValues.label, ...restValues, stepValue }
          : { description: restValues.label, required, enum: enumField, ...restValues };

      formErrorSet(null);
      if (values.fieldName) {
        editField(values.fieldName, newFieldValue);
        handleCloseModal();
        return {};
      }
      addField(newFieldKey, newFieldValue);
    },
    [addField, editField, formErrorSet, handleCloseModal],
  );

  const changeValueOnScroll = useCallback((event: { currentTarget: { blur: () => any; }; }) => event.currentTarget.blur(), []);

  return (
    <Modal isOpen={isOpen === 'field' || isOpen === 'cycleField'} handleClose={handleCloseModal}>
      <DialogTitle>{(initialFieldValues as any).label ? 'Edit Field' : 'Add Field'}</DialogTitle>
      <Formik
        initialValues={initialFormValues}
        validateOnChange={false}
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, values, touched, handleSubmit }) => {
          return (
            <Form>
              <SchemaSet values={values} schemaSet={schemaSet} />

              <DialogContent className={classes.dialogContent}>
                <Field
                  name="type"
                  render={({ field, form }: FieldProps) => (
                    <SelectField
                      label="Type*"
                      error={errors.type}
                      options={typeOptions}
                      defaultValue="integer"
                      {...field}
                      {...form}
                    />
                  )}
                />
                <Field
                  name="label"
                  render={({ field, form }: FieldProps) => (
                    <TextField field={field} form={form} label="Title*" error={errors.label} />
                  )}
                />
                {values.type === 'integer' && (
                  <>
                    <Field
                      name="minLength"
                      render={({ field, form }: FieldProps) => (
                        <TextField
                          type="number"
                          field={field}
                          form={form}
                          onWheel={changeValueOnScroll}
                          label="Min value*"
                          error={errors.minLength}
                        />
                      )}
                    />
                    <Field
                      name="maxLength"
                      render={({ field, form }: FieldProps) => (
                        <TextField
                          type="number"
                          field={field}
                          form={form}
                          onWheel={changeValueOnScroll}
                          label="Max value*"
                          error={errors.maxLength}
                        />
                      )}
                    />
                    <Field
                      name="stepValue"
                      render={({ field, form }: FieldProps) => (
                        <TextField
                          type="number"
                          field={field}
                          form={form}
                          label="Increment*"
                          onWheel={changeValueOnScroll}
                          error={errors.stepValue}
                        />
                      )}
                    />
                    <Field
                      name="default"
                      render={({ field, form }: FieldProps) => (
                        <TextField
                          type="number"
                          field={field}
                          form={form}
                          onWheel={changeValueOnScroll}
                          label="Default value*"
                          error={errors.default}
                        />
                      )}
                    />
                  </>
                )}

                {values.type === 'string' && (
                  <>
                    <div>
                      <Field
                        name="required"
                        render={({ field }: FieldProps) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                value={field.value}
                                checked={field.value}
                                onChange={field.onChange}
                                name={field.name}
                                color="primary"
                              />
                            }
                            label="Make this field mandatory"
                          />
                        )}
                      />
                    </div>
                    <FieldArray
                      name="enum"
                      render={arrayHelpers => (
                        <>
                          {(values as any).enum &&
                            (values as any).enum?.map((el: string, index: number) => (
                              <Box display="flex" key={index}>
                                <Field
                                  name={`enum.${index}`}
                                  render={({ field, form }: FieldProps) => (
                                    <>
                                      <TextField
                                        field={field}
                                        form={form}
                                        label={`Option ${index + 1}*`}
                                        error={
                                          typeof (errors as any)?.enum !== 'string' &&
                                          (errors as any)?.enum?.[index]
                                        }
                                      />
                                    </>
                                  )}
                                />
                                <IconButton
                                  type="button"
                                  className={classes.removeButton}
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <Close />
                                </IconButton>
                              </Box>
                            ))}

                          <Button type="button" onClick={() => arrayHelpers.push('')}>
                            <AddOutlined /> Add option
                          </Button>
                          <Typography color="error">
                            {touched && typeof errors.enum === 'string' && errors.enum}
                          </Typography>
                        </>
                      )}
                    />
                  </>
                )}
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
