import { Accept, useDropzone } from 'react-dropzone';

import { Button } from '@smar/ui';

const oneMB = 1024 * 1024;

type UploadButtonProps = {
  onDrop: (file: File) => void;
  accept?: Accept;
  maxMBSize?: number;
};

export const UploadButton = ({
  onDrop,
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],  // MIME type for JPEG files
    'image/png': ['.png']              // MIME type for PNG files
  },
  maxMBSize = oneMB * 5,
}: UploadButtonProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => onDrop(acceptedFiles[0]),
    accept,
    maxSize: maxMBSize,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button variant="outlined">Upload cover</Button>
    </div>
  );
};
