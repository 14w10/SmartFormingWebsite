import { Fragment, useMemo } from 'react';
import { useRouter } from 'next/router';
import styled from 'astroturf/react';

import { Icon } from '@smar/ui';

import { useComputationPortfolioForm } from 'features/portfolio-computations/hooks/use-computation-portfolio';

const Item = styled.div<{ active?: boolean; prev: boolean }>`
  @apply border-2 w-8 h-8 rounded-full flex justify-center items-center v-h300 border-primaryBlue910;

  color: theme('colors.primaryBlue910');

  &.active {
    @apply bg-primaryBlue900 border-primaryBlue900 text-white;
  }

  &.prev {
    @apply border-primaryBlue900 text-primaryBlue900;
  }
`;

export const ModuleProgress = ({
  modules,
}: {
  modules: Portfolio['portfolioComputationModules'];
}) => {
  const { countPreModules } = useComputationPortfolioForm();
  const { query } = useRouter();
  const activeModule = query.module || 0;

  const formattedModules = useMemo(() => {
    const formatted = modules.map((item, i) => ({ ...item, originalIndex: i }));
    const preModules = formatted.filter(item => item.computationModule.moduleType === 'pre-fe');
    const postModules = formatted.filter(item => item.computationModule.moduleType === 'post-fe');
    return [...preModules, null, ...postModules];
  }, [modules]);

  return (
    <div className="flex my-4">
      {formattedModules?.map((item, i) => {
        return (
          <Fragment key={i}>
            {item === null ? (
              <div className="w-8 text-center" style={{ whiteSpace: 'pre' }}>
                <p className="v-label110 -ml-1">your model</p>
                <p className="v-label110 text-secondaryDarkBlue920">upload</p>
                <Item
                  className="mt-1"
                  active={(query.iteration || 0) == i}
                  prev={(Number(query.iteration) || 0) > i}
                >
                  <Icon name="24px-file" size={24} />
                </Item>
              </div>
            ) : (
              <div className="text-center">
                <p className="v-label110">Module {item.originalIndex + 1}</p>
                <p className="v-label110 text-secondaryDarkBlue920">
                  {item.computationModule.moduleType}
                </p>
                <Item
                  className="mt-1"
                  active={(query.iteration || 0) == i}
                  prev={(Number(query.iteration) || 0) > i}
                >
                  {item.originalIndex + 1}
                </Item>
              </div>
            )}
            {formattedModules.length !== i + 1 && (
              <div
                className={`${
                  (Number(query.iteration) || 0) > i ? 'bg-primaryBlue900' : 'bg-primaryBlue910'
                } self-end w-8`}
                style={{ height: 2, marginBottom: 30 }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
};
