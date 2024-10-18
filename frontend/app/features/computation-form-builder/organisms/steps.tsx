import { useCallback } from 'react';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add, CloseOutlined } from '@material-ui/icons';
import { useConfirmModalContext } from 'ui-legacy';

import { useFormBuilderActions } from '../hooks/use-form-builder';

const useStyles = makeStyles(() => ({
  tab: {
    padding: '6px 8px',
  },
  close: {
    marginLeft: '20px',
    display: 'inline-flex',
    alignSelf: 'flex-start',
    '& svg': {
      fontSize: '16px',
    },
  },
}));

export const Steps = () => {
  const classes = useStyles();
  const { confirm } = useConfirmModalContext();
  const { state, actions, checkErrors, formErrorSet } = useFormBuilderActions();
  const { schema, currentStep } = state;
  const { setStep, addStep, removeStep } = actions;

  const handleRemoveStep = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, step: number) => {
      e.stopPropagation();

      confirm('Are you sure you want to remove this step?', () => {
        removeStep(step);
        formErrorSet(null);
      });
    },
    [confirm, formErrorSet, removeStep],
  );

  return (
    <Box>
      {schema.map((item, index) => (
        <Button
          key={item.$id}
          className={classes.tab}
          variant={index === currentStep ? 'contained' : 'text'}
          onClick={() => checkErrors(() => setStep(index))}
        >
          {item.stepTitle !== '' ? item.stepTitle : `Step ${index + 1}`}
          {schema.length > 1 && (
            <Box className={classes.close} onClick={e => handleRemoveStep(e, index)}>
              <CloseOutlined />
            </Box>
          )}
        </Button>
      ))}
      <Button onClick={() => checkErrors(() => addStep())}>
        <Add /> ADD
      </Button>
    </Box>
  );
};
