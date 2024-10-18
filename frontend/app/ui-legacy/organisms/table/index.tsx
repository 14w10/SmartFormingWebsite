import { FC, ReactNode } from 'react';
import { Table as TableMui } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 800,
    tableLayout: 'fixed',
  },
}));
interface TableProps {
  children: ReactNode;
}

export const Table: FC<TableProps> = ({ children }) => {
  const classes = useStyles();

  return <TableMui className={classes.table}>{children}</TableMui>;
};

