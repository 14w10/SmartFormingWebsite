import { useCallback, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import constate from 'constate';

const nope = () => null;

const useConfirmModal = () => {
  const [state, setState] = useState({
    isOpen: false,
    message: '',
    callback: nope as () => void,
  });

  const confirm = useCallback((message: string, callback: () => void) => {
    setState({
      isOpen: true,
      message,
      callback,
    });
  }, []);

  const handleClose = useCallback(() => {
    setState(prevState => ({
      isOpen: false,
      message: prevState.message,
      callback: nope,
    }));
  }, []);

  return { confirm, handleClose, state };
};
export const [ConfirmModalProvider, useConfirmModalContext] = constate(useConfirmModal);

export const ConfirmModal = () => {
  const { state, handleClose } = useConfirmModalContext();
  return (
    <Dialog disableAutoFocus open={state.isOpen} onClose={handleClose}>
      <DialogTitle>{state.message}</DialogTitle>
      <DialogActions disableSpacing>
        <Button onClick={handleClose} variant="outlined" color="primary">
          No
        </Button>
        <Box ml={1}>
          <Button
            onClick={() => {
              state.callback();
              handleClose();
            }}
            variant="contained"
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
