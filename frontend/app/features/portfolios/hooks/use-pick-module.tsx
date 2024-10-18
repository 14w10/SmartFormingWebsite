import { useCallback, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import constate from 'constate';

const usePickModuleBase = () => {
  const [pickedModules, pickedModulesSet] = useState<Record<'pre-fe' | 'post-fe', Module[]>>({
    'pre-fe': [],
    'post-fe': [],
  });

  const pickModule = useCallback((module: Module) => {
    pickedModulesSet(prevState => ({
      ...prevState,
      [module.moduleType]: [...prevState[module.moduleType], module],
    }));
  }, []);

  const removeModule = useCallback((id: ID, type: Module['moduleType']) => {
    pickedModulesSet(prevState => ({
      ...prevState,
      [type]: prevState[type].filter(item => item.id !== id),
    }));
  }, []);

  const onSortEnd = useCallback(
    (props: DragEndEvent, type: Module['moduleType']) => {
      const oldIndex = pickedModules[type]
        .map((item, i) => item.id.toString() === props.active.id && i)
        ?.find(item => typeof item === 'number');
      const newIndex = pickedModules[type]
        .map((item, i) => item.id.toString() === props.over?.id && i)
        ?.find(item => typeof item === 'number');

      if ((oldIndex || oldIndex === 0) && (newIndex || newIndex === 0)) {
        pickedModulesSet(prevState => ({
          ...prevState,
          [type]: arrayMove(prevState[type], oldIndex, newIndex),
        }));
      }
    },

    [pickedModules],
  );

  return { pickedModules, removeModule, pickModule, onSortEnd };
};

export const [PickModuleProvider, usePickModule] = constate(usePickModuleBase);
