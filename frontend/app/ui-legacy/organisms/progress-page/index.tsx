import React, { memo, useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  root: {
    zIndex: 10000,
    position: 'fixed',
    top: 0,
    width: '100%',
  },
  colorSecondary: {
    backgroundColor: 'red',
  },
});

let timeoutId = -1;
const useProgress = () => {
  const [progress, setProgress] = useState(false);
  const start = useCallback(() => {
    timeoutId = setTimeout(() => setProgress(true), 200) as any;
  }, []);

  const done = useCallback(() => {
    setProgress(false);
    clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', done);
    Router.events.on('routeChangeError', done);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', done);
      Router.events.off('routeChangeError', done);
    };
  }, [done, start]);
  return progress;
};

export const ProgressPage = memo(() => {
  const isLoading = useProgress();
  const classes = useStyles();

  return (
    <>
      {isLoading && (
        <LinearProgress
          style={{ colorPrimary: classes.colorSecondary } as any}
          className={classes.root}
        />
      )}
    </>
  );
});
