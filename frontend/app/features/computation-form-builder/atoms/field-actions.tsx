import { FC } from 'react';
import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteOutlined, EditOutlined } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  button: {
    width: 16,
    height: 16,
    padding: 8,
    '&:first-child': {
      marginRight: 8,
    },
    '& svg': {
      width: 16,
      height: 16,
    },
  },
}));

interface FieldSet {
  editField: () => void;
  removeField: () => void;
}

export const FieldActions: FC<FieldSet> = ({ editField, removeField }) => {
  const classes = useStyles();

  return (
    <Box mb="5px" display="flex" justifyContent="flex-end">
      <IconButton className={classes.button} onClick={editField}>
        <EditOutlined />
      </IconButton>
      <IconButton className={classes.button} onClick={removeField}>
        <DeleteOutlined />
      </IconButton>
    </Box>
  );
};
