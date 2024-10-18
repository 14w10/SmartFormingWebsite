import { memo, useMemo } from 'react';
import { Cell, flexRender } from '@tanstack/react-table';
import clsx from 'clsx';
import { motion } from 'framer-motion';

import { Icon } from '@smar/ui';

import { useDownloadProgress } from 'features/dataset-request/use-download-proggress';

export const CellComponent = memo(({ cell }: { cell: Cell<IAttachFile, unknown> }) => {
  const { downloadProgresses } = useDownloadProgress();

  const currentProgress = useMemo(
    () => downloadProgresses.find(item => item.id === cell.row.original.fileData.id),
    [cell.row.original.fileData.id, downloadProgresses],
  );

  return (
    <td className={clsx(cell.column.id === 'type' && 'w-12')}>
      <div className="flex gap-2">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
        {cell.column.id === 'name' && (
          <div className="inline-flex gap-2 w-14">
            {currentProgress && (
              <>
                <motion.div
                  className="inline-flex w-3 h-3"
                  animate={{ rotate: 360 }}
                  transition={{ loop: Infinity, duration: 0.5 }}
                >
                  <Icon name="small-spinner" iconFill="secondaryDarkBlue910" size={24} />
                </motion.div>
                {currentProgress.progress}%
              </>
            )}
          </div>
        )}
      </div>
    </td>
  );
});
