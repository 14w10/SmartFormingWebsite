import { DndContext } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button, Icon } from '@smar/ui';

import { usePickModule } from '../../hooks/use-pick-module';

export const PortfolioItem = ({ data }: { data: Module }) => {
  const { removeModule } = usePickModule();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: data.id.toString(),
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className="flex items-center justify-between mb-1 py-1 h-10"
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center">
        <div className="text-secondaryDarkBlue921 flex-shrink-0 mr-2 w-1">
          <Icon name="16px-carrying" size={16} />
        </div>
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
        onClick={() => removeModule(data.id, data.moduleType)}
      >
        Remove module
      </Button>
    </div>
  );
};

export const PortfolioComposition = () => {
  const { pickedModules, onSortEnd } = usePickModule();

  return (
    <div className="mt-3">
      <p className="v-h150">Portfolio composition *</p>
      <div className="border-secondaryDarkBlue930 rounded-large mt-1 border-2">
        <div className="p-2">
          <p className="v-h160 text-primaryBlue900">pre-fe MODULES</p>
          <DndContext onDragEnd={p => onSortEnd(p, 'pre-fe')}>
            <SortableContext items={pickedModules['pre-fe'].map(item => item.id.toString())}>
              {pickedModules['pre-fe']?.length > 0 ? (
                pickedModules['pre-fe'].map(item => <PortfolioItem key={item.id} data={item} />)
              ) : (
                <p className="v-text130 text-secondaryDarkBlue920 my-1 text-center">
                  PRE-FE modules will appear here after selection
                </p>
              )}
            </SortableContext>
          </DndContext>
        </div>
        <div className="border-secondaryDarkBlue930 p-2 border-t-2">
          <p className="v-h160 text-primaryBlue900">post-fe MODULES</p>
          <DndContext onDragEnd={p => onSortEnd(p, 'post-fe')}>
            <SortableContext items={pickedModules['post-fe'].map(item => item.id.toString())}>
              {pickedModules['post-fe']?.length > 0 ? (
                pickedModules['post-fe'].map(item => <PortfolioItem key={item.id} data={item} />)
              ) : (
                <p className="v-text130 text-secondaryDarkBlue920 my-1 text-center">
                  POST-FE modules will appear here after selection
                </p>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};
