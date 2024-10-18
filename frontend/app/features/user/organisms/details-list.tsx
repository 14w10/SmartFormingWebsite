import { NextPage } from 'next';
import { Box, Divider, List, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ListItem, StyledLink } from 'ui-legacy';

import { formatDate } from 'libs/format-date';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginRight: theme.spacing(1),
    },
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
);

export const DetailsList: NextPage<{ user: IUser }> = ({ user }) => {
  const classes = useStyles();

  return (
    <Box>
      <Box marginBottom="16px">
        <Paper elevation={0}>
          <List>
            <ListItem
              className={classes.truncate}
              label="Registered At"
              body={formatDate(user.signup.updatedAt)}
            />
          </List>
        </Paper>
      </Box>

      <Box marginBottom="16px">
        <Paper elevation={0}>
          <List>
            <ListItem className={classes.truncate} label="Title" body={user.title.toUpperCase()} />
            <Divider />
            <ListItem className={classes.truncate} label="First Name" body={user.firstName} />
            <Divider />
            <ListItem className={classes.truncate} label="Last Name" body={user.lastName} />
            <Divider />
            <ListItem className={classes.truncate} label="Phone" body={user.signup.phoneNumber} />
            <Divider />
            <ListItem className={classes.truncate} label="Email" body={user.signup.email} />
          </List>
        </Paper>
      </Box>

      <Box marginBottom="16px">
        <Paper elevation={0}>
          <List>
            <ListItem
              className={classes.truncate}
              label="Organization Name"
              body={user.signup.organizationName}
            />
            <Divider />
            <ListItem
              className={classes.truncate}
              label="Organization Address"
              body={user.signup.organizationAddress}
            />
            <Divider />
            <ListItem
              className={classes.truncate}
              label="Organization Country"
              body={user.signup.organizationCountry}
            />
            <Divider />
            <ListItem
              className={classes.truncate}
              label="Organization Post Code"
              body={user.signup.organizationPostcode}
            />

            {user.signup.position && (
              <>
                <Divider />
                <ListItem
                  className={classes.truncate}
                  label="Position"
                  body={user.signup.position}
                />
              </>
            )}

            {user.signup.role && (
              <>
                <Divider />
                <ListItem
                  className={classes.truncate}
                  label="Major Role in the Organization"
                  body={user.signup.role}
                />
              </>
            )}

            {user.signup.organizationBusiness && (
              <>
                <Divider />
                <ListItem
                  className={classes.truncate}
                  label="Workplace"
                  body={user.signup.organizationBusiness}
                />
              </>
            )}

            {user.signup.website && (
              <>
                <Divider />
                <ListItem className={classes.truncate} label="Personal / Academic website">
                  <StyledLink
                    className={classes.truncate}
                    href={user.signup.website}
                    text={user.signup.website}
                  />
                </ListItem>
              </>
            )}

            {(user.signup.researchGate || user.signup.otherLink || user.signup.linkedin) && (
              <>
                <Divider />
                <ListItem className={classes.truncate} label="Public Links">
                  {user.signup.researchGate && (
                    <StyledLink
                      className={classes.truncate}
                      href={user.signup.researchGate}
                      text={user.signup.researchGate}
                    />
                  )}
                  {user.signup.otherLink && (
                    <StyledLink
                      className={classes.truncate}
                      href={user.signup.otherLink}
                      text={user.signup.otherLink}
                    />
                  )}
                  {user.signup.linkedin && (
                    <StyledLink
                      className={classes.truncate}
                      href={user.signup.linkedin}
                      text={user.signup.linkedin}
                    />
                  )}
                </ListItem>
              </>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};
