import { CircularProgress, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { StyledLink, Table } from 'ui-legacy';

import { formatDate } from 'libs/format-date';

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

const headers = ['Name', 'Email', 'Organization', 'Registered at'];

export const UserListTable = ({ items, isLoading }: { items?: IUser[]; isLoading: boolean }) => {
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
            <TableCell align="center" colSpan={4} component="td">
              <CircularProgress className={classes.progress} />
            </TableCell>
          </TableRow>
        ) : items && items.length !== 0 ? (
          items?.map(item => {
            return (
              <TableRow key={item.id}>
                <TableCell className={classes.truncate} component="td" scope="row">
                  <StyledLink
                    className={classes.link}
                    href="users/[userId]/details"
                    as={`users/${item.id}/details`}
                    text={`${item.firstName} ${item.lastName}`}
                  />
                </TableCell>
                <TableCell className={classes.truncate} component="td">
                  {item.signup.email}
                </TableCell>
                <TableCell className={classes.truncate} component="td">
                  {item.signup.organizationName}
                </TableCell>
                <TableCell className={classes.truncate} component="td">
                  {formatDate(item.signup.updatedAt)}
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell align="center" colSpan={4}>
              List is empty...
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
