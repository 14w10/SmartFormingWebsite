import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useToggle } from 'react-use';
import { useRouter } from 'next/router';

import { Typography } from '@smar/ui';

import { scrollToElement } from 'libs/scroll-to';
import { useComputationForm } from 'features/module-computation-form';
import { ProgressSteps } from 'features/module-computation-form/molecules/progress-steps';
import { UploadFile } from 'features/module-computation-form/molecules/upload-file';
import { LinksModal } from 'features/module-computation-form/organisms/links-modal';
import { StepContent } from 'features/module-computation-form/organisms/step-content';
import { Summary } from 'features/module-computation-form/organisms/summary';
import { useComputationPortfolioForm } from 'features/portfolio-computations/hooks/use-computation-portfolio';
import { useCurrentUser } from 'features/user';

import { sendComputationPortfolioFormReq } from '../../api';

export const ComputationForm = ({ addModuleId }: { addModuleId: (id: ID) => void }) => {
  const { currentUser } = useCurrentUser();

  const {
    steps,
    computationForm,
    activeStep,
    computationFormMeta,
    computationRequestFile,
    showFileErrorSet,
    stepValues,
  } = useComputationForm();
  const { query, replace, pathname } = useRouter();
  const { computationModule } = useComputationPortfolioForm();
  const methods = useForm();

  const {
    mutate: sendPortfolioComputationForm,
    ...sendComputationPortfolioFormState
  } = useMutation(sendComputationPortfolioFormReq);

  const sendComputationForm = useCallback(async () => {
    if (computationForm?.filesBlockEnabled && !computationRequestFile) {
      showFileErrorSet(true);
      scrollToElement('simulationFile', 200);
      return null;
    }
    const attachmentAttributes = computationRequestFile
      ? {
          file: computationRequestFile,
          fileType: 'computationRequestData',
        }
      : {};

    sendPortfolioComputationForm(
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
          addModuleId(data?.payload?.id);
          replace({
            pathname,
            query: {
              ...query,
              computationId: data?.payload?.id,
            },
          });
        },
      },
    );
  }, [
    computationForm?.filesBlockEnabled,
    computationForm?.computationFormId,
    computationRequestFile,
    sendPortfolioComputationForm,
    currentUser?.id,
    stepValues,
    showFileErrorSet,
    addModuleId,
    replace,
    pathname,
    query,
  ]);

  const [linksModalOpen, toggleLinksModal] = useToggle(false);

  return (
    <>
      <Typography as="h2" variant="h170" mb={1} color="secondaryDarkBlue900">
        {computationModule?.payload?.title}
      </Typography>
      <Typography variant="p130" mb={1} color="secondaryDarkBlue910" style={{ maxWidth: 906 }}>
        {computationModule?.payload?.description}
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
            sendFinallyForm={sendComputationForm}
            sendComputationFormState={sendComputationPortfolioFormState}
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
