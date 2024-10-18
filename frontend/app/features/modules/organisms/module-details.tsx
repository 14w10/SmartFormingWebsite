import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Chip, Grid, Link as MuiLink, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AttachmentSharp } from '@material-ui/icons';
import startCase from 'lodash.startcase';
import {
  DetailsCard as ModuleCard,
  PageTitle,
  Placeholder,
  ReasonCard,
  StyledLink,
} from 'ui-legacy';

import { formatDate } from 'libs/format-date';
import { transformType } from 'libs/transform-type';
import { useCurrentUser } from 'features/user';

import { getModuleQueryKey } from '../api';
import { StatusButtons } from '../molecules/status-buttons';

const useStyles = makeStyles(({ palette, spacing }) => ({
  status: {
    marginRight: spacing(2),
    textTransform: 'capitalize',
  },
  boxHead: {
    overflow: 'hidden',
    borderBottom: `2px solid ${palette.grey[100]}`,
  },
  author: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  textHelp: {
    whiteSpace: 'nowrap',
    fontWeight: 700,
  },
  attachmentLink: {
    marginLeft: spacing(1),
    color: '#9BA4B7',
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 500,
    color: '#323F5A',
    opacity: '50%',
  },
}));

export const ModuleDetails = () => {
  const { query } = useRouter();
  const { currentUser } = useCurrentUser();
  const isUser = currentUser && currentUser.role === 'user';

  const { data, isError } = useQuery<ComputationModuleDTO>(
    getModuleQueryKey({ moduleId: query.moduleId as ID, isUser }),
  );

  const payload = data?.payload;
  const classes = useStyles();

  const type = transformType(payload?.moduleType);

  const attachments = useMemo(
    // removing unnecessary || []
    () => [...(payload?.attachments || []), ...(payload?.datasets || [])],
    [payload?.attachments, payload?.datasets],
  );

  return (
    <>
      <PageTitle title="Module Details">{payload && <StatusButtons module={payload} />}</PageTitle>
      {!isError ? (
        payload && (
          <Grid container spacing={2}>
            <Grid item md={6} style={{ width: '100%' }}>
              <Box mb={2}>
                <Paper elevation={0}>
                  <Box display="flex" alignItems="center" p={2} className={classes.boxHead}>
                    <Chip
                      label={payload.status === 'under_review' ? 'Under Review' : payload.status}
                      size="small"
                      className={classes.status}
                    />
                    <Typography variant="body2" className={classes.textHelp}>
                      Created at:{' '}
                      <Typography variant="body1" component="span">
                        {formatDate(payload.createdAt)}
                      </Typography>
                    </Typography>
                    {!isUser && (
                      <Box ml={2}>
                        <Typography variant="body2" className={classes.textHelp}>
                          Author:{' '}
                          <StyledLink
                            href="/users/[id]/details"
                            as={`/users/${payload.author.id}/details`}
                          >
                            <Typography variant="body1" component="span" className={classes.author}>
                              {`${payload.author.firstName} ${payload.author.lastName}`}
                            </Typography>
                          </StyledLink>
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box p={2}>
                    <Typography className={classes.textHelp}>Title:</Typography>
                    <Typography className={classes.text}>{payload.title}</Typography>
                  </Box>
                </Paper>
              </Box>
              <ModuleCard title="Short Description">
                <Typography className={classes.text}>{payload.shortDescription}</Typography>
              </ModuleCard>
              <ModuleCard title="Description">
                <Typography className={classes.text}>{payload.description}</Typography>
              </ModuleCard>
              {payload.uid && (
                <ModuleCard title="Id">
                  <Typography className={classes.text}>{payload.uid}</Typography>
                </ModuleCard>
              )}
            </Grid>
            <Grid item md={6} style={{ width: '100%' }}>
              {payload.rejectReason && <ReasonCard rejectReason={payload.rejectReason} />}
              {attachments.map(item => (
                <ModuleCard key={item.id} title={startCase(item.fileType || 'Dataset')}>
                  <Box display="flex" alignItems="center">
                    <AttachmentSharp />
                    <MuiLink href={item.fileUrl} className={classes.attachmentLink} target="_blank">
                      {item.fileData.metadata.filename}
                    </MuiLink>
                  </Box>
                </ModuleCard>
              ))}
              <ModuleCard title="Type">
                <Typography className={classes.text}>{type}</Typography>
              </ModuleCard>
            </Grid>
          </Grid>
        )
      ) : (
        <Placeholder />
      )}
    </>
  );
};
