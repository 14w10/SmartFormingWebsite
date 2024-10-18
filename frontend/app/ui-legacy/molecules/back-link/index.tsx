import { Box, Icon, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowBack } from '@material-ui/icons';

import { StyledLink } from '../../atoms';

const useStyles = makeStyles(() => ({
  icon: {
    marginRight: 8,
    color: '#9BA4B7',
  },
  text: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#9BA4B7',
  },
}));

interface IBackLink {
  href: string;
  text: string;
  as?: string;
}

export const BackLink = ({ href, text, as }: IBackLink) => {
  const classes = useStyles();

  return (
    <StyledLink href={href} as={as}>
      <Box display="flex" alignItems="center">
        <Icon className={classes.icon}>
          <ArrowBack />
        </Icon>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
    </StyledLink>
  );
};
