import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Tab, Tabs } from '@material-ui/core';
import qs from 'qs';

interface IStatusTabs {
  tabs: {
    query: string;
    title: string;
    show?: boolean;
  }[];
}

export const StatusTabs = ({ tabs }: IStatusTabs) => {
  const { query, push, pathname } = useRouter();

  const activeTab = useMemo(() => tabs.findIndex(tab => tab.query === (query.status as string)), [
    query.status,
    tabs,
  ]);

  return (
    <Tabs
      value={activeTab === -1 ? 0 : activeTab}
      onChange={(e, index) => {
        const url = `${pathname}?${qs.stringify({
          status: tabs[index].query,
          per: 25,
          search: query.search,
        })}`;
        push(url, url, {
          shallow: true,
        });
      }}
      indicatorColor="primary"
      textColor="primary"
      aria-label="full width tabs example"
    >
      {tabs.map(({ show = true, ...item }, index) => {
        if (show) return <Tab key={index} label={item.title} style={{ minWidth: 100 }} />;
      })}
    </Tabs>
  );
};
