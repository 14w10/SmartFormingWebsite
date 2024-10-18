import { FormEvent, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Fab, InputBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Clear, SearchOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  searchForm: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    color: 'secondary.light',
  },
  inputRoot: {
    width: '100%',
    color: 'secondary',
    fontSize: '14px',
    height: '40px',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    width: '100%',
    fontSize: '14px',
  },
  clean: {
    flexShrink: 0,
    minHeight: 'auto',
    height: 20,
    width: 20,
  },
  cleanIcon: {
    fontSize: 12,
  },
}));

type SearchField = {
  placeholder?: string;
};

export const SearchField: React.FC<SearchField> = ({ placeholder }) => {
  const classes = useStyles();
  const { query, push, pathname } = useRouter();
  const inputRef = useRef<any>('');

  const handleSearchForm = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e && e.preventDefault();
      const search = inputRef.current.value;
      const url = { pathname, query: { ...query, search, page: 1 } };
      push(url, url, { shallow: true });
    },
    [pathname, push, query],
  );

  return (
    <form className={classes.searchForm} onSubmit={handleSearchForm}>
      <Button className={classes.searchIcon} variant="text">
        <SearchOutlined />
      </Button>
      <InputBase
        inputRef={inputRef}
        name="search"
        placeholder={placeholder ?? 'Search..'}
        autoComplete="off"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
      {inputRef.current.value && inputRef.current.value !== '' && (
        <Box py="6px" px={2}>
          <Fab
            className={classes.clean}
            size="small"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { search, ...values } = query;
              inputRef.current.value = '';
              const url = { pathname, query: { ...values, page: 1 } };
              push(url, url, { shallow: true });
            }}
          >
            <Clear className={classes.cleanIcon} />
          </Fab>
        </Box>
      )}
    </form>
  );
};
