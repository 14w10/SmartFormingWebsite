import React, { useCallback, useMemo } from 'react';
import { Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add, CloseOutlined, EditOutlined } from '@material-ui/icons';

import { compareFieldKeys } from 'libs/compare-field-keys';

import { useFormBuilderActions } from '../../hooks/use-form-builder';
import { AddTab } from './add-tab';

const useStyles = makeStyles(() => ({
  tab: {
    padding: '6px 8px',
    borderRadius: '8px 8px 0 0',
    backgroundColor: '#f3f1f1',
    minHeight: '38px',
  },
  addButton: {
    padding: '6px 8px',
    borderRadius: '8px 8px 0 0',
    minHeight: '38px',
  },
  label: {
    display: 'flex',
  },
  actionButton: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    '& svg': {
      fontSize: '16px',
    },
  },
  topText: {
    display: 'flex',
    lineHeight: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  description: {
    fontSize: '11px',
    height: 11,
    color: '#848484',
  },
}));

export const Tabs = () => {
  const classes = useStyles();
  const { state, actions, checkErrors } = useFormBuilderActions();
  const { schema, currentStep, currentTab } = state;
  const { setTab, removeTab, handleModal, openEditTab } = actions;
  const currentSchema = schema[currentStep];
  const tabKeys = useMemo(
    () => currentSchema && Object.keys(currentSchema.properties).sort(compareFieldKeys),
    [currentSchema],
  );

  const handleRemoveTab = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, tabKey: string) => {
      e.stopPropagation();
      removeTab(tabKey);
    },
    [removeTab],
  );

  const handleEditTab = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, tabKey: string) => {
      e.stopPropagation();
      openEditTab(tabKey);
    },
    [openEditTab],
  );

  return (
    <>
      <Box pb={3}>
        <Box mx={2} borderBottom="1px solid rgba(0, 0, 0, 0.12)">
          {tabKeys?.map(item => {
            const tab = currentSchema.properties[item];

            return (
              <Button
                key={item}
                className={classes.tab}
                classes={{ label: classes.label }}
                variant={item === currentTab ? 'contained' : 'text'}
                onClick={() => checkErrors(() => setTab(item))}
              >
                <Box className={classes.topText}>
                  {tab.title}
                  <Box className={classes.description}>{tab.description}</Box>
                </Box>
                <Box display="flex" ml={3} alignSelf="flex-start">
                  <Box className={classes.actionButton} onClick={e => handleEditTab(e, item)}>
                    <EditOutlined />
                  </Box>
                  {tabKeys.length !== 1 && (
                    <Box className={classes.actionButton} onClick={e => handleRemoveTab(e, item)}>
                      <CloseOutlined />
                    </Box>
                  )}
                </Box>
              </Button>
            );
          })}
          <Button
            onClick={() =>
              tabKeys.length === 0 ? handleModal('tab') : checkErrors(() => handleModal('tab'))
            }
            className={classes.addButton}
          >
            <Add /> Add tab
          </Button>
        </Box>
      </Box>
      <AddTab />
    </>
  );
};
