import { FC } from 'react';
import { Box, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  formControl: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
  },
  helperText: {
    position: 'absolute',
    bottom: -16,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  label: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '100%',
  },
}));

interface IField {
  label: string;
  [key: string]: any;
}

export const FieldSet: FC<IField> = ({ mb = 4, label, children }) => {
  const classes = useStyles();

  return (
    <Box display="flex" alignItems="flex-end" mb={mb} justifyContent="space-between">
      <Box width="100%" pr={3}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink className={classes.label} title={label}>
            {label}
          </InputLabel>

          {children}
        </FormControl>
      </Box>
    </Box>
  );
};
