import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

import { Button, Modal, ModalContent, useConfirmModal } from '@smar/ui';

import { useCurrentUser } from 'features/user';

import { changeStatusReq, getPortfolioQueryKey } from '../api';
import { MODULE_ACTIONS } from '../constants';
import { DeclineForm } from './decline-form';

const dialogMessages = {
  published: 'Are you sure you want to publish this portfolio?',
};

export const StatusButtons = ({ portfolio }: { portfolio: Portfolio }) => {
  const queryCache = useQueryClient();
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';

  const [isRejectOpen, isRejectOpenSet] = useState(false);
  const handleClose = useCallback(() => isRejectOpenSet(false), []);

  const { mutate: changeStatus } = useMutation(changeStatusReq, {
    onSuccess: () =>
      queryCache.invalidateQueries(
        getPortfolioQueryKey({ portfolioId: query.portfolioId as ID, isUser }),
      ),
  });
  const { confirm } = useConfirmModal();

  const isNew = portfolio.status === 'new';
  const isUnderReview = portfolio.status === 'under_review';

  const handleChangeStatus = useCallback(
    (newStatus: ModuleStatus, rejectReason?: string) => {
      switch (newStatus) {
        case 'under_review':
        case 'rejected':
          changeStatus({ portfolioId: portfolio?.id as ID, status: newStatus, rejectReason });
          break;
        default:
          confirm(dialogMessages[newStatus as keyof typeof dialogMessages], () =>
            changeStatus({ portfolioId: portfolio?.id as ID, status: newStatus }),
          );
      }
    },
    [changeStatus, confirm, portfolio?.id],
  );

  return (
    <>
      {isNew && (
        <Button type="button" onClick={() => handleChangeStatus('under_review')}>
          {MODULE_ACTIONS.underReview}
        </Button>
      )}
      {isUnderReview && (
        <div className="flex">
          <Button type="button" variant="outlined" onClick={() => isRejectOpenSet(true)}>
            {MODULE_ACTIONS.reject}
          </Button>

          <div className="ml-2">
            <Button onClick={() => handleChangeStatus('published')}>
              {MODULE_ACTIONS.publish}
            </Button>
          </div>
        </div>
      )}
      <Modal isOpen={isRejectOpen} onClose={handleClose}>
        <ModalContent title="Decline" handleClose={handleClose}>
          <div className="mt-2">
            <DeclineForm handleChangeStatus={handleChangeStatus} handleClose={handleClose} />
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};
