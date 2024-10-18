import Link from 'next/link';
import { Box, CircularProgress, Link as LinkMui, List, ListItem, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SubjectCard } from 'ui-legacy/molecules/subject-card';

interface ISubjectList {
  items?: Subject[];
  isLoading?: boolean;
  linkPrefix: string;
}

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
  },
  list: {
    width: '100%',
  },
  listItem: {
    padding: 0,
    marginTop: 16,
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: 8,
  },
  link: {
    width: '100%',
  },
}));

export const SubjectList = ({
  items,
  isLoading,
  linkPrefix
}: ISubjectList) => {
  const classes = useStyles();

  return (
    <List disablePadding={true}>
      {isLoading ? (
        <ListItem className={classes.listItem}>
          <Paper className={classes.paper} elevation={0}>
            <Box display="flex" justifyContent="center">
              <CircularProgress className={classes.progress} />
            </Box>
          </Paper>
        </ListItem>
      ) : items?.length !== 0 ? (
        items?.map(item => {
          return (
            <ListItem className={classes.listItem} key={item.id}>
              <Link href={`${linkPrefix}/[id]`} as={`${linkPrefix}/${item.id}`} passHref>
                <LinkMui className={classes.link} color="inherit" underline="none">
                  <SubjectCard {...item} />
                </LinkMui>
              </Link>
            </ListItem>
          );
        })
      ) : (
        <ListItem className={classes.listItem}>
          <Paper className={classes.paper} elevation={0}>
            <Box p={2}>List is empty...</Box>
          </Paper>
        </ListItem>
      )}
    </List>
  );
};
