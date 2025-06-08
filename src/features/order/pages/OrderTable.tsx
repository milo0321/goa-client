import { useOrderStore } from '../order.store';
import { GenericTable } from '../../../components/GenericTable';
import { ActionButton } from '../../../components/ActionButton';
import { Order } from '../order.types';

interface OrderTableProps {
  data: Array<Order>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onQuote: (id: string) => void;
  onView: (id: string) => void; // 添加查看报价的回调
}

export function OrderTable({
  data,
  onEdit,
  onDelete,
  onQuote,
  onView,
}: OrderTableProps) {
  const { loading, initialized } = useOrderStore();

  const headers = [
    { key: 'article', label: 'Article', width: '40%', align: 'left' as const },
    {
      key: 'customerName',
      label: 'Customer',
      width: '10%',
      align: 'left' as const,
    },
    {
      key: 'quantity',
      label: 'Quantity',
      width: '15%',
      align: 'left' as const,
    },
    {
      key: 'inquiryDate',
      label: 'InquiryDate',
      width: '10%',
      align: 'left' as const,
    },
    { key: 'status', label: 'Status', width: '10%', align: 'left' as const },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      align: 'center' as const,
    },
  ];

  const statusVariant = {
    draft: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-blue-100 text-blue-800',
    ordered: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };

  // // 新增quantity显示格式化方法
  // const formatQuantities = (tiers: Array<{ quantity: number }>) => {
  //   const quantities = tiers
  //     .map(t => t.quantity)
  //     .filter(q => q > 0) // 过滤掉0值
  //     .sort((a, b) => a - b); // 从小到大排序

  //   return quantities.length > 0
  //     ? quantities.join(', ')
  //     : '-';
  // };

  return (
    <GenericTable
      headers={headers}
      data={data}
      loading={loading && !initialized}
      emptyMessage="No orders found"
      renderRow={(order) => (
        <tr
          key={order.id}
          onClick={() => onView(order.id)}
          className="cursor-pointer hover:bg-gray-50 transition border-b"
          title="Click to view order details"
        >
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm font-medium text-gray-900">
              {order.article}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left hidden sm:table-cell">
            <div className="text-sm text-gray-500">
              {order.customer?.name || '-'}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left hidden sm:table-cell">
            <div className="text-sm text-gray-500">{order.quantity || '-'}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusVariant[order.status]
              }`}
            >
              {order.status.toUpperCase()}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left hidden sm:table-cell">
            <div className="text-sm text-gray-500">
              {new Date(order.inquiryDate).toLocaleDateString()}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            <div className="flex justify-center items-center space-x-2">
              {order.status === 'draft' && (
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuote(order.id);
                  }}
                  variant="success"
                  title="Quote"
                >
                  Quote
                </ActionButton>
              )}
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(order.id);
                }}
                variant="info"
                title="Edit"
              >
                Edit
              </ActionButton>
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(order.id);
                }}
                variant="danger"
                title="Delete"
              >
                Delete
              </ActionButton>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
