import React, { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Box, CircularProgress, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { AttachmentOutlined, Close, Publish } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { FieldProps } from 'formik';

import { uploadFile } from 'libs/upload-file';
import { AxiosProgressEvent } from 'axios';

const useStyles = makeStyles(() => ({
  root: {
    outline: 'none',
  },
  loader: {
    color: '#cfd8dc',
    width: '20px !important',
    height: '20px !important',
  },
  input: {
    position: 'relative',
    '& p': {
      position: 'absolute',
      bottom: -24,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '100%',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
  },
}));

const maxSizeFile = 1024 * 1024 * 10;

interface IFieldFile {
  field: FieldProps['field'];
  form: FieldProps['form'];
  label: string;
  accept: Accept;
  error?: string;
  helperText?: string;
  isComputation?: boolean;
  handleRemoveFile?: (id: number) => void;
}

export const FieldFile = ({
  field: { name, value },
  error,
  form,
  label,
  accept,
  helperText,
  isComputation = false,
  handleRemoveFile,
}: IFieldFile) => {
  const classes = useStyles();
  const [progress, setProgress] = useState<null | number>(null);
  const [file, setFile] = useState<any>(value);
  const [fileName, setFileName] = useState<string | null>(value?.fileData?.metadata?.filename);

  const handleProgress = useCallback((progress: AxiosProgressEvent) => {
    if (progress.total) {
      const percent = parseFloat(((progress.loaded / progress.total) * 100).toFixed());
      // Use `percent` here
      setProgress(percent);
    } 
  }, []);

  const onDropRejected = useCallback(
    (file: any[]) => {
      if (file.length > 0 && file[0].file.size > maxSizeFile) {
        form.setFieldError(name, 'The file size must be less than 10MB');
      } else {
        form.setFieldError(name, `${accept} file must be attached`);
      }
    },
    [accept, form, name],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const dropFile = acceptedFiles[0];
        setFileName(dropFile.name);

        const uploadedFile = await uploadFile(dropFile, handleProgress);

        if (isComputation) {
          const value = {
            ...uploadedFile,
            label,
            description: helperText,
            fieldName: name.split('.')[1],
          };
          form.setFieldValue(name, value);
        } else {
          form.setFieldValue(name, uploadedFile);
        }

        form.validateForm();
        setFile(uploadedFile);
      }
    },
    [form, handleProgress, helperText, isComputation, label, name],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeFile,
    multiple: false,
    onDropRejected: file => onDropRejected(file),
  });

  const removeFile = useCallback(
    (    e: { stopPropagation: () => void; }) => {
      e.stopPropagation();
      if (typeof file?.id === 'number') {
        handleRemoveFile?.(file.id as number);
      }

      form.setFieldValue(name, '');
      setFile(null);
      setFileName(null);
    },
    [file?.id, form, handleRemoveFile, name],
  );

  return (
    <div {...getRootProps()} className={classes.root}>
      <input {...getInputProps()} />
      <TextField
        className={classes.input}
        variant="outlined"
        label={label}
        fullWidth
        disabled
        value={fileName ? fileName : 'Drop the file here ...'}
        margin="dense"
        error={Boolean(error)}
        helperText={error ? error : helperText}
        InputProps={{
          startAdornment: (
            <>
              <InputAdornment position="start">
                <AttachmentOutlined />
              </InputAdornment>
              {progress !== null && progress !== 100 && (
                <InputAdornment position="start">
                  <CircularProgress
                    classes={{ root: classes.loader }}
                    variant="static"
                    value={progress}
                  />
                </InputAdornment>
              )}
            </>
          ),
          endAdornment: (
            <>
              {file && (
                <Box mr={1} onClick={removeFile}>
                  <IconButton size="small">
                    <Close />
                  </IconButton>
                </Box>
              )}
              <Box
                minHeight={40}
                minWidth={40}
                bgcolor="#cfd8dc"
                mr="-14px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Publish />
              </Box>
            </>
          ),
        }}
      />
    </div>
  );
};
