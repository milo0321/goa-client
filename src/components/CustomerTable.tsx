import { useCustomerStore } from '../store/customerStore';
import { GenericTable } from './GenericTable';

interface CustomerTableProps {
  data: Array<{ id: string; name: string; email: string; phone: string }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CustomerTable({ data, onEdit, onDelete }: CustomerTableProps) {
  const { loading, initialized } = useCustomerStore();

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
      emptyMessage="No customers found"
      renderRow={(customer) => (
        <tr key={customer.id}>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{customer.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-500">{customer.phone}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <button
              onClick={() => onEdit(customer.id)}
              className="mr-3 text-blue-600 hover:text-blue-900"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(customer.id)}
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