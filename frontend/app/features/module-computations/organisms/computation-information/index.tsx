import { FC } from 'react';

import { Card, Typography } from '@smar/ui';

import { formatDate } from 'libs/format-date';

type ComputationsInformationProps = {
  computationModule: Computation;
};

export const ComputationsInformation: FC<ComputationsInformationProps> = ({
  computationModule,
}) => {
  return (
    <>
      <Typography as="h2" variant="text110" mb={1} color="secondaryDarkBlue900">
        Information
      </Typography>
      <Card variant="sm" className="mb-3">
        <div className="flex">
          <div
            className="mr-3 rounded-2xl overflow-hidden"
            style={{ height: '72px', width: '72px' }}
          >
            <img className="w-full h-full object-cover" src="/default-module.png" alt="" />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <Typography variant="label140" color="secondaryDarkBlue900">
              {computationModule?.computationModuleTitle}{' '}
              <span className="bg-secondaryDarkBlue940 px-12px py-4px ml-1 rounded-full capitalize">
                {computationModule?.status}
              </span>
              <span className="bg-secondaryDarkBlue940 px-12px py-4px ml-1 rounded-full">
                Awaiting author’s response
              </span>
            </Typography>
            <Typography variant="p130" color="secondaryDarkBlue900">
              <Typography as="span" variant="p130" color="secondaryDarkBlue920">
                Requested
              </Typography>{' '}
              {formatDate(computationModule?.createdAt)}
            </Typography>
            {computationModule.author && (
              <Typography variant="p130" color="secondaryDarkBlue900">
                <Typography as="span" variant="p130" color="secondaryDarkBlue920">
                  by
                </Typography>{' '}
                {`${computationModule.author.firstName} ${computationModule.author.lastName}`}
              </Typography>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};
