import { FC } from 'react';

import { ModuleCard } from '../../molecules/module/module-card';

import st from './styles.module.scss';

export const ModulesList: FC<{ items: Module[] }> = ({ items }) => {
  return (
    <div className={st.root}>
      {items.map(item => (
        <ModuleCard item={item} key={item.id} />
      ))}
    </div>
  );
};
