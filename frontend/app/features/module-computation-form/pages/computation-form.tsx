import { FC, useCallback, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useToggle } from 'react-use';
import { NextPage } from 'next';

import { Typography } from '@smar/ui';

import { createQueryPrefetcher } from 'libs/react-query';
import { redirect } from 'libs/redirect';
import { scrollToElement } from 'libs/scroll-to';
import { withPageAuth } from 'features/auth';
import { Head, LayoutWithSidebar } from 'features/layout';
import { getComputationModuleQueryKey } from 'features/store';
import { useCurrentUser } from 'features/user';

import { getComputationFormQueryKey, sendComputationFormReq } from '../api';
import { ComputationProvider, useComputationForm } from '../hook';
import { ProgressSteps } from '../molecules/progress-steps';
import { UploadFile } from '../molecules/upload-file';
import { LinksModal } from '../organisms/links-modal';
import { StepContent } from '../organisms/step-content';
import { Summary } from '../organisms/summary';

export const ComputationForm: FC<{ computationModule?: Module }> = ({ computationModule }) => {
  const {
    steps,
    computationForm,
    activeStep,
    computationFormMeta,
    computationRequestFile,
    stepValues,
    showFileErrorSet,
  } = useComputationForm();
  const { currentUser } = useCurrentUser();
  const methods = useForm();
  const { mutate: sendModuleComputationForm, ...sendComputationFormState } = useMutation(
    sendComputationFormReq,
  );

  const sendComputationForm = useCallback(async () => {
    if (computationForm?.filesBlockEnabled && !computationRequestFile) {
      scrollToElement('simulationFile', 200);
      showFileErrorSet(true);
      return null;
    }
    const attachmentAttributes = computationRequestFile
      ? {
          file: computationRequestFile,
          fileType: 'computationRequestData',
        }
      : {};

    await sendModuleComputationForm(
      {
        computationRequest: {
          authorId: currentUser?.id,
          computationFormId: computationForm?.computationFormId,
          steps: stepValues,
          attachmentAttributes,
        },
      },
      {
        onSuccess: ({ data }: any) => {
          redirect(null, `/orders/modules/${data?.payload?.id}`);
        },
      },
    );
  }, [
    computationForm?.filesBlockEnabled,
    computationForm?.computationFormId,
    computationRequestFile,
    sendModuleComputationForm,
    currentUser?.id,
    stepValues,
    showFileErrorSet,
  ]);

  const [linksModalOpen, toggleLinksModal] = useToggle(false);

  return (
    <>
      <Head title="Computation Form" />
      <Typography as="h1" variant="h300" mb={1}>
        {computationModule?.title}
      </Typography>
      <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
        Description
      </Typography>
      <Typography variant="p130" mb={3} color="secondaryDarkBlue910" style={{ maxWidth: 906 }}>
        {computationModule?.description}
      </Typography>

      {computationForm?.filesBlockEnabled && (
        <>
          <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
            Simulation results
          </Typography>
          <div className="flex items-center">
            <div>
              <UploadFile name="file" />
            </div>
            <Typography ml={4} variant="p130" style={{ maxWidth: 536 }}>
              Upload data from your simulation here. To create correct file with the data please use
              our software called Macro.{' '}
              <Typography
                as="button"
                variant="p130"
                color="primaryBlue900"
                onClick={toggleLinksModal}
              >
                You can download it here.
              </Typography>
            </Typography>
          </div>
        </>
      )}
      <ProgressSteps />
      <FormProvider {...methods}>
        {steps?.length === activeStep ? (
          <Summary
            sendComputationFormState={sendComputationFormState}
            sendFinallyForm={sendComputationForm}
          />
        ) : (
          <StepContent />
        )}
      </FormProvider>

      <LinksModal
        links={computationFormMeta?.links}
        isOpen={linksModalOpen}
        onClose={toggleLinksModal}
      />
    </>
  );
};

const ComputationFormImpl: NextPage<{
  moduleId: ID;
  formId: ID;
}> = ({ moduleId, formId }) => {
  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getComputationModuleQueryKey({ moduleId }),
    { refetchOnWindowFocus: false },
  );

  const { data: computationForm } = useQuery<ComputationFormDTO>(
    getComputationFormQueryKey({ formId }),
    { refetchOnWindowFocus: false },
  );

  const breadcrumbs = useMemo(
    () => [
      { label: 'Marketplace' },
      { label: 'Functional modules', href: '/store/modules' },
      {
        label: computationModule?.payload.title as string,
        href: `/store/modules/${computationForm?.payload.computationModuleId}`,
      },
      { label: 'Computation Form' },
    ],
    [computationForm?.payload.computationModuleId, computationModule?.payload],
  );

  return (
    <LayoutWithSidebar breadcrumbs={breadcrumbs}>
      <ComputationProvider
        payload={computationForm?.payload}
        computationFormMeta={computationForm?.meta}
      >
        <ComputationForm computationModule={computationModule?.payload} />
      </ComputationProvider>
    </LayoutWithSidebar>
  );
};

ComputationFormImpl.getInitialProps = async ctx => {
  const props = {
    moduleId: ctx.query.moduleId?.toString() ?? '',
    formId: ctx.query.formId?.toString() ?? '',
  };

  if (!ctx.req) return props;

  if (ctx.query.step || ctx.query.edit || ctx.query.tab) {
    redirect(ctx, `/store/modules/${props.moduleId}/computation-form/${props.formId}`);
  }

  const { queryCache, fetcher, getDehydratedProps } = createQueryPrefetcher(ctx);

  await Promise.all([
    queryCache.fetchQuery(getComputationModuleQueryKey({ moduleId: props.moduleId }), fetcher),
    queryCache.fetchQuery(getComputationFormQueryKey({ formId: props.formId }), fetcher),
  ]);

  return { ...props, ...getDehydratedProps() };
};

export const ComputationFormPage = withPageAuth({ roles: ['user'] })(ComputationFormImpl);
