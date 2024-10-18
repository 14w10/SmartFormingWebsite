import { useCallback, useEffect, useMemo } from 'react';
import { Box } from '@material-ui/core';

import { FieldSet } from '../atoms/field-set';
import { Input } from '../atoms/input';
import { useFormBuilderActions } from '../hooks/use-form-builder';

export const MetaFields = () => {
  const { state, actions, formError, metaValues, metaValuesSet } = useFormBuilderActions();

  const { schema, currentStep } = state;
  const { setMetaField } = actions;
  const currentSchema = schema[currentStep];

  const onChange = useCallback(
    (name: string, value: string) => {
      metaValuesSet(prevValues => ({ ...prevValues, [name]: value }));
    },
    [metaValuesSet],
  );

  const existSameValue = useMemo(
    () =>
      schema
        .filter((_, i) => i !== currentStep)
        .find(item => item.stepTitle === metaValues.stepTitle),

    [currentStep, metaValues.stepTitle, schema],
  );

  useEffect(() => {
    currentSchema &&
      metaValuesSet({
        title: currentSchema.title,
        stepTitle: currentSchema.stepTitle,
        description: currentSchema.description,
      });
  }, [currentSchema, currentStep, metaValuesSet]);

  return (
    <Box maxWidth={700}>
      <Box maxWidth={400}>
        <FieldSet label="Step tab title *">
          <Input
            error={
              formError?.type === 'metaFields' && metaValues.stepTitle === '' && !existSameValue
            }
            value={metaValues.stepTitle}
            onBlur={e => setMetaField('stepTitle', e.target.value)}
            onChange={e => onChange('stepTitle', e.target.value)}
          />
          {existSameValue && (
            <p className="text-auxiliaryRed900">Step with this title already exists</p>
          )}
        </FieldSet>
      </Box>
      <FieldSet label="Step title *">
        <Input
          error={formError?.type === 'metaFields' && metaValues.title === ''}
          onBlur={e => setMetaField('title', e.target.value)}
          value={metaValues.title}
          onChange={e => onChange('title', e.target.value)}
        />
      </FieldSet>
      <FieldSet label="Step description">
        <Input
          multiline
          rows={4}
          onBlur={e => setMetaField('description', e.target.value)}
          onChange={e => onChange('description', e.target.value)}
          value={metaValues.description}
        />
      </FieldSet>
    </Box>
  );
};
