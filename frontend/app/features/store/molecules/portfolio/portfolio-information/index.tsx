import { FC } from 'react';

import { Card, Icon } from '@smar/ui';

import { formatDate } from 'libs/format-date';

type ModuleInformationProps = {
  portfolioModule: Portfolio | PortfolioRequest;
};

export const PortfolioInformation: FC<ModuleInformationProps> = ({ portfolioModule }) => {
  return (
    <>
      <h2 className="v-text110 text-secondaryDarkBlue900 mb-1">Information</h2>
      <Card variant="sm" className="mb-3">
        <div className="flex">
          <div
            className="mr-3 rounded-2xl overflow-hidden"
            style={{ height: '88px', width: '66px' }}
          >
            <img
              className="w-full h-full object-cover"
              src={(portfolioModule as any)?.cover?.croppedUrl || '/default-module.png'}
              alt=""
            />
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <p className="v-h170 text-secondaryDarkBlue900">{portfolioModule?.title}</p>
            <p className="v-p130 text-secondaryDarkBlue900">
              <span className="v-p130 text-secondaryDarkBlue920">Created at</span>{' '}
              {formatDate(portfolioModule?.createdAt)}
            </p>
            <div className="text-secondaryDarkBlue920 flex mt-1">
              <Icon name="24px-layers" size={24} />
              <p className="v-text130">
                {(portfolioModule as any)?.portfolioComputationModules?.length ||
                  (portfolioModule as PortfolioRequest)?.portfolioComputationRequests?.length ||
                  0}{' '}
                Modules
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
