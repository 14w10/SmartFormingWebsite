import cn from 'clsx';

import { Typography } from '@smar/ui';

import { useComputationForm } from '../../hook';

import st from './styles.module.scss';
export const ProgressSteps = () => {
  const { steps, activeStep } = useComputationForm();

  return (
    <ul className={st.root}>
      {steps?.map((item, i) => (
        <li
          key={item.$id}
          className={cn(st.step, activeStep === i ? st.stepActive : '')}
          // onClick={() => currentStepSet(i)}
        >
          <>
            <Typography variant="label120" color="secondaryDarkBlue900">
              {item.stepTitle}
            </Typography>
            <Typography variant="text110" color="secondaryDarkBlue910">
              Step {i + 1}
            </Typography>
          </>
        </li>
      ))}
      <li className={cn(st.step, steps?.length === activeStep ? st.stepActive : '')}>
        <Typography variant="h160" color="secondaryDarkBlue920">
          Summary
        </Typography>
      </li>
    </ul>
  );
};
