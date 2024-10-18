import { FC, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ControllerRenderProps } from 'react-hook-form';

import { Button, Icon } from '@smar/ui';

import { useFileUpload } from 'libs/upload-file';

type UploadIconProps = ControllerRenderProps<Record<string, any>> & {
  value: { preview?: string };
};

export const UploadIcon: FC<UploadIconProps> = ({ onChange, value }) => {
  const [image, imageSet] = useState<{ preview?: string } | undefined>(value);
  const { upload, selectedFile, uploadState, reset } = useFileUpload({
    onSuccess: (value: any) => {
      onChange?.(value);
    },
  });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => upload(acceptedFiles[0]),
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 1024 * 1024 * 5,
  });

  useEffect(() => {
    if (!selectedFile) return;
    imageSet(
      Object.assign(selectedFile, {
        preview: URL.createObjectURL(selectedFile),
      }),
    );
  }, [selectedFile]);

  const resetFile = useCallback(
    (    e: { preventDefault: () => void; }) => {
      e.preventDefault();
      reset();
      imageSet(undefined);
      onChange?.();
    },
    [onChange, reset],
  );

  return (
    <div className="relative flex gap-3">
      <div className="bg-secondaryDarkBlue940 flex items-center justify-center p-1 w-7 h-7 rounded-full overflow-hidden">
        {image?.preview && <img src={image?.preview} className="w-full" alt="" />}
      </div>
      {!image ? (
        <div className="flex items-center" {...getRootProps()}>
          <input className="hidden" {...getInputProps()} />
          <Button size="md" variant="icon" className="text-primaryBlue900 gap-1">
            <Icon name="24px-download" size={24} /> upload icon
          </Button>
        </div>
      ) : (
        <Button size="md" variant="icon" className="text-primaryBlue900 gap-1" onClick={resetFile}>
          <Icon name="24px-delete_forever" size={24} /> remove icon
        </Button>
      )}
      {uploadState.error && (
        <p className="text-auxiliaryRed900 absolute text-sm">{uploadState.error}</p>
      )}
    </div>
  );
};
