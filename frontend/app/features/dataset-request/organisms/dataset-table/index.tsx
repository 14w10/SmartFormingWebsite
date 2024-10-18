import React from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import clsx from 'clsx';

import { CellComponent } from './cell';

export const DatasetTable = ({
  table,
  rowSelection,
}: {
  table: Table<IAttachFile>;
  rowSelection: any;
}) => {
  return (
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
            <tr
              key={row.id}
              className={clsx(
                rowSelection[row.id] && 'bg-primaryBlue940',
                'border-secondaryDarkBlue930 h-6 border-b',
              )}
            >
              {row.getVisibleCells().map(cell => {
                return <CellComponent key={cell.id} cell={cell} />;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
