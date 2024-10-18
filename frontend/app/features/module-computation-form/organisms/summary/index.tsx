import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button, RangeSlider, Select, Spinner, Typography } from '@smar/ui';

import { Accordion } from '../../atoms/accordion';
import { useComputationForm } from '../../hook';

const nope = () => null;

const Field: FC<any> = ({ field }) => {
  if (field.enum) {
    return (
      <div key={field.title} className="-mx-2 px-2 w-full">
        <div className="mb-4 w-1/3">
          <Select
            caption={field.description}
            variant="light"
            defaultSelectedItem={{ value: field.value, label: field.value }}
            onChange={nope}
            items={field.enum?.map((value: string) => ({ value, label: value })) ?? []}
            disabled
          />
        </div>
      </div>
    );
  }
  return (
    <div key={field.title} className="-mx-2 px-2 w-1/2">
      <RangeSlider
        className="mb-4"
        label={field.description as string}
        name={field.description as string}
        defaultValue={field.value ?? field.default}
        initialValue={field.value ?? field.default}
        min={field.minLength}
        max={field.maxLength}
        withInput
        disabled
      />
    </div>
  );
};

export const Summary = ({
  sendFinallyForm,
  sendComputationFormState,
}: {
  sendComputationFormState: any;
  sendFinallyForm: () => void;
}) => {
  const { reset } = useFormContext();
  const { handleBackStep, stepValues, steps, goEditStep } = useComputationForm();

  return (
    <div className="rounded-large mt-2 p-3 bg-white">
      <div className="border-secondaryDarkBlue930 flex justify-between mb-3 border-b">
        <div>
          <Typography as="h2" variant="h150" mb={1}>
            Summary information
          </Typography>
          <Typography mb={2} variant="p130" style={{ maxWidth: 882 }}>
            Make sure that all the parameters were set correctly, and then request the computation.
          </Typography>
        </div>
        <Button
          size="md"
          type="submit"
          onClick={sendFinallyForm}
          disabled={sendComputationFormState.isLoading}
        >
          {sendComputationFormState.isLoading ? (
            <>
              <Spinner size="sm" color="white" className="mr-1" />
              <span>Computation is in progress</span>
            </>
          ) : (
            'request computation'
          )}
        </Button>
      </div>

      {stepValues.map((values, index) => {
        const step = steps?.[index] as ISchema;
        const activeTabKey = Object.keys(values)[0];
        const tabSchema = step.properties[activeTabKey];
        const value = values[activeTabKey];

        return (
          <div key={index} className="border-secondaryDarkBlue930 mb-3 pb-2 border-b">
            <Accordion
              title={step.title}
              subtitle={tabSchema?.title}
              subtitleDescription={tabSchema?.description}
            >
              {value.type === 'cycle' ? (
                <div>
                  {value.values.items.map((field, i) => (
                    <Accordion key={i} title={`Cycle ${i + 1}`}>
                      <div className="flex flex-wrap justify-between w-full">
                        {Object.entries(field).map(([k, v]) => (
                          <Field key={k} field={v} />
                        ))}
                      </div>
                    </Accordion>
                  ))}
                </div>
              ) : (
                Object.entries(value).map(([key, field]) => (
                  <div key={key} className="flex flex-wrap justify-between">
                    <Field field={field} />
                  </div>
                ))
              )}
              {/* <Link href={`${url}?step=${index}&tab=${activeTabKey}&edit=true`}> */}
              <Button onClick={() => goEditStep(reset, index, activeTabKey)}>Edit</Button>
              {/* </Link> */}
            </Accordion>
          </div>
        );
      })}

      <div className="flex mt-4">
        <Button size="md" variant="outlined" className="mr-2" onClick={() => handleBackStep(reset)}>
          back
        </Button>
        <Button
          size="md"
          type="submit"
          onClick={sendFinallyForm}
          disabled={sendComputationFormState.isLoading}
        >
          {sendComputationFormState.isLoading ? (
            <>
              <Spinner size="sm" color="white" className="mr-1" />
              <span>Computation is in progress</span>
            </>
          ) : (
            'request computation'
          )}
        </Button>
      </div>
    </div>
  );
};
