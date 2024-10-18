import { Dialog, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';

import { Form } from './form';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

interface IPublishDialog {
  handleClose: () => void;
  open: boolean;
}

export const PublishDialog = ({ handleClose, open }: IPublishDialog) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose} classes={{ paper: classes.root }}>
      <DialogTitle>Enter module ID to publish</DialogTitle>
      <DialogContent>
        <Form handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};
