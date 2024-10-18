import Link from 'next/link';
import { Box, CircularProgress, Link as LinkMui, List, ListItem, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ModuleCard } from '../../molecules/module-card';

interface IModuleList {
  items?: Module[];
  isLoading?: boolean;
  linkPrefix: string;
  storeCard?: boolean;
  isUser?: boolean | null;
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

export const ModulesList = ({
  items,
  isLoading,
  linkPrefix,
  isUser,
  storeCard = false,
}: IModuleList) => {
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
                  <ModuleCard {...item} storeCard={storeCard} isUser={isUser} />
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
