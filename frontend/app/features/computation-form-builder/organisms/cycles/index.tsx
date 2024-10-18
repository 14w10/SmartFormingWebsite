import { useMemo } from 'react';
import { Box, Slider, Step, StepLabel, Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { FieldActions, FieldSet } from '../../atoms';
import { useFormBuilderActions } from '../../hooks/use-form-builder';
import { AddCycle } from './add-cycle';

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
  cycleStep: {
    // border:4px
  },
}));

export const Cycles = ({ cycle }: { cycle?: ISchemaItem | any }) => {
  const classes = useStyles();
  const { actions } = useFormBuilderActions();

  const arrayCycles = useMemo(() => cycle && ([...Array(cycle.maxItems).keys()] as number[]), [
    cycle,
  ]);

  return (
    <>
      {cycle && (
        <Box width="100%" borderBottom="1px solid rgba(0, 0, 0, 0.12)" mb={3}>
          <Box width={1 / 3}>
            <FieldSet mb={3} label={cycle.title} name="">
              <FieldActions
                editField={() => actions.openEditField('cycle', 'cycle')}
                removeField={() => actions.removeField('cycle', 'cycle')}
              />
              <Slider
                disabled
                classes={{ valueLabel: classes.valueSlider, root: classes.rootSlider }}
                min={cycle.minItems}
                max={cycle.maxItems}
                value={cycle.maxItems}
                step={1}
                valueLabelDisplay="on"
                marks={[
                  {
                    value: cycle.minItems as number,
                    label: cycle.minItems,
                  },
                  {
                    value: cycle.maxItems as number,
                    label: cycle.maxItems,
                  },
                ]}
              />
              <Stepper>
                {arrayCycles.map((item: number) => (
                  <Step key={item}>
                    <StepLabel />
                  </Step>
                ))}
              </Stepper>
            </FieldSet>
          </Box>
        </Box>
      )}
      <AddCycle />
    </>
  );
};
