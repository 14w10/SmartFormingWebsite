import { useMemo } from 'react';
import { Box, Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SelectField } from 'ui-legacy';
import { useDynamicForm } from 'ui-legacy/organisms/dynamic-form/use-dynamic-form';

import { FieldActions, FieldSet } from '../../atoms';
import { useFormBuilderActions } from '../../hooks/use-form-builder';
import { AddField } from './add-field';

const useStyles = makeStyles(() => ({
  valueSlider: {
    left: 'calc(-50% - 1px)',
    top: -14,
    '& > span': {
      width: 18,
      height: 18,
    },
  },
  rootSlider: {
    marginTop: 14,
  },
}));

export const Fields = ({ cycle }: { cycle?: ISchemaItem }) => {
  const classes = useStyles();
  const { state, actions } = useFormBuilderActions();

  const { schema, currentStep, currentTab } = state;

  const currentFields = useMemo(() => {
    const stepFields = currentTab && schema[currentStep].properties[currentTab]?.items;
    const fields = cycle ? cycle.items : stepFields;
    return fields;
  }, [currentStep, currentTab, cycle, schema]);

  const form = useDynamicForm(schema && currentFields);

  return (
    <>
      {form.fields.map(item => (
        <Box key={item.name} width={1 / 3} pr={3}>
          <FieldSet mb={3} {...item}>
            <FieldActions
              editField={() => actions.openEditField(item.name)}
              removeField={() => actions.removeField(item.name)}
            />

            {item.type === 'integer' && (
              <Slider
                disabled
                classes={{ valueLabel: classes.valueSlider, root: classes.rootSlider }}
                value={item.default}
                min={item.minLength}
                max={item.maxLength}
                step={1}
                valueLabelDisplay="on"
                marks={[
                  {
                    value: item.minLength as number,
                    label: item.minLength,
                  },
                  {
                    value: item.maxLength as number,
                    label: item.maxLength,
                  },
                ]}
              />
            )}
            {item.type === 'string' && (
              <SelectField
                label=""
                options={item.enum?.map((value: string) => ({ value, label: value }))}
              />
            )}
          </FieldSet>
        </Box>
      ))}
      <AddField />
    </>
  );
};
