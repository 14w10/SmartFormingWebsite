import { useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

import { ReasonForm } from './reason-form';

interface IDeclineDialog {
  handleClose: () => void;
  handleChangeStatus: ({
    status,
    declineReason,
  }: {
    status: string;
    declineReason?: string;
  }) => void;
  open: boolean;
  id: number;
}

export const DeclineDialog = ({ handleClose, handleChangeStatus, open }: IDeclineDialog) => {
  const handleSubmitStatus = useCallback(
    (declineReason: string) => {
      handleChangeStatus({ status: 'decline', declineReason });
      handleClose();
    },
    [handleChangeStatus, handleClose],
  );

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Decline Reason</DialogTitle>
      <DialogContent>
        <ReasonForm handleClose={handleClose} handleChangeStatus={handleSubmitStatus} />
      </DialogContent>
    </Dialog>
  );
};
