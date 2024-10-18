import { useCallback, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/router';
import constate from 'constate';

import { compareFieldKeys } from 'libs/compare-field-keys';

import { validateComputationFormReq } from './api';
import { getSerializedValues } from './utils';

type StepValuesState = {
  [x: string]: {
    type: 'tab' | 'cycle';
    values: {
      items: {
        [x: string]: {
          label: string;
          value: string;
        };
      }[];
    };
  };
};

const useComputationFormBase = ({
  payload,
  computationFormMeta,
  isPortfolio,
}: {
  payload?: ComputationFormDTO['payload'];
  computationFormMeta?: ComputationFormDTO['meta'];
  isPortfolio?: boolean;
}) => {
  const { query, push, replace } = useRouter();
  const [showFileError, showFileErrorSet] = useState(false);
  const currentStep = useMemo(() => parseInt(query.step as string) || 0, [query.step]);
  const url = useMemo(
    () =>
      isPortfolio
        ? `/store/portfolios/${query.portfolioId}/computation-form`
        : `/store/modules/${query.moduleId}/computation-form/${query.formId}`,
    [isPortfolio, query.formId, query.moduleId, query.portfolioId],
  );
  const [cycleSteps, cycleStepsSet] = useState<null | number>(null);
  const [stepValues, stepValuesSet] = useState<StepValuesState[]>([]);

  const activeStepSchema = useMemo(() => payload?.steps[currentStep], [
    currentStep,
    payload?.steps,
  ]);
  const activeTabsSchema = activeStepSchema?.properties;
  const tabKeys = useMemo(
    () => activeStepSchema && Object.keys(activeStepSchema.properties).sort(compareFieldKeys),
    [activeStepSchema],
  );
  const activeTabKey = useMemo(() => (query.tab as string) || tabKeys?.[0], [query.tab, tabKeys]);
  const activeTabKeySet = useCallback(
    (tab: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { formId, moduleId, ...restQuery } = query;
      replace({ pathname: url, query: { ...restQuery, tab } });
    },
    [replace, query, url],
  );
  const steps = useMemo(() => payload?.steps, [payload?.steps]);
  const { mutate: validateForm } = useMutation(validateComputationFormReq);

  const [computationRequestFile, setComputationRequestFile] = useState<FileUploadResultDTO>();

  const validateStep = useCallback(
    async (values: any) => {
      const tabValues = { [activeTabKey as string]: values };
      await validateForm({
        stepId: currentStep,
        computationFormId: payload?.computationFormId,
        data: tabValues,
      });
    },
    [activeTabKey, currentStep, payload?.computationFormId, validateForm],
  );

  const handleNextStep = useCallback(
    async (values?: any) => {
      try {
        // FIXME: validation not work now
        // await validateStep(values);
        const { files, ...newValues } = values;

        const serializedValues = getSerializedValues(
          newValues,
          Boolean(activeTabKey) && activeTabsSchema?.[activeTabKey as string],
          activeTabKey,
        );

        cycleStepsSet(null);
        const step = currentStep + 1;
        const moduleQuery = query.module
          ? { module: query.module, iteration: query.iteration || 0 }
          : {};

        replace({ pathname: url, query: { step, ...moduleQuery } });

        serializedValues && stepValuesSet(prevState => [...prevState, serializedValues]);
      } catch (e) {}
    },
    [activeTabKey, activeTabsSchema, currentStep, replace, query.iteration, query.module, url],
  );

  const handleBackStep = useCallback(
    (reset: (arg0: {}) => void) => {
      const step = currentStep - 1;

      stepValuesSet(prevStepValues => {
        const stepValues = prevStepValues[step];
        const tab = Object.keys(stepValues)[0];
        replace({ pathname: url, query: { step, tab } });

        if (stepValues[tab].type === 'cycle') {
          cycleStepsSet(stepValues[tab].values.items.length);
        }

        const fields =
          stepValues[tab].type === 'cycle'
            ? {
                [tab]: stepValues[tab].values.items.map(item =>
                  Object.keys(item).reduce(
                    (acc, fieldKey) => ({ ...acc, [fieldKey]: item[fieldKey].value }),
                    {},
                  ),
                ),
              }
            : Object.keys(stepValues[tab]).reduce((acc, fieldName) => {
                return { ...acc, [fieldName]: (stepValues as any)[tab][fieldName].value };
              }, {});

        reset(fields);
        prevStepValues.pop();
        return prevStepValues;
      });
    },
    [currentStep, replace, url],
  );

  const goEditStep = useCallback(
    (reset: (arg0: {}) => void, step: number, tab: string) => {
      stepValuesSet(prevStepValues => {
        const stepValues = prevStepValues[step];
        replace({ pathname: url, query: { step, tab, edit: true } });

        if (stepValues[tab].type === 'cycle') {
          cycleStepsSet(stepValues[tab].values.items.length);
        }

        const fields =
          stepValues[tab].type === 'cycle'
            ? {
                [tab]: stepValues[tab].values.items.map(item =>
                  Object.keys(item).reduce(
                    (acc, fieldKey) => ({ ...acc, [fieldKey]: item[fieldKey].value }),
                    {},
                  ),
                ),
              }
            : Object.keys(stepValues[tab]).reduce((acc, fieldName) => {
                return { ...acc, [fieldName]: (stepValues as any)[tab][fieldName].value };
              }, {});

        reset(fields);
        return prevStepValues;
      });
    },
    [replace, url],
  );

  const editStep = useCallback(
    async (values: any) => {
      const { files, ...newValues } = values;
      const serializedValues = getSerializedValues(
        newValues,
        Boolean(activeTabKey) && activeTabsSchema?.[activeTabKey as string],
        activeTabKey,
      );

      serializedValues &&
        stepValuesSet(prevState => {
          prevState.splice(currentStep, 1, serializedValues);
          return prevState;
        });
      replace({ pathname: url, query: { step: steps?.length } });
    },
    [activeTabKey, activeTabsSchema, currentStep, replace, steps?.length, url],
  );

  return {
    goEditStep,
    editStep,
    activeStep: currentStep,
    activeStepSchema,
    activeTabKey,
    activeTabKeySet,
    activeTabSchema: Boolean(activeTabKey) && activeTabsSchema?.[activeTabKey as string],
    activeTabsSchema,
    computationForm: payload,
    computationFormMeta,
    handleBackStep,
    handleNextStep,
    setComputationRequestFile,
    computationRequestFile,
    steps,
    stepValues,
    stepValuesSet,
    tabKeys,
    cycleSteps,
    url,
    showFileError,
    showFileErrorSet,
  };
};

export const [ComputationProvider, useComputationForm] = constate(useComputationFormBase);
