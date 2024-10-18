import { useCallback, useMemo, useState } from 'react';
import createUseContext from 'constate';
import { nanoid } from 'nanoid';
import useMethods from 'use-methods';

import { getInitialSchema } from '../schema';
import { ActionsState } from '../types';

const initialSchema = getInitialSchema(nanoid());

const methods = (state: ActionsState) => {
  const currentStepSchema = state.schema[state.currentStep];
  const currentTabFields =
    state.schema[state.currentStep]?.properties?.[state.currentTab as string]?.items;

  return {
    addStep: () => {
      state.currentStep = state.schema.length;
      state.schema.push(getInitialSchema(nanoid()));
    },
    removeStep: (step: number) => {
      state.schema.splice(step, 1);
      state.currentStep = state.currentStep !== 0 ? state.currentStep - 1 : 0;
      state.currentTab = Object.keys(state.schema[state.currentStep].properties)?.[0];
    },
    editField: (fieldKey: string, values: any) => {
      const fields = currentTabFields.properties?.cycle
        ? currentTabFields.properties?.cycle?.items?.properties
        : currentTabFields.properties;

      fields[fieldKey] = values;
    },
    openEditField: (fieldName: string, type: 'field' | 'cycle' = 'field') => {
      const currentField =
        type === 'cycle'
          ? currentTabFields.properties?.cycle
          : currentTabFields.properties?.cycle?.items?.properties[fieldName] ||
            currentTabFields.properties[fieldName];

      state.isOpen = type;
      const { description, ...values } = currentField;
      state.initialFieldValues = { ...values, label: description, fieldName };
    },
    addField: (fieldKey: number, fieldValue: any) => {
      const cycle = currentTabFields.properties?.cycle;

      if (cycle) {
        cycle.items.properties = {
          ...cycle.items.properties,
          [`a${fieldKey}`]: fieldValue,
        };
      } else {
        currentTabFields.properties = {
          ...currentTabFields.properties,
          [`a${fieldKey}`]: fieldValue,
        };
      }

      state.isOpen = null;
      state.initialFieldValues = {};
    },
    removeField: (fieldName: string, type = 'field') => {
      if (type === 'field') {
        state.currentTab && currentTabFields.properties?.cycle
          ? delete currentTabFields.properties?.cycle?.items?.properties[fieldName]
          : delete currentTabFields.properties[fieldName];
      } else {
        delete currentTabFields.properties.cycle;
      }
    },
    setStep: (step: number) => {
      state.currentStep = step;
      state.currentTab = Object.keys(state.schema[step].properties)?.[0];
    },
    setTab: (key: string) => {
      state.currentTab = key;
    },
    setMetaField: (fieldName: 'title' | 'description' | 'stepTitle', value: string) => {
      state.schema[state.currentStep][fieldName] = value;
    },
    addTab: (title: string, description?: string) => {
      const newFieldKey = `a${new Date().getTime()}`;

      currentStepSchema.properties = {
        ...currentStepSchema.properties,
        [newFieldKey]: {
          type: 'array',
          title,
          description,
          items: {
            type: 'object',
            properties: {},
          },
        },
      };
      state.currentTab = newFieldKey;
    },
    openEditTab: (tabName: string) => {
      const currentTab = currentStepSchema.properties[tabName];

      state.isOpen = 'tab';
      state.initialFieldValues = { ...currentTab, tabName };
    },
    editTab: (fieldKey: string, values: any) => {
      currentStepSchema.properties[fieldKey] = values;
    },
    addCycle: (values: any) => {
      currentTabFields.properties = { ...currentTabFields.properties, cycle: values };
    },
    removeTab: (key: string) => {
      const tabKeys = Object.keys(currentStepSchema.properties);

      if (tabKeys.length !== 1) {
        let newKey;
        tabKeys.forEach((item, index) => {
          if (item === key) {
            newKey = item === key && tabKeys[index === 0 ? 1 : 0];
          }
        });
        state.currentTab = newKey;
        delete currentStepSchema.properties[key];
      }
    },
    handleModal: (modalState: null | 'field' | 'tab' | 'cycle') => {
      state.isOpen = modalState;
    },
    handleCloseModal: () => {
      state.isOpen = null;
      state.initialFieldValues = {};
    },

    toggleFiles: () => {
      state.filesBlockEnabled = !state.filesBlockEnabled;
    },
  };
};

const initialState: ActionsState = {
  schema: [initialSchema],
  isOpen: null,
  currentStep: 0,
  initialFieldValues: {},
  files: [],
  filesBlockEnabled: false,
};

const useFormBuilderActionsImpl = ({
  initialValueProps,
}: {
  initialValueProps?: {
    currentTab: string;
    fileFields: IFileField[];
    filesBlockEnabled: boolean;
    schema: ActionsState['schema'];
  };
}) => {
  // const { validateFormBuilder } = useValidateForm();
  const [state, actions] = useMethods(methods, { ...initialState, ...initialValueProps });
  const [metaValues, metaValuesSet] = useState({ title: '', stepTitle: '', description: '' });
  const [formError, formErrorSet] = useState<null | {
    type: 'global' | 'metaFields' | 'tab' | 'cycle';
    message?: string;
  }>(null);

  const currentSchema = useMemo(() => state.schema[state.currentStep], [
    state.currentStep,
    state.schema,
  ]);

  const fieldKeys = useMemo(
    () =>
      currentSchema &&
      Object.keys(currentSchema?.properties[state.currentTab as string]?.items?.properties || {}),
    [currentSchema, state.currentTab],
  );

  const cycleSchema = useMemo(
    () =>
      currentSchema &&
      currentSchema.properties[state.currentTab as string]?.items?.properties.cycle,
    [currentSchema, state.currentTab],
  );

  const checkErrors = useCallback((callback: () => void) => {
    callback();
  }, []);

  return {
    state,
    actions,
    formError,
    formErrorSet,
    checkErrors,
    fieldKeys,
    currentSchema,
    cycleSchema,
    metaValues,
    metaValuesSet,
  };
};

export const [FormBuilderActionsProvider, useFormBuilderActions] = createUseContext(
  useFormBuilderActionsImpl,
);
