import { GenericTable } from './GenericTable';
import { useCustomerStore } from '../store/customerStore';

interface CustomerTableProps {
  onEdit: (id: string) => void; // 明确要求传入onEdit
  // ...其他props...
}

export function CustomerTable({onEdit}: CustomerTableProps) {
  const { items: customers, loading, deleteItem: deleteCustomer, initialized } = useCustomerStore();

  const headers = [
    { key: 'name', label: 'Name', width: '30%', align: 'left' },
    { key: 'email', label: 'Email', width: '30%', align: 'left' },
    { key: 'phone', label: 'Phone', width: '20%', align: 'left' },
    { key: 'actions', label: 'Actions', width: '20%', align: 'center' },
  ];

  return (
    <GenericTable
      headers={headers}
      data={customers}
      loading={loading && !initialized} // 仅初始加载显示 spinner
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
              onClick={() => {
                console.log('Edit', customer.id);
                onEdit(customer.id);
              }}
              className="mr-3 text-blue-600 hover:text-blue-900"
            >
              Edit
            </button>
            <button
              onClick={() => deleteCustomer(customer.id)}
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