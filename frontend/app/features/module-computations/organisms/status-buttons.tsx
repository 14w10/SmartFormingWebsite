import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import { Button, Modal, ModalCloseButton, useConfirmModal } from '@smar/ui';

import { changeStatusReq, getComputationKey } from '../api';
import { DeclineForm } from './decline-form';
import { FinishForm } from './finish-form';

const dialogMessages = {
  processing: 'Are you sure you want to process this module?',
};

interface StatusButtonsProps {
  status: Computation['status'];
}

export const StatusButtons = ({ status }: StatusButtonsProps) => {
  const { confirm } = useConfirmModal();
  const queryCache = useQueryClient();
  const [isOpen, isOpenSet] = useState<false | 'finish' | 'decline'>(false);
  const { query } = useRouter();
  const { mutate: changeStatus } = useMutation(changeStatusReq, {
    onSuccess: () => {
      queryCache.invalidateQueries(getComputationKey({ computationId: query.computationId as ID }));
    },
  });
  const handleClose = useCallback(() => isOpenSet(false), []);
  const isNew = status === 'new';
  const processing = status === 'processing';

  const handleChangeStatus = useCallback(
    (newStatus: Computation['status'], data?: any) => {
      if (newStatus === 'processing') {
        confirm(dialogMessages[newStatus as keyof typeof dialogMessages], () =>
          changeStatus({ status: newStatus, computationId: query.computationId as ID }),
        );
      } else {
        changeStatus({ status: newStatus, computationId: query.computationId as ID, ...data });
      }
    },
    [changeStatus, confirm, query.computationId],
  );

  return (
    <>
      {isNew && (
        <div className="flex">
          <Button
            type="button"
            variant="outlined"
            color="primary"
            onClick={() => isOpenSet('decline')}
          >
            Decline
          </Button>
          <Button
            className="ml-2"
            component="button"
            type="button"
            color="primary"
            onClick={() => handleChangeStatus('processing')}
          >
            Process
          </Button>
        </div>
      )}

      {processing && (
        <Button className="ml-2" type="button" color="primary" onClick={() => isOpenSet('finish')}>
          Finish
        </Button>
      )}
      <Modal isOpen={Boolean(isOpen)} onClose={handleClose}>
        <div className="shadow-shadow4 p-3 max-w-full bg-white rounded-md" style={{ width: 638 }}>
          <div className="flex items-center">
            <h3 className="text-secondaryDarkBlue900 v-text110">
              {isOpen === 'decline' ? 'Decline' : 'Finish'}
            </h3>
            <ModalCloseButton onClick={handleClose} />
          </div>
          <div className="mt-2">
            {isOpen === 'decline' ? (
              <DeclineForm handleChangeStatus={handleChangeStatus} handleClose={handleClose} />
            ) : (
              <FinishForm handleChangeStatus={handleChangeStatus} handleClose={handleClose} />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
