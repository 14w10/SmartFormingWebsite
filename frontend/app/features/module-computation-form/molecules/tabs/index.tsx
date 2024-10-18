import cn from 'clsx';

import { Typography } from '@smar/ui';

import { useComputationForm } from '../../hook';

import st from './styles.module.scss';

export const Tabs = () => {
  const { tabKeys, activeTabsSchema, activeTabKey, activeTabKeySet } = useComputationForm();

  return (
    <div className={st.tabs}>
      {activeTabsSchema &&
        tabKeys?.map((key, i) => {
          const item = activeTabsSchema[key];

          return (
            <div
              key={i}
              className={cn(
                st.tab,
                'flex relative flex-col',
                tabKeys.length > 1 ? activeTabKey === key && st.tabActive : st.tabActiveSolo,
              )}
              onClick={() => activeTabKeySet(key)}
            >
              <Typography variant="h170">{item.title}</Typography>
              <Typography className={st.tabDescription}>{item.description}</Typography>
            </div>
          );
        })}
    </div>
  );
};
