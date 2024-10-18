import { useMemo } from 'react';
import { useEffectOnce } from 'react-use';
import { flexRender, Row } from '@tanstack/react-table';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { Icon } from '@smar/ui';

import { useFileUpload } from 'libs/upload-file';

export const TableRow = ({
  row,
  handleAddUploadedFile,
  isSelected,
}: {
  row: Row<DatasetAttachment>;
  handleAddUploadedFile: (data: any, index: number) => void;
  isSelected: boolean;
}) => {
  const { upload, selectedFile, uploadProgress, uploadState } = useFileUpload({
    onSuccess: (data: any) => {
      data && handleAddUploadedFile(data, row.index);
    },
  });
  const fileUploaded = useMemo(() => (uploadState.isLoading ? uploadProgress : 100) === 100, [
    uploadProgress,
    uploadState.isLoading,
  ]);
  useEffectOnce(() => {
    if (!selectedFile && !(row.original as any).id) {
      upload((row.original.fileData as any).metadata as File);
    }
  });
  return (
    <tr
      className={clsx(
        isSelected && 'bg-primaryBlue940',
        'border-secondaryDarkBlue930 h-6 border-b',
      )}
    >
      {row.getVisibleCells().map(cell => {
        return (
          <td key={cell.id} className={clsx(cell.column.id === 'type' && 'w-12')}>
            <div className="flex gap-2">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
              {!fileUploaded && cell.column.id === 'name' && (
                <motion.div
                  className="inline-flex w-3 h-3"
                  animate={{ rotate: 360 }}
                  transition={{ loop: Infinity, duration: 0.5 }}
                >
                  <Icon name="small-spinner" iconFill="secondaryDarkBlue910" size={24} />
                </motion.div>
              )}
              {uploadState.error && cell.column.id === 'name' && (
                <p className="v-p130 text-auxiliaryRed900">{uploadState.error}</p>
              )}
            </div>
          </td>
        );
      })}
    </tr>
  );
};
