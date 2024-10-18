import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button } from '@material-ui/core';
import { useConfirmModalContext } from 'ui-legacy';

import { redirect } from 'libs/redirect';
import { useValidateForm } from 'features/computation-form-builder/hooks/use-validate-form';
import { useCurrentUser } from 'features/user';

import { changeStatusReq, deleteModuleReq, duplicateModuleReq, getModuleQueryKey } from '../api';
import { MODULE_ACTIONS } from '../constants';
import { PublishDialog } from './publish-dialog';
import { RejectDialog } from './reject-dialog';

const dialogMessages = {
  approved: 'Are you sure you want to approve this module?',
  published: 'Are you sure you want to publish this module?',
  delete: 'Are you sure you want to delete this module?',
  duplicate: 'Are you sure you want to duplicate this module?',
};

export const StatusButtons = ({ module }: { module: Module }) => {
  const { confirm } = useConfirmModalContext();
  const { validateFormBuilder } = useValidateForm();
  const queryCache = useQueryClient();
  const { query, push } = useRouter();

  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';
  const isAdmin = currentUser && currentUser.role === 'admin';

  const [isRejectOpen, isRejectOpenSet] = useState(false);
  const [isPublishOpen, isPublishOpenSet] = useState(false);

  const { mutate: changeStatus } = useMutation(changeStatusReq, {
    onSuccess: () => {
      queryCache.invalidateQueries(getModuleQueryKey({ moduleId: query.moduleId as ID, isUser }));
    },
  });
  const { mutate: deleteModule } = useMutation(deleteModuleReq, {
    onSuccess: () => {
      redirect(null, '/modules');
    },
  });
  const { mutate: duplicateModule } = useMutation(duplicateModuleReq, {
    onSuccess: ({ data }) => {
      redirect(null, `/modules/${data?.payload?.id}`);
    },
  });

  const handleDuplicate = useCallback(() => {
    confirm(dialogMessages['duplicate'], () => duplicateModule(query.moduleId as ID));
  }, [confirm, duplicateModule, query.moduleId]);

  const isNew = module.status === 'new';
  const isApproved = module.status === 'approved';
  const isUnderReview = module.status === 'under_review';

  const handleDeleteModule = useCallback(() => {
    confirm(dialogMessages['delete'], () => deleteModule(module?.id as ID));
  }, [confirm, deleteModule, module?.id]);

  const openPublish = useCallback(() => {
    if (!validateFormBuilder()) {
      isPublishOpenSet(true);
    } else {
      push(`/modules/${query.moduleId}/form-builder/${module.computationFormId}?validate=true`);
    }
  }, [module.computationFormId, push, query.moduleId, validateFormBuilder]);

  const handleChangeStatus = useCallback(
    (newStatus: ModuleStatus, rejectReason?: string) => {
      switch (newStatus) {
        case 'under_review':
        case 'rejected':
          changeStatus({ moduleId: module?.id as ID, status: newStatus, rejectReason });
          break;
        default:
          confirm(dialogMessages[newStatus as keyof typeof dialogMessages], () =>
            changeStatus({ moduleId: module?.id as ID, status: newStatus }),
          );
      }
    },
    [changeStatus, confirm, module?.id],
  );

  return (
    <>
      <Box display="flex">
        {!isUser && (
          <>
            {isNew && (
              <Button
                component="button"
                type="button"
                variant="contained"
                color="primary"
                onClick={() => handleChangeStatus('under_review')}
              >
                {MODULE_ACTIONS.underReview}
              </Button>
            )}
            {isUnderReview && (
              <Box display="flex">
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={() => isRejectOpenSet(true)}
                >
                  {MODULE_ACTIONS.reject}
                </Button>
                {module.moduleContentType !== 'data_module' && (
                  <div className="ml-2">
                    <Link
                      href={`/modules/${
                        module.computationFormId
                          ? `${module.id}/form-builder/${module.computationFormId}`
                          : `${module.id}/form-builder`
                      }`}
                      passHref
                    >
                      <Button component="a" type="button" variant="contained" color="primary">
                        {module.computationFormId
                          ? 'Edit Computation Form'
                          : 'Create Computation Form'}
                      </Button>
                    </Link>
                  </div>
                )}
                {(module.computationFormId || module.moduleContentType === 'data_module') && (
                  <Box ml={2}>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={() => handleChangeStatus('approved')}
                    >
                      {MODULE_ACTIONS.approve}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            {isApproved && isAdmin && (
              <Box display="flex">
                {module.moduleContentType !== 'data_module' && (
                  <Link
                    href={`/modules/${
                      module.computationFormId
                        ? `${module.id}/form-builder/${module.computationFormId}`
                        : `${module.id}/form-builder`
                    }`}
                    passHref
                  >
                    <Button component="a" type="button" variant="contained" color="primary">
                      {module.computationFormId
                        ? 'Edit Computation Form'
                        : 'Create Computation Form'}
                    </Button>
                  </Link>
                )}
                {(module.computationFormId || module.moduleContentType === 'data_module') && (
                  <Box ml={2}>
                    <Button type="button" variant="contained" color="primary" onClick={openPublish}>
                      {MODULE_ACTIONS.publish}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
        {(isAdmin || (isUser && (isNew || isUnderReview))) && (
          <div className="ml-2">
            <Link href={`${isUser ? '/my' : ''}/modules/${module.id}/edit`} passHref>
              <Button component="a" type="button" variant="contained" color="primary">
                Edit module
              </Button>
            </Link>
          </div>
        )}
        {isAdmin && (
          <>
            <div className="ml-2">
              <Button type="button" variant="contained" color="primary" onClick={handleDuplicate}>
                Duplicate module
              </Button>
            </div>
            <div className="ml-2">
              <Button
                type="button"
                variant="contained"
                color="primary"
                className="bg-auxiliaryRed900"
                onClick={handleDeleteModule}
              >
                Delete module
              </Button>
            </div>
          </>
        )}
      </Box>
      <RejectDialog
        open={isRejectOpen}
        handleClose={() => isRejectOpenSet(false)}
        handleChangeStatus={handleChangeStatus}
      />
      <PublishDialog open={isPublishOpen} handleClose={() => isPublishOpenSet(false)} />
    </>
  );
};
