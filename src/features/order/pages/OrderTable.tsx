import React from 'react';
import { GenericTable } from '@/components/GenericTable';
import { ActionButton } from '@/components/ActionButton';
import { Order } from '../order.types';
import { useOrderStore } from '../order.store';

interface OrderTableProps {
  data: Order[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function OrderTable({ data, onEdit, onDelete, onView }: OrderTableProps) {
  const {
    loading,
    initialized,
  } = useOrderStore(); // 确保已经导入 useOrderStore

  const headers = [
    { key: 'orderArticle', label: 'Article', width: '30%', align: 'left' as const },
    { key: 'customerName', label: 'Customer', width: '15%', align: 'left' as const },
    { key: 'orderDate', label: 'Order Date', width: '15%', align: 'left' as const },
    { key: 'deliveryTime', label: 'Delivery Time', width: '15%', align: 'left' as const },
    { key: 'status', label: 'Status', width: '10%', align: 'left' as const },
    { key: 'actions', label: 'Actions', width: '15%', align: 'center' as const },
  ];

  const statusVariant: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-blue-100 text-blue-800',
    ordered: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };

  return (
    <GenericTable headers={headers} data={data} loading={loading && !initialized} emptyMessage="No orders found"
                  renderRow={(order) => (
                    <tr key={order.id} onClick={() => onView(order.id)}
                        className="cursor-pointer hover:bg-gray-50 border-b" title="Click to view order details">
                      <td className="px-6 py-4 text-left">{order.orderArticle}</td>
                      <td className="px-6 py-4 text-left hidden sm:table-cell">{order.customerName}</td>
                      <td className="px-6 py-4 text-left">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-left">{new Date(order.deliveryTime).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-left">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariant[order.status || 'draft']}`}>
            {order.status?.toUpperCase() || 'DRAFT'}
          </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <ActionButton onClick={(e) => {
                            e.stopPropagation();
                            onEdit(order.id);
                          }} variant="info" title="Edit">Edit</ActionButton>
                          <ActionButton onClick={(e) => {
                            e.stopPropagation();
                            onDelete(order.id);
                          }} variant="danger" title="Delete">Delete</ActionButton>
                        </div>
                      </td>
                    </tr>
                  )} />
  );
}
