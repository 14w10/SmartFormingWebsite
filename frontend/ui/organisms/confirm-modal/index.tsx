import { useCallback, useEffect, useState } from 'react';
import constate from 'constate';

import { Button } from '../../atoms';
import { Modal, ModalCloseButton } from '../modal';

const nope = () => null;

const useConfirmModalBase = () => {
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
export const [ConfirmModalProvider, useConfirmModal] = constate(useConfirmModalBase);

export const ConfirmModal = () => {
  const { state, handleClose } = useConfirmModal();
  const [error, setError] = useState();

  const handleConfirm = useCallback(async () => {
    try {
      await state.callback();
      handleClose();
    } catch (error: any) {
      error?.errors?.data && setError(error?.errors?.data);
    }
  }, [handleClose, state]);

  useEffect(() => {
    if (!state.isOpen) {
      setError(undefined);
    }
  }, [state.isOpen]);

  return (
    <Modal isOpen={state.isOpen} onClose={handleClose}>
      <div className="shadow-shadow4 p-3 max-w-full bg-white rounded-md" style={{ width: 438 }}>
        <div className="flex items-center justify-end">
          <ModalCloseButton onClick={handleClose} />
        </div>
        <div className="mt-2">
          <p className="v-h200">{state.message}</p>
          {error && <p className="text-auxiliaryRed900 mt-2 text-sm">{error}</p>}
          <div className="relative flex justify-end mt-2">
            <Button className="mr-2" variant="outlined" onClick={handleClose}>
              No
            </Button>
            <Button type="submit" onClick={handleConfirm}>
              Yes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
