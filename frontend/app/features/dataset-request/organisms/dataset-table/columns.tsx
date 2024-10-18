import React from 'react';
import { ColumnDef } from '@tanstack/react-table';

import { IndeterminateCheckbox } from './indeterminate-checkbox';

export const columns: ColumnDef<IAttachFile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="px-1 text-left">
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-1 text-left">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: () => <div className="px-1 text-left">Name</div>,
    accessorFn: row => {
      return row.fileData?.metadata.filename || row.fileData?.metadata.name;
    },
    cell: info => <div className="px-1 text-left">{info.getValue() as any}</div>,
    footer: props => props.column.id,
  },
  {
    accessorKey: 'size',
    header: () => <div className="px-1 text-left">Size</div>,
    accessorFn: row =>
      ((row.fileData?.metadata.size || (row as any).size) / (1024 * 1024)).toFixed(2),
    cell: info => <div className="px-1 text-left">{info.getValue() as any} Mb</div>,
    footer: props => props.column.id,
  },
  {
    accessorKey: 'price',
    header: () => <div className="px-1 text-left">Price</div>,
    accessorFn: row => row.paid,
    cell: info => {
      const paid = info.getValue() as number;
      return <div className="px-1 text-left">{paid ? `Paid` : 'FREE'} </div>;
    },
    footer: props => props.column.id,
  },
  {
    accessorKey: 'type',
    header: () => <div className="px-1 w-10 text-left">Type</div>,
    accessorFn: row => {
      const fileNameSplitted = (
        row.fileData?.metadata.filename || row.fileData?.metadata?.name
      )?.split('.');
      return fileNameSplitted?.[fileNameSplitted.length - 1];
    },
    cell: info => <div className="px-1 text-left">{info.getValue() as any}</div>,
    footer: props => props.column.id,
  },
];
