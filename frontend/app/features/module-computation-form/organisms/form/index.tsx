import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';

import { Button } from '@smar/ui';

import { compareFieldKeys } from 'libs/compare-field-keys';

import { useComputationForm } from '../../hook';
import { Cycle } from '../../molecules/cycle';
import { FormField } from '../../molecules/form-field';

export const Form = () => {
  const { query, push } = useRouter();
  const { control, handleSubmit, reset } = useFormContext();
  const {
    activeTabSchema,
    activeStep,
    handleBackStep,
    editStep,
    handleNextStep,
    url,
    steps,
  } = useComputationForm();
  const cycle = useMemo(() => activeTabSchema && activeTabSchema.items?.properties.cycle, [
    activeTabSchema,
  ]);
  const fields = useMemo(() => (activeTabSchema && activeTabSchema?.items?.properties) || {}, [
    activeTabSchema,
  ]);
  const fieldsKeys = useMemo(() => Object.keys(fields).sort(compareFieldKeys), [fields]);

  return (
    <form>
      {cycle ? (
        <div>
          <Cycle
            name="Paint bake cycles"
            label="Paint bake cycles"
            maxSteps={cycle.maxItems}
            cycle={cycle}
            control={control}
          />
        </div>
      ) : (
        <div className="flex flex-wrap justify-between">
          {fieldsKeys.map(key => (
            <FormField key={key} control={control} name={key} field={fields[key]} />
          ))}
        </div>
      )}

      <div>
        {query.edit ? (
          <>
            <Button
              size="md"
              variant="outlined"
              className="mr-2"
              onClick={() => push({ pathname: url, query: { step: steps?.length } })}
            >
              Continue without saving
            </Button>
            <Button size="md" onClick={handleSubmit(editStep)}>
              Save and continue
            </Button>
          </>
        ) : (
          <>
            <Button
              size="md"
              variant="outlined"
              className="mr-2"
              disabled={activeStep === 0}
              onClick={() => handleBackStep(reset)}
            >
              back
            </Button>
            <Button size="md" type="button" onClick={handleSubmit(handleNextStep)}>
              next
            </Button>
          </>
        )}
      </div>
    </form>
  );
};
