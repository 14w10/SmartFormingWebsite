import { useMemo } from 'react';

import { Button } from '@smar/ui';

import { usePickModule } from '../../hooks/use-pick-module';

export const SearchItem = ({ data }: { data: Module }) => {
  const { pickedModules, pickModule } = usePickModule();

  const isSelected = useMemo(
    () => pickedModules[data.moduleType].find(item => item.id === data.id),
    [data.id, data.moduleType, pickedModules],
  );

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex">
        <p className="v-h160 text-primaryBlue900 flex-shrink-0 mr-2 w-9">{data?.moduleType}</p>
        <p className="v-h150">
          {data.title}{' '}
          <span className="v-text130 text-secondaryDarkBlue920 ml-2">
            by {data.author.firstName} {data.author.lastName}
          </span>
        </p>
      </div>
      <Button
        variant="outlined"
        size="xs"
        className="flex-shrink-0 ml-2"
        onClick={() => pickModule(data)}
        disabled={!!isSelected}
      >
        {isSelected ? 'selected' : 'select module'}
      </Button>
    </div>
  );
};
