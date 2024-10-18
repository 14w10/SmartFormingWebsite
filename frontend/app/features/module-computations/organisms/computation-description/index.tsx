import { FC } from 'react';

import { Card, Icon, Typography } from '@smar/ui';

import { MODULE_TYPES } from 'features/modules';
import { useCurrentUser } from 'features/user';

type ComputationDescriptionType = {
  computationModule: Computation;
  resultsData?: ComputationGraphicOptions;
};

export const ComputationDescription: FC<ComputationDescriptionType> = ({
  computationModule,
  resultsData,
}) => {
  const { currentUser } = useCurrentUser();
  const isUser = currentUser?.role === 'user';
  const isAdmin = currentUser?.role === 'admin';
  const attachment = computationModule?.attachment;

  return (
    <>
      <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
        Description
      </Typography>
      <Card className="mb-3" variant="sm">
        <div className="flex mb-3">
          <div className="mr-3 w-1/3">
            <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
              Form data
            </Typography>
            <a
              href={`/api/${isUser ? 'orders' : 'admin'}/computation_requests/${
                computationModule?.id
              }?type=file`}
              target="_blank"
              rel="noreferrer"
              className="border-secondaryDarkBlue930 rounded-large py-12px flex items-center justify-between px-2 border"
              download="data"
            >
              <Typography
                className="flex items-center"
                as="span"
                variant="text130"
                color="primaryBlue900"
              >
                <Icon name="attachment" iconFill="primaryBlue900" size={24} mr={1} />
                data.json
              </Typography>
              <Icon name="open-in-new" iconFill="primaryBlue900" size={24} />
            </a>
          </div>
          <div className="mr-3 w-1/3">
            <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
              Computation result
            </Typography>
            {resultsData?.resultUrl ? (
              <a
                href={resultsData?.resultUrl}
                target="_blank"
                rel="noreferrer"
                className="border-secondaryDarkBlue930 rounded-large py-12px flex items-center justify-between px-2 border"
                download="computation_result"
              >
                <Typography
                  className="flex items-center"
                  as="span"
                  variant="text130"
                  color="primaryBlue900"
                >
                  <Icon name="attachment" iconFill="primaryBlue900" size={24} mr={1} />
                  computation result
                </Typography>
                <Icon name="open-in-new" iconFill="primaryBlue900" size={24} />
              </a>
            ) : (
              <div className="border-secondaryDarkBlue930 rounded-large py-12px flex items-center justify-between px-2 border">
                <p className="v-text130">
                  Something went wrong during computation. Please try again
                </p>
              </div>
            )}
          </div>
          {attachment && isAdmin && (
            <div className="mr-3 w-1/3">
              <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
                Simulations result
              </Typography>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="border-secondaryDarkBlue930 rounded-large py-12px flex items-center justify-between px-2 border"
                download="simulations_results.json"
              >
                <Typography
                  className="flex items-center"
                  as="span"
                  variant="text130"
                  color="primaryBlue900"
                >
                  <Icon name="attachment" iconFill="primaryBlue900" size={24} mr={1} />
                  simulations_results.json
                </Typography>
                <Icon name="open-in-new" iconFill="primaryBlue900" size={24} />
              </a>
            </div>
          )}

          {computationModule.computationModuleType && (
            <div className="w-1/3">
              <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
                Module type
              </Typography>
              <span className="border-secondaryDarkBlue930 rounded-large py-12px text-secondaryDarkBlue910 flex items-center justify-between px-2 text-base border">
                {MODULE_TYPES[computationModule?.computationModuleType]}
              </span>
            </div>
          )}
        </div>
        <div className="mb-3">
          <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
            Short Description
          </Typography>
          <Typography variant="p130" color="secondaryDarkBlue">
            {computationModule.computationModuleShortDescription}
          </Typography>
        </div>
        <div className="mb-3">
          <Typography as="h3" variant="text110" mb={1} color="secondaryDarkBlue900">
            Description
          </Typography>
          <Typography variant="p130" color="secondaryDarkBlue">
            {computationModule.computationModuleDescription}
          </Typography>
        </div>
      </Card>
    </>
  );
};
