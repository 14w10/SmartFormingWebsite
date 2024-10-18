import React from 'react';
import { FormControl, Input, InputLabel } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { FieldProps } from 'formik';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: '100%',
      paddingRight: theme.spacing(1),
      '& > *': {
        width: '100%',
        margin: theme.spacing(1),
      },
    },
  }),
);

type MaskedInputProps = {
  field: FieldProps['field'];
  form?: FieldProps['form'];
  label: string;
  placeholder?: string;
  error?: string;
};

export const MaskedInput = ({ field, error, label, ...props }: MaskedInputProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <FormControl>
        <InputLabel htmlFor="formatted-text-mask-input">{label}</InputLabel>
        <Input
          id="formatted-text-mask-input"
          // inputComponent={TextMaskCustom as any}
          {...field}
          error={Boolean(error)}
          {...props}
        />
        {error && (
          <p className="text-auxiliaryRed900 absolute" style={{ bottom: -24 }}>
            {error}
          </p>
        )}
      </FormControl>
    </div>
  );
};
