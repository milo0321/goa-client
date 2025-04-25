import { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface GenericTableProps<T> {
  headers: {
    key: string;
    label: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
  }[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

export function GenericTable<T>({
  headers,
  data,
  renderRow,
  loading = false,
  emptyMessage = 'No data available',
}: GenericTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-6 py-3 text-${header.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                style={{ width: header.width }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center">
                <LoadingSpinner />
              </td>
            </tr>
          ) : data.length === 0 && emptyMessage ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => renderRow(item))
          )}
        </tbody>
      </table>
    </div>
  );
}