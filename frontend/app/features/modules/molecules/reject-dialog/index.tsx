import { useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import { ReasonForm } from './reason-form';

interface IRejectDialog {
  handleClose: () => void;
  handleChangeStatus: (status: ModuleStatus, rejectReason?: string) => void;
  open: boolean;
}

export const RejectDialog = ({ handleClose, handleChangeStatus, open }: IRejectDialog) => {
  const handleSubmitStatus = useCallback(
    (rejectReason: string) => {
      handleChangeStatus('rejected', rejectReason);
      handleClose();
    },
    [handleChangeStatus, handleClose],
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reject Reason</DialogTitle>
      <DialogContent>
        <ReasonForm handleClose={handleClose} handleChangeStatus={handleSubmitStatus} />
      </DialogContent>
    </Dialog>
  );
};
