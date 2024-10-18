import { Typography } from '@smar/ui';

import { useComputationForm } from '../../hook';
import { Tabs } from '../../molecules/tabs';
import { Form } from '../form';

export const StepContent = () => {
  const { activeStepSchema } = useComputationForm();

  if (!activeStepSchema) return null;

  return (
    <div className="rounded-large mt-2 p-3 bg-white">
      <Typography as="h2" variant="h150" mb={1}>
        {activeStepSchema.title}
      </Typography>
      {activeStepSchema.description && (
        <Typography mb={2} variant="p130" style={{ maxWidth: 882 }}>
          {activeStepSchema.description}
        </Typography>
      )}

      <Tabs />
      <Form />
    </div>
  );
};
