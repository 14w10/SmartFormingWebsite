import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Divider, Drawer, List, ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useCurrentUser } from 'features/user';

import { navLinks } from './nav-links';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  list: {
    marginTop: 8,
  },
  scopeList: {
    marginTop: 0,
    marginLeft: 8,
    marginRight: 8,
  },
  scopeTitle: {
    marginTop: 32,
    fontSize: '16px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  listItem: {
    borderRadius: '8px',
  },
  listItemSelected: {
    backgroundColor: 'primary',
    color: 'primary',
  },
  listItemTitle: {
    fontSize: '16px',
    fontWeight: 500,
  },
  listItemTitleActive: {
    fontSize: '16px',
    fontWeight: 800,
  },
  listItemActive: {
    borderRadius: '8px',
    backgroundColor: '#EFF2F9',
    color: '#EFF2F9',
  },
}));

export const Sidebar = () => {
  const classes = useStyles();
  const { pathname } = useRouter();

  const { currentUser } = useCurrentUser();
  const role = currentUser && currentUser.role;

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="left"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <Divider />
      <List
        disablePadding={true}
        className={role && role === 'user' ? classes.scopeList : classes.list}
      >
        {role &&
          navLinks[role as string].map((item, index) => {
            const isActivePage = pathname.match(`^${item.url}`);

            return (
              <Box key={index}>
                {item.scope && (
                  <Typography component="h3" variant="body1" className={classes.scopeTitle}>
                    {item.scope}
                  </Typography>
                )}

                <Link href={item.url} passHref>
                  <ListItem
                    className={isActivePage ? classes.listItemActive : classes.listItem}
                    button
                    component="a"
                    color="primary"
                  >
                    <Typography
                      className={isActivePage ? classes.listItemTitleActive : classes.listItemTitle}
                      color={isActivePage ? 'primary' : 'secondary'}
                    >
                      {item.title}
                    </Typography>
                  </ListItem>
                </Link>
              </Box>
            );
          })}
      </List>
    </Drawer>
  );
};
