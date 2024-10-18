import { useQuery } from 'react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Button, Card, Icon, Typography } from '@smar/ui';

import { getPortfolioModuleQueryKey } from 'features/store/api';

import st from '../../pages/styles.module.scss';

export const PortfolioSidebarList = () => {
  const { query } = useRouter();
  const { data } = useQuery<APIListResponse<Module>>(
    getPortfolioModuleQueryKey({ moduleId: query.moduleId as string }),
  );

  if (!data?.payload || data?.payload.length === 0) return null;
  return (
    <Card variant="sm" className={st.computationCard}>
      <Typography variant="h170" color="secondaryDarkBlue910" mb={3} textAlign="center">
        This module is part of those portfolios
      </Typography>
      <div className="flex flex-col gap-3">
        {data?.payload?.map(item => (
          <div key={item.id} className="flex gap-2">
            <Link href={`/store/portfolios/${item.id}`} passHref>
              <a className="flex-shrink-0 w-7">
                <img src={item?.cover?.croppedUrl} alt="" className="rounded-lg" />
              </a>
            </Link>
            <div>
              <Link href={`/store/portfolios/${item.id}`} passHref>
                <a className="v-h150 !text-lg">{item.title}</a>
              </Link>
              <p className="v-p130 text-secondaryDarkBlue910 mt-4px">{item.description}</p>
              <div className="flex gap-2 mt-1">
                <div className="flex gap-1 items-center">
                  <Icon name="eye" size={24} iconFill="secondaryDarkBlue921" />
                  <Typography variant="text130" color="secondaryDarkBlue900">
                    2.7K
                  </Typography>
                </div>
                <div className="flex gap-1 items-center">
                  <Icon name="star-border" size={24} iconFill="secondaryDarkBlue920" />
                  <Typography variant="text130" color="secondaryDarkBlue900">
                    4.9
                  </Typography>
                </div>
                <div className="flex gap-1 items-center">
                  <Icon name="24px-layers" iconFill="secondaryDarkBlue921" size={24} />
                  <Typography variant="text130" color="secondaryDarkBlue900">
                    4
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
