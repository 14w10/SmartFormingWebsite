import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { NextPage } from 'next';
import { Box, Button, Divider, List, Paper } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ListItem, StyledLink, useConfirmModalContext } from 'ui-legacy';

import { formatDate } from 'libs/format-date';
import { redirect } from 'libs/redirect';

import { updateStatusReq } from '../api';
import { DeclineDialog } from './decline-dialog';

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

export const DetailsList: NextPage<{ request: SignUpRequest }> = ({ request }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { confirm } = useConfirmModalContext();

  const { mutate: updateStatus } = useMutation(updateStatusReq, {
    onSuccess: () => {
      redirect(null, '/signups');
    },
  });

  const handleChangeStatus = useCallback(
    (data: any) => updateStatus({ id: request.id as number, ...data }),
    [request.id, updateStatus],
  );

  return (
    <Box>
      <Box marginBottom="16px">
        <Paper elevation={0}>
          <List>
            <ListItem label="Status" body={request.status.toUpperCase()} />
            {request.status === 'declined' ? (
              <>
                <Divider />
                <ListItem label="Decline reason" body={request.declineReason} />
              </>
            ) : null}
            <Divider />
            <ListItem
              label={request.status !== 'new' ? 'Updated At' : 'Created At'}
              body={formatDate(request.updatedAt || request.createdAt)}
            />
          </List>
        </Paper>
      </Box>

      <Box marginBottom="16px">
        <Paper elevation={0}>
          <List>
            <ListItem label="Title" body={request.title.toUpperCase()} />
            <Divider />
            <ListItem className={classes.truncate} label="First Name" body={request.firstName} />
            <Divider />
            <ListItem className={classes.truncate} label="Last Name" body={request.lastName} />
            <Divider />
            <ListItem className={classes.truncate} label="Phone" body={request.phoneNumber} />
            <Divider />
            <ListItem className={classes.truncate} label="Email" body={request.email} />
          </List>
        </Paper>
      </Box>

      <Box marginBottom="16px">
        <Paper elevation={0}>
          <List>
            <ListItem
              className={classes.truncate}
              label="Organization Name"
              body={request.organizationName}
            />
            <Divider />
            <ListItem
              className={classes.truncate}
              label="Organization Address"
              body={request.organizationAddress}
            />
            <Divider />
            <ListItem
              className={classes.truncate}
              label="Organization Country"
              body={request.organizationCountry}
            />
            <Divider />
            <ListItem
              className={classes.truncate}
              label="Organization Post Code"
              body={request.organizationPostcode}
            />

            {request.position && (
              <>
                <Divider />
                <ListItem className={classes.truncate} label="Position" body={request.position} />
              </>
            )}

            {request.role && (
              <>
                <Divider />
                <ListItem
                  className={classes.truncate}
                  label="Major Role in the Organization"
                  body={request.role}
                />
              </>
            )}

            {request.organizationBusiness && (
              <>
                <Divider />
                <ListItem
                  className={classes.truncate}
                  label="Workplace"
                  body={request.organizationBusiness}
                />
              </>
            )}

            {request.website ? (
              <>
                <Divider />
                <ListItem label="Personal / Academic website">
                  <StyledLink href={request.website} text={request.website} prefetch={false} />
                </ListItem>
                <Divider />
              </>
            ) : null}

            {request.researchGate || request.otherLink || request.linkedin ? (
              <ListItem label="Public Links">
                {request.researchGate ? (
                  <StyledLink
                    href={request.researchGate}
                    text={request.researchGate}
                    prefetch={false}
                  />
                ) : null}
                {request.otherLink ? (
                  <StyledLink href={request.otherLink} text={request.otherLink} prefetch={false} />
                ) : null}
                {request.linkedin ? (
                  <StyledLink href={request.linkedin} text={request.linkedin} prefetch={false} />
                ) : null}
              </ListItem>
            ) : null}
          </List>
        </Paper>
      </Box>

      {request.status === 'new' && (
        <Box>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {
              confirm('Are you sure you want to approve this request?', () =>
                handleChangeStatus({ status: 'approve' }),
              );
            }}
          >
            Approve
          </Button>

          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            onClick={() => {
              setOpen(true);
            }}
          >
            Decline
          </Button>
        </Box>
      )}

      <DeclineDialog
        id={request.id as number}
        open={open}
        handleClose={() => setOpen(false)}
        handleChangeStatus={handleChangeStatus}
      />
    </Box>
  );
};
