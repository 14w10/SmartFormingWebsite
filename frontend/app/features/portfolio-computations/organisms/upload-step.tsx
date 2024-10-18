import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { FormField } from '@smar/ui';

import { UploadFile } from 'features/upload-file';

import { useComputationPortfolioForm } from '../hooks/use-computation-portfolio';
import { Accept } from 'react-dropzone';

const acceptTypePortfolio: Accept = {
  'application/xml': ['.xml'],  // MIME type for XML files
  'application/zip': ['.zip']     // MIME type for ZIP files
};

export const UploadStep = () => {
  const { query, push, pathname } = useRouter();
  const { countPreModules } = useComputationPortfolioForm();
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col">
        <div className="flex items-center">
          <div className="flex items-center">
            <FormField
              component={UploadFile}
              className="w-29 mb-2"
              controlled
              name="attachModule"
              label="Your model"
              required
              accept={acceptTypePortfolio}
              onSuccess={() =>
                push({
                  pathname,
                  query: {
                    portfolioId: query.portfolioId,
                    module: countPreModules,
                    iteration: ((query.iteration && parseInt(query.iteration as any)) || 0) + 1,
                  },
                })
              }
            />
            <p className="v-p130 ml-2">
              Please upload your model on this stage. Only ZIP or XML files.
            </p>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
