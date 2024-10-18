import { FC, useCallback, useMemo, useState } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';

import { Button, ButtonProps, FileAttachment } from '@smar/ui';

import { useFileUpload } from 'libs/upload-file';

type UploadFileProps = {
  name: string;
  onChange?: (data?: string) => void;
  buttonVariant?: ButtonProps['variant'];
  accept?: Accept;
  maxSize?: number;
  onSuccess?: () => void;
  handleRemoveFile?: (id: number) => void;
} & Record<any, any>;

const oneMB = 1024 * 1024;

export const UploadFile: FC<UploadFileProps> = ({
  name,
  onChange,
  buttonVariant,
  accept,
  maxSizeMB,
  onSuccess,
  value,
  handleRemoveFile,
}) => {
  const parsedValue = useMemo(() => value && JSON.parse(value), [value]);
  const [file, setFile] = useState<any>(parsedValue);
  const maxSizeFile = useMemo(() => oneMB * (maxSizeMB || 20), [maxSizeMB]);
  const { setError } = useFormContext();
  const { upload, selectedFile, uploadProgress, uploadState, reset } = useFileUpload({
    onSuccess: (value: any) => {
      value && onChange?.(JSON.stringify(value));
      onSuccess?.();
    },
  });
  const fileName = useMemo(() => selectedFile?.name || parsedValue?.fileData?.metadata?.filename, [
    selectedFile?.name,
    parsedValue?.fileData?.metadata?.filename,
  ]);

  const onDropRejected = useCallback(
    (file: FileRejection[]) => {
      if (file.length > 0 && file[0].file.size > maxSizeFile) {
        setError(name, { message: `The file size must be less than ${maxSizeMB || 20}MB` });
      } else {
        setError(name, { message: `${accept} file must be attached` });
      }
      reset();
    },
    [accept, maxSizeFile, name, reset, setError, maxSizeMB],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setError(name, { message: '' });
      setFile(acceptedFiles[0]);
      upload(acceptedFiles[0]);
    },
    onDropRejected,
    accept,
    maxSize: maxSizeFile,
  });

  const resetFile = useCallback(() => {
    onChange?.();
    reset();
    setFile(null);
    if (typeof file?.id === 'number') {
      handleRemoveFile?.(file.id as number);
    }
  }, [file?.id, handleRemoveFile, onChange, reset]);

  return (
    <div className="max-w-full">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {!file && (
          <Button size="md" style={{ width: 236, maxWidth: '100%' }} variant={buttonVariant}>
            Upload file
          </Button>
        )}
      </div>
      {(selectedFile || file) && (
        <FileAttachment
          fileName={fileName}
          uploadProgress={uploadState.isLoading ? uploadProgress : 100}
          resetFile={resetFile}
        />
      )}
    </div>
  );
};
