import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Row } from '@tanstack/react-table';
import clsx from 'clsx';

import { UploadedFilesTable } from './uploaded-files-table';

type UploadFileProps = {
  name: string;
  onChange?: (data?: any) => void;
  accept?: Accept;
  maxSize?: number;
  onSuccess?: () => void;
  handleRemoveFile?: (id: number) => void;
  handleChangeFilePrice?: (id: number | string, price: boolean) => void;
} & Record<any, any>;

const oneMB = 1024 * 1024;

export const DatasetField: FC<UploadFileProps> = ({
  name,
  onChange,
  accept,
  maxSizeMB,
  value,
  handleRemoveFile,
  handleChangeFilePrice,
}) => {
  const [files, setFiles] = useState<DatasetAttachment[]>(value || []);
  const maxSizeFile = useMemo(() => oneMB * (maxSizeMB || 50), [maxSizeMB]);
  const { setError } = useFormContext();

  const handleAddUploadedFile = useCallback((data: any, index: number) => {
    setFiles(prev => prev.map((item, i) => (i === index ? { fileData: data, paid: true } : item)));
  }, []);

  const onDropRejected = useCallback(
    (files: FileRejection[]) => {
      const overSizeFile = files.length > 0 && files.find(item => item.file.size > maxSizeFile);
      if (overSizeFile) {
        setError(name, {
          message: `The file "${overSizeFile.file.name}" size must be less than ${
            maxSizeMB || 50
          }MB`,
        });
      } else {
        setError(name, { message: `${accept} file must be attached` });
      }
    },
    [accept, maxSizeFile, name, setError, maxSizeMB],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setError(name, { message: '' });
      setFiles(files => [
        ...files,
        ...acceptedFiles
          .map(item => ({ fileData: { metadata: item as any }, paid: true }))
          .filter(
            item =>
              !files.find(file => file.fileData.metadata.name === item.fileData.metadata.name),
          ),
      ]);
    },
    onDropRejected,
    accept,
    maxSize: maxSizeFile,
  });

  useEffect(() => {
    onChange?.(files);
  }, [files, onChange]);

  const removeFiles = useCallback(
    (selectedFiles: any[]) => {
      selectedFiles.forEach(item => {
        return item.id && handleRemoveFile?.(item.id);
      });
      setFiles(prev =>
        prev.filter((_, index) => !selectedFiles.find(item => index === item.index)),
      );
    },
    [handleRemoveFile],
  );

  const handleSetPrice = useCallback(
    (selectedRows: Row<DatasetAttachment>[], paid: boolean) => {
      selectedRows.forEach(
        item => item.original.id && handleChangeFilePrice?.(item.original.id, paid),
      );

      setFiles(prev => {
        return prev.reduce<DatasetAttachment[]>(
          (acc, item, index) => [
            ...acc,
            {
              ...item,
              ...(selectedRows.find(item => index === item.index) ? { paid } : { paid: item.paid }),
            },
          ],
          [],
        );
      });
    },
    [handleChangeFilePrice],
  );

  return (
    <div className="max-w-full transition-all">
      <div
        {...getRootProps({
          className: clsx(
            'rounded-large border-secondaryDarkBlue921 h-18 hover:bg-primaryBlue940 hover:border-primaryBlue900 flex items-center justify-center border border-dashed transition-all',
          ),
        })}
      >
        <input {...getInputProps()} />

        <p className="v-text130">
          Drag & drop or <span className="text-primaryBlue900">choose file</span> to upload
        </p>
      </div>
      <UploadedFilesTable
        files={files}
        removeFiles={removeFiles}
        handleAddUploadedFile={handleAddUploadedFile}
        handleSetPrice={handleSetPrice}
      />
    </div>
  );
};
