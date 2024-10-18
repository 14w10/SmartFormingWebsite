import { useCallback, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';

import { Button, Icon } from '@smar/ui';

import { columns } from 'features/dataset-request/organisms/dataset-table/columns';

import { TableRow } from './table-row';

export const UploadedFilesTable = ({
  files,
  removeFiles,
  handleAddUploadedFile,
  handleSetPrice,
}: {
  removeFiles: (files: any) => void;
  files: any[];
  handleAddUploadedFile: (data: any, index: number) => void;
  handleSetPrice: (selectedRows: Row<DatasetAttachment>[], paid: boolean) => void;
}) => {
  const [rowSelection, setRowSelection] = useState<any>({});
  const selectionCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const table = useReactTable({
    data: files || [],
    columns: columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selectedRows = useMemo(() => table.getSelectedRowModel().rows, [table, rowSelection]);

  const handleDeleteSelected = useCallback(() => {
    removeFiles(selectedRows.map(item => ({ id: item.original?.id, index: item.index })));
  }, [removeFiles, selectedRows]);

  const isPaid = useMemo(() => {
    if (selectedRows.length === 0) return true;
    const countPaid = selectedRows.filter(item => item.original.paid).length;
    const paid = countPaid < selectedRows.length;
    return paid;
  }, [selectedRows]);

  const setSelectedPrice = useCallback(() => {
    handleSetPrice(selectedRows, isPaid);
    setRowSelection({});
  }, [handleSetPrice, isPaid, selectedRows]);

  return (
    <>
      <table className="v-text130 text-secondaryDarkBlue900 w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-secondaryDarkBlue930 h-6 border-b">
              {headerGroup.headers.map(header => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(header.column.id === 'select' && 'w-6')}
                  >
                    {header.isPlaceholder ? null : (
                      <>{flexRender(header.column.columnDef.header, header.getContext())}</>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <TableRow
                key={row.id}
                row={row}
                handleAddUploadedFile={handleAddUploadedFile}
                isSelected={!!rowSelection[row.id]}
              />
            );
          })}
        </tbody>
      </table>
      <div className="flex gap-1 mt-4">
        {/* disable temp */}
        {/* <SetPriceModal
          handleSetPriceSelected={handleSetPrice}
          selectionCount={selectionCount}
          selectedRows={selectedRows}
        /> */}
        <Button onClick={setSelectedPrice} disabled={selectionCount === 0}>
          <Icon name="download" size={24} /> Define as {isPaid ? 'paid' : 'free'} ({selectionCount})
        </Button>
        <Button variant="solidRed" onClick={handleDeleteSelected} disabled={selectionCount === 0}>
          <Icon name="download" size={24} /> Delete
        </Button>
      </div>
    </>
  );
};
