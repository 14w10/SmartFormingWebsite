import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import { ReasonForm } from './reason-form';

interface IModal {
  handleClose: () => void;
  handleChangeStatus: (values: any) => void;
  open: boolean;
}

export const Modal = ({ handleClose, handleChangeStatus, open }: IModal) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Decline Reason</DialogTitle>
      <DialogContent>
        <ReasonForm handleClose={handleClose} handleChangeStatus={handleChangeStatus} />
      </DialogContent>
    </Dialog>
  );
};
