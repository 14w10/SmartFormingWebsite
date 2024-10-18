import { useCallback, useMemo, useState } from 'react';
import { useEvent } from 'react-use';
import { useRouter } from 'next/router';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export const ReloadModal = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useRouter();
  const isSignIn = useMemo(() => pathname === '/sign-in', [pathname]);

  const handleReload = useCallback(() => location.reload(), []);

  const onStorage = useCallback(
    (e: StorageEvent) => {
      if (e.newValue === 'false') {
        setOpen(true);
      } else if (isSignIn) {
        setOpen(true);
      }
    },
    [isSignIn],
  );

  useEvent('storage', onStorage);

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {isSignIn ? 'You are already logged in' : 'Session has expired'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {isSignIn ? 'You are already logged in' : ' You session has expired'}. Please click Reload
          button or reload the page.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReload} color="primary">
          Reload
        </Button>
      </DialogActions>
    </Dialog>
  );
};
