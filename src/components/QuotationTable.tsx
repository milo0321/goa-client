import { useQuotationStore } from '../store/quotationStore';
import { GenericTable } from './GenericTable';

interface QuotationTableProps {
  data: Array<{
    id: string;
    productName: string;
    customerName: string;
    status: 'draft' | 'quoted' | 'ordered';
    inquiryDate: string;
    quantityTiers: Array<{ quantity: number }>; // 添加quantityTiers类型
  }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onQuote: (id: string) => void;
}

export function QuotationTable({
  data,
  onEdit,
  onDelete,
  onQuote
}: QuotationTableProps) {
  const { loading, initialized } = useQuotationStore();

  const headers = [
    { key: 'productName', label: 'Product', width: '40%', align: 'left' as const },
    { key: 'customerName', label: 'Customer', width: '10%', align: 'left' as const },
    { key: 'quantity', label: 'Quantity', width: '15%', align: 'left' as const },
    { key: 'inquiryDate', label: 'InquiryDate', width: '10%', align: 'left' as const },
    { key: 'status', label: 'Status', width: '10%', align: 'left' as const },
    { key: 'actions', label: 'Actions', width: '20%', align: 'center' as const },
  ];

  const statusVariant = {
    draft: 'bg-yellow-100 text-yellow-800',
    quoted: 'bg-blue-100 text-blue-800',
    ordered: 'bg-green-100 text-green-800',
  };

  // 新增quantity显示格式化方法
  const formatQuantities = (tiers: Array<{ quantity: number }>) => {
    const quantities = tiers
      .map(t => t.quantity)
      .filter(q => q > 0) // 过滤掉0值
      .sort((a, b) => a - b); // 从小到大排序

    return quantities.length > 0
      ? quantities.join(', ')
      : '-';
  };

  return (
    <GenericTable
      headers={headers}
      data={data}
      loading={loading && !initialized}
      emptyMessage="No quotations found"
      renderRow={(quotation) => (
        <tr key={quotation.id}>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm font-medium text-gray-900">{quotation.productName}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm text-gray-500">{quotation.customerName || '-'}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm text-gray-500">
              {formatQuantities(quotation.quantityTiers)}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariant[quotation.status]
                }`}
            >
              {quotation.status.toUpperCase()}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-left">
            <div className="text-sm text-gray-500">
              {new Date(quotation.inquiryDate).toLocaleDateString()}
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-center">
            {quotation.status === 'draft' && (
              <button
                onClick={() => onQuote(quotation.id)} // 添加报价回调
                className="mr-3 text-green-600 hover:text-green-900"
              >
                Quote
              </button>
            )}
            <button
              onClick={() => onEdit(quotation.id)}
              className="mr-3 text-blue-600 hover:text-blue-900"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(quotation.id)}
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