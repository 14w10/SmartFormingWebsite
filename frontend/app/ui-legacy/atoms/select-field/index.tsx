import { MenuItem, TextField, TextFieldProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  textField: {
    width: '100%',
  },
}));

type Options = {
  value: string;
  label: string;
  disbled?: boolean;
}[];

type ISelectFiled = {
  label: string;
  options: Options;
  variant?: TextFieldProps['variant'];
  required?: boolean;
  defaultValue?: string;
  error?: string | undefined;
};

export const SelectField = ({
  label,
  options,
  required = false,
  variant = 'standard',
  defaultValue,
  error,
  ...fields
}: ISelectFiled) => {
  const classes = useStyles();

  return (
    <TextField
      {...fields}
      variant={variant}
      select
      label={label}
      className={classes.textField}
      margin="normal"
      required={required}
      defaultValue={defaultValue}
      error={Boolean(error)}
      helperText={error ? error : ''}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value} disabled={option.disbled}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
