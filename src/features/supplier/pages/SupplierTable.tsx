import { useSupplierStore } from '../supplier.store';
import { GenericTable } from '../../../components/GenericTable';

interface SupplierTableProps {
  data: Array<{ id: string; name: string; email: string; phone: string }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SupplierTable({ data, onEdit, onDelete }: SupplierTableProps) {
  const { loading, initialized } = useSupplierStore();

  const headers = [
    { key: 'name', label: 'Name', width: '30%', align: 'left' as const },
    { key: 'email', label: 'Email', width: '30%', align: 'left' as const },
    { key: 'phone', label: 'Phone', width: '20%', align: 'left' as const },
    { key: 'actions', label: 'Actions', width: '20%', align: 'center' as const },
  ];

  return (
    <GenericTable
      headers={headers}
      data={data}
      loading={loading && !initialized}
      emptyMessage="No suppliers found"
      renderRow={(supplier) => (
        <tr key={supplier.id}>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm text-gray-500">{supplier.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm text-gray-500">{supplier.phone}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <button
              onClick={() => onEdit(supplier.id)}
              className="mr-3 text-blue-600 hover:text-blue-900"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(supplier.id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
      )}
    />
  );
}