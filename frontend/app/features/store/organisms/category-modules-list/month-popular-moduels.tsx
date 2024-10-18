import Link from 'next/link';

import { Button, Icon, IconsType } from '@smar/ui';

import { ModuleCard } from 'features/store/molecules/module/module-card';

export const MonthModulesList = ({
  title,
  icon,
  items,
  showButton,
  buttonText,
}: {
  title: string;
  icon?: IconsType;
  items?: Module[];
  buttonText: string;
  showButton?: boolean;
}) => {
  return (
    <div className="mt-7">
      <div className="flex items-center justify-between">
        <h2 className="v-h300 flex gap-1 items-center">
          {icon && <Icon name={icon} />} {title}
        </h2>
        <Link href="/store/modules/all" passHref>
          <a className="text-primaryBlue900 v-label141">
            {buttonText} <Icon name="arrow-forward" size={16} />
          </a>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items?.map(item => (
          <ModuleCard item={item} key={item.id} />
        ))}
      </div>
      {showButton && (
        <div className="flex justify-center mt-4">
          <Link href="/store/modules/all" passHref>
            <Button as="a" size="md">
              View all modules
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
