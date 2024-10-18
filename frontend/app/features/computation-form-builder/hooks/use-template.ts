import { useCallback, useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useInterval } from 'react-use';
import { useRouter } from 'next/router';

import { getModuleQueryKey } from 'features/modules';

import { getFormBuilderQueryKey, saveFormReq } from '../api';
import { useFormBuilderActions } from './use-form-builder';
import { useValidateForm } from './use-validate-form';

export const useTemplate = () => {
  const { query, push } = useRouter();
  const queryCache = useQueryClient();
  const { validateFormBuilder, formErrors } = useValidateForm();
  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId: query.moduleId as ID }),
    { refetchOnWindowFocus: false },
  );
  const {
    state,
    actions,
    formError,
    formErrorSet,
    checkErrors,
    cycleSchema,
    fieldKeys,
  } = useFormBuilderActions();

  const { mutate: saveForm, isLoading } = useMutation(saveFormReq, {
    onSuccess: async () => {
      queryCache.invalidateQueries(getFormBuilderQueryKey({ builderId: query.builderId as ID }));
      queryCache.invalidateQueries(getModuleQueryKey({ moduleId: query.moduleId as ID }));
    },
    onError: () => {
      formErrorSet({ type: 'global', message: 'Error. Form cannot be saved' });
    },
  });
  const { schema, currentStep, filesBlockEnabled } = state;
  const { handleModal, setStep } = actions;

  const formattedSchema = useMemo(
    () =>
      schema.reduce((acc: any[], item) => {
        const formattedValue = { ...item, required: Object.keys(item.properties) };
        return [...acc, formattedValue];
      }, []),
    [schema],
  );
  useInterval(() => {
    saveForm({
      computationFormId: computationModule?.payload.computationFormId,
      form: {
        computationModuleId: query.moduleId,
        steps: formattedSchema,
        filesBlockEnabled,
        files: [],
      },
    });
  }, 30000);

  const handleSaveForm = useCallback(async () => {
    checkErrors(() => {
      saveForm(
        {
          computationFormId: computationModule?.payload.computationFormId,
          form: {
            computationModuleId: query.moduleId,
            steps: formattedSchema,
            filesBlockEnabled,
            files: [],
          },
        },
        {
          onSuccess: async () => {
            await push(`/modules/${query.moduleId}`);
            queryCache.invalidateQueries(
              getFormBuilderQueryKey({ builderId: query.builderId as ID }),
            );
            queryCache.invalidateQueries(getModuleQueryKey({ moduleId: query.moduleId as ID }));
          },
        },
      );
    });
  }, [
    checkErrors,
    saveForm,
    computationModule?.payload.computationFormId,
    query.moduleId,
    query.builderId,
    formattedSchema,
    filesBlockEnabled,
    push,
    queryCache,
  ]);

  const isExistTab = useMemo(
    () =>
      schema[currentStep]?.properties && Object.keys(schema[currentStep]?.properties).length > 0,
    [currentStep, schema],
  );

  useEffect(() => {
    if (query.validate) {
      const errors = validateFormBuilder(schema);

      errors && errors.forEach((item, i) => item.length > 0 && setStep(i));
    }
  }, [query.validate, validateFormBuilder, schema, setStep]);

  return {
    isExistTab,
    handleSaveForm,
    handleModal,
    isLoading,
    formError,
    cycleSchema,
    schema,
    fieldKeys,
    currentStep,
    filesBlockEnabled,
    actions,
    formErrors,
    query,
  };
};
