import { CircularProgress, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Table } from 'ui-legacy';

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
  link: {
    display: 'inline',
    color: '#323F5A',
    fontWeight: 800,
    fontSize: '14px',
  },
  truncate: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
  },
  header: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: '#E2E6F0',
    fontSize: '12px',
    fontWeight: 500,
    color: '#9BA4B7',
  },
}));

const headers = ['Name', 'Email'];

export const EditorListTable = ({ items, isLoading }: { items?: Editor[]; isLoading: boolean }) => {
  const classes = useStyles();

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((caption, index) => (
            <TableCell key={index} className={classes.header} component="th">
              {caption}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell align="center" colSpan={3}>
              <CircularProgress className={classes.progress} />
            </TableCell>
          </TableRow>
        ) : items?.length !== 0 ? (
          items?.map(item => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  component="td"
                  className={classes.truncate}
                >{`${item.firstName} ${item.lastName}`}</TableCell>
                <TableCell component="td" className={classes.truncate}>
                  {item.email}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell align="center" colSpan={3}>
              List is empty...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
