import { useCallback, useState } from 'react';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useConfirmModalContext } from 'ui-legacy';

import { Modal } from './modal';

const useStyles = makeStyles(() => ({
  statusButton: {
    marginLeft: 16,
  },
}));

const dialogMessages = {
  approved: 'Are you sure you want to approve this portfolio request?',
};

interface IStatuses {
  payload: PortfolioRequest;
  changeStatus: (values: any) => void;
}

export const StatusButtons = ({ payload, changeStatus }: IStatuses) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const { confirm } = useConfirmModalContext();

  const isNew = payload.status === 'new';

  const handleChangeStatus = useCallback(
    (newStatus: PortfolioRequestStatus) => {
      newStatus === 'declined'
        ? setOpen(true)
        : confirm(dialogMessages[newStatus as keyof typeof dialogMessages], () =>
            changeStatus({ status: newStatus }),
          );
    },
    [changeStatus, confirm],
  );

  return (
    <>
      {isNew && (
        <Box display="flex">
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => handleChangeStatus('declined')}
          >
            Decline
          </Button>
          <Button
            className={classes.statusButton}
            type="button"
            variant="contained"
            color="primary"
            onClick={() => handleChangeStatus('approved')}
          >
            Approve
          </Button>
        </Box>
      )}

      <Modal open={open} handleClose={() => setOpen(false)} handleChangeStatus={changeStatus} />
    </>
  );
};
