import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'clsx';

import { RangeSlider, Typography } from '@smar/ui';

import { compareFieldKeys } from 'libs/compare-field-keys';
import { useComputationForm } from 'features/module-computation-form/hook';

import { Accordion } from '../../atoms/accordion';
import { FormField } from '../form-field';

import st from './styles.module.scss';

// TODO: fix
type CycleProps = {
  name: string;
  label: string;
  className?: string;
  maxSteps?: number;
  cycle: ISchemaItem;
  control: any;
};

export const Cycle: FC<CycleProps> = ({ name, label, className, maxSteps = 5, cycle, control }) => {
  const { activeTabKey, cycleSteps } = useComputationForm();
  const [stepsValue, setStepsValue] = useState(cycleSteps || maxSteps);
  const steps = useMemo(() => [...Array(stepsValue).keys()], [stepsValue]);
  const ref = useRef<HTMLDivElement>(null);
  const properties = useMemo(() => cycle.items?.properties, [cycle.items?.properties]);
  const [step, setStep] = useState(0);
  const fieldsKeys = useMemo(() => properties && Object.keys(properties).sort(compareFieldKeys), [
    properties,
  ]);

  useEffect(() => {
    setStepsValue(cycleSteps || maxSteps);
  }, [cycleSteps, maxSteps]);

  useEffect(() => {
    setStepsValue(cycleSteps || maxSteps);
  }, [cycleSteps, maxSteps]);

  const scrollTo = useCallback((i: string | number) => {
    const element = ref.current?.children[i as any];
    const headerHeight = document.getElementById('header')?.clientHeight || 0;

    if (element instanceof HTMLElement)
      window.scroll({
        top: element.offsetTop - headerHeight,
        left: 0,
        behavior: 'smooth',
      });
  }, []);

  return (
    <>
      <div className={cn('w-full mb-4', className)} style={{ maxWidth: 450 }}>
        <RangeSlider
          name={name}
          label={label}
          min={1}
          defaultValue={stepsValue}
          max={maxSteps}
          onChange={(value: number) => setStepsValue(value)}
          markersShow
        />

        <div className={cn(st.steps, stepsValue !== 1 && st.stepsMultiple)}>
          {steps.map(item => (
            <div
              key={item}
              className={cn(st.step, step === item && st.stepActive)}
              onClick={() => {
                setStep(item);
                scrollTo(item);
              }}
            >
              <Typography
                variant="button160"
                color={step !== item ? 'secondaryDarkBlue900' : 'white'}
              >
                {item + 1}
              </Typography>
            </div>
          ))}
        </div>
      </div>
      <div ref={ref}>
        {steps.map(index => (
          <Accordion key={index} className="mb-4" title={`Cycle ${index + 1}`}>
            <div className="flex flex-wrap justify-between">
              {properties &&
                fieldsKeys?.map(key => {
                  return (
                    <FormField
                      key={key}
                      control={control}
                      name={`${activeTabKey}[${index}].${key}`}
                      field={properties[key]}
                    />
                  );
                })}
            </div>
          </Accordion>
        ))}
      </div>
    </>
  );
};
