import Link from 'next/link';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add } from '@material-ui/icons';

import { useTemplate } from './hooks/use-template';
import { Cycles, Fields, MetaFields, Steps, Tabs } from './organisms';

const useStyles = makeStyles(() => ({
  paper: {
    padding: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  close: {
    fontSize: 14,
    color: '#000',
  },
  cancel: {
    marginLeft: 16,
  },
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

export const Template = () => {
  const classes = useStyles();

  const {
    isExistTab,
    handleSaveForm,
    handleModal,
    isLoading,
    formError,
    formErrors,
    query,
    cycleSchema,
    fieldKeys,
    filesBlockEnabled,
    actions,
    currentStep,
  } = useTemplate();

  return (
    <>
      <Typography color="textSecondary" variant="h4" component="h3">
        Simulation results
      </Typography>

      <FormControlLabel
        control={
          <Checkbox checked={filesBlockEnabled} onChange={actions.toggleFiles} name="files" />
        }
        label="Enable upload of simulation results in the computation form"
      />

      <Box mt={3} mb={1}>
        <Typography color="textSecondary" variant="h4" component="h3">
          Computation steps
        </Typography>
      </Box>

      <Paper elevation={0}>
        <Steps />
        <Divider />
        <Box className={classes.paper}>
          <MetaFields />
        </Box>
        <Tabs />
        {isExistTab && (
          <>
            <Box pb={2} px={2} display="flex" alignItems="center" flexWrap="wrap">
              <Cycles cycle={cycleSchema} />
              <Fields cycle={cycleSchema} />
              <Box width={1 / 3} display="flex">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleModal('field')}
                  style={{ width: '100%' }}
                >
                  <Add className={classes.icon} />
                  {cycleSchema ? 'Add cycle field' : 'Add field'}
                </Button>
                {!cycleSchema && fieldKeys?.length === 0 && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleModal('cycle')}
                    style={{ width: '100%', marginLeft: 16 }}
                  >
                    <Add className={classes.icon} />
                    Add cycle
                  </Button>
                )}
              </Box>
            </Box>
          </>
        )}
      </Paper>
      {formError?.message && (
        <Box mt={2}>
          <Typography color="error">{formError.message}</Typography>
        </Box>
      )}
      {formErrors && (
        <Box mt={2}>
          {formErrors[currentStep].map((item, i) => (
            <Typography key={i} color="error">
              {item.message}
            </Typography>
          ))}
        </Box>
      )}
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSaveForm} disabled={isLoading}>
          Save
        </Button>
        <Link href={`/modules/${query.moduleId}`} passHref>
          <Button component="a" className={classes.cancel}>
            Cancel
          </Button>
        </Link>
      </Box>
    </>
  );
};
