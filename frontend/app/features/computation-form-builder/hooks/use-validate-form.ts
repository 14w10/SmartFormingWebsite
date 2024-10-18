import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import { getModuleQueryKey } from 'features/modules/api';
import { useCurrentUser } from 'features/user';

import { getFormBuilderQueryKey } from '../api';

type FormErrorsState =
  | {
      type: string;
      message: string;
    }[][]
  | false
  | undefined;

export const useValidateForm = () => {
  const [formErrors, formErrorsSet] = useState<FormErrorsState>(false);
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: computationModule } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId: query.moduleId as ID, isUser: false }),
    { refetchOnWindowFocus: false, enabled: currentUser?.role === 'admin' },
  );
  const { data } = useQuery<ComputationFormBuilderDTO>(
    getFormBuilderQueryKey({ builderId: computationModule?.payload.computationFormId as ID }),
    { retry: 0, enabled: currentUser?.role === 'admin' },
  );

  const validateFormBuilder = useCallback(
    (schema?: Schema[]) => {
      const currentSchema = schema || data?.payload.steps;
      const errors = currentSchema?.map((item: any) => {
        const errorsForm = [];
        const tabsKeys = Object.keys(item?.properties);
        const tabField = tabsKeys.find(
          tabKey => Object.keys(item?.properties[tabKey as string]?.items?.properties).length === 0,
        );
        const cycleField = tabsKeys.find(tabKey => {
          const cycle = item.properties[tabKey as string]?.items?.properties.cycle;
          return cycle && Object.keys(cycle.items?.properties).length === 0;
        });
        if (item.title === '' || item.stepTitle === '') {
          errorsForm.push({
            type: 'metaFields',
            message: 'Step tab title and Step title are required',
          });
        }
        if (tabsKeys.length === 0) {
          errorsForm.push({ type: 'tab', message: 'At least 1 tab required' });
        }
        if (tabsKeys.length !== 0 && tabField) {
          errorsForm.push({ type: 'tabFields', message: 'At least 1 field required' });
        }
        if (cycleField) {
          errorsForm.push({ type: 'cycle', message: 'At least 1 field required' });
        }
        return errorsForm;
      });

      const formattedErrors = errors?.some(item => item.length) && errors;
      formErrorsSet(formattedErrors);

      return formattedErrors;
    },
    [data?.payload.steps],
  );

  return { validateFormBuilder, formErrors };
};
