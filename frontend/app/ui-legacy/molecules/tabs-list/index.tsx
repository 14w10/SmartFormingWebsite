import { FC, ReactNode } from 'react';
import { Card } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      padding: 0,
      borderRadius: '8px',
      justifyContent: 'space-between',
    },
  }),
);

export const TabsList: FC<{ children: ReactNode }> = ({ children }) => {
  const classes = useStyles();
  return <Card className={classes.root}>{children}</Card>;
};
