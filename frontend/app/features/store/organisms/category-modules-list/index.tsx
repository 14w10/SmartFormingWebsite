import { useQuery } from 'react-query';
import Link from 'next/link';

import { Button, Icon } from '@smar/ui';

import { getComputationModulesQueryKey } from 'features/store/api';
import { ModuleCard } from 'features/store/molecules/module/module-card';

export const CategoriesModulesList = ({
  buttonText,
  category,
}: {
  category: Category;
  buttonText: string;
}) => {
  const { data, isLoading } = useQuery<ComputationModulesDTO>(
    getComputationModulesQueryKey({ per: 8, categoryId: category.id, onMainPage: true }),
  );
  if (isLoading || (data?.payload && data.payload.length < 4)) return null;
  return (
    <div className="mt-7">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 items-center">
          {category?.icon?.url && <img src={category?.icon?.url} alt="" className="w-5 h-5" />}{' '}
          <h2 className="v-h300">{category.name}</h2>
        </div>
        <Link
          href={{ pathname: '/store/modules/all', query: { categoryId: category.id } }}
          passHref
        >
          <a className="text-primaryBlue900 v-label141">
            {buttonText} <Icon name="arrow-forward" size={16} />
          </a>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.payload?.map(item => (
          <ModuleCard item={item} key={item.id} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <Link
          href={{ pathname: '/store/modules/all', query: { categoryId: category.id } }}
          passHref
        >
          <Button as="a" size="md">
            View all modules
          </Button>
        </Link>
      </div>
    </div>
  );
};
