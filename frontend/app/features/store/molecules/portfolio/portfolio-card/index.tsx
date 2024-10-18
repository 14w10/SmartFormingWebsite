import { FC } from 'react';
import Link from 'next/link';

import { Card, Icon } from '@smar/ui';

export const PortfolioCard = ({ data }: { data: Portfolio }) => {
  return (
    <Link href={`/store/portfolios/${data.id}`} passHref>
      <Card as="a" boxshadow="shadow1" className="grid gap-3 grid-cols-6 p-3">
        <img
          className="h-30 col-span-2 w-full max-h-full rounded-lg object-cover"
          src={data?.cover?.croppedUrl || '/default-module.png'}
          alt=""
          loading="lazy"
        />
        <div className="flex flex-col col-span-4 justify-between">
          <div className="text-primaryBlue900 flex">
            <Icon name="24px-layers" size={24} />
            <p className="v-text130">{data?.portfolioComputationModules?.length} Modules</p>
          </div>
          <h2 className="v-h170 text-secondaryDarkBlue900 mt-1">{data.title}</h2>
          <p className="v-p130 text-secondaryDarkBlue910 mt-1">{data.description}</p>
          <div className="v-p130 text-secondaryDarkBlue900 flex items-center">
            <div className="flex items-center mr-2">
              <Icon className="mr-1" name="eye" size={24} iconFill="secondaryDarkBlue921" />
              2.2K
            </div>
            <div className="flex items-center">
              <Icon className="mr-1" name="star-border" size={24} iconFill="secondaryDarkBlue921" />
              4.8
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
