import { FC, ReactNode } from 'react';
import { Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 500,
    maxWidth: 500,
  },
}));

interface IModal {
  isOpen: boolean;
  handleClose: () => void;
  children?: ReactNode;
}

export const Modal: FC<IModal> = ({ isOpen, handleClose, children }) => {
  const classes = useStyles();

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: classes.root }}>
      {children}
    </Dialog>
  );
};
