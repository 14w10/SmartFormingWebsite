import React, { SyntheticEvent, useCallback } from 'react';
import { TextField as Field } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FieldProps, getIn } from 'formik';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    '& p': {
      position: 'absolute',
      bottom: -24,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '100%',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
  },
}));

interface TextFieldProps {
  error?: string;
  label?: string;
  margin?: 'normal' | 'dense';
  type?: string;
  helperText?: string;
  inputComponent?: any;
  form?: FieldProps['form'];
  field: FieldProps['field'];
  [key: string]: any;
}

const regExpSpaceBefore = /^\s+/g;

export const TextField = ({
  error,
  label,
  type = 'text',
  form,
  field,
  helperText,
  margin = 'normal',
  inputComponent,
  startAdornment,
  ...rest
}: TextFieldProps) => {
  const classes = useStyles();

  const handleChange = useCallback(
    (e: SyntheticEvent) => {
      const value = (e.target as any).value;
      const multilineValue =
        type === 'number'
          ? value
          : rest.multiline
          ? value.replace(regExpSpaceBefore, '')
          : value.slice(0, 140).replace(regExpSpaceBefore, '');

      const parseNumber = parseFloat(multilineValue);

      const formattedValue =
        type === 'number' ? (isNaN(parseNumber) ? '' : parseNumber) : multilineValue;

      form && form.setFieldValue(field.name, formattedValue);
    },
    [field.name, form, rest.multiline, type],
  );
  return (
    <Field
      {...field}
      {...rest}
      onChange={handleChange}
      className={classes.root}
      error={form ? getIn(form.touched, field.name) && Boolean(error) : Boolean(error)}
      label={label}
      margin={margin}
      fullWidth
      type={type}
      helperText={error ? (form ? getIn(form.touched, field.name) && error : error) : helperText}
      defaultValue=""
      InputProps={{ inputComponent, startAdornment }}
    />
  );
};
