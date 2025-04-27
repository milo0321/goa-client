import { useQuotationStore } from '../store/quotationStore';
import { GenericTable } from './GenericTable';

interface QuotationTableProps {
    data: Array<{
        id: string;
        productName: string;
        customerName: string;
        status: 'draft' | 'quoted' | 'ordered';
        createdAt: string;
    }>;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function QuotationTable({ data, onEdit, onDelete }: QuotationTableProps) {
    const { loading, initialized } = useQuotationStore();

    const headers = [
        { key: 'productName', label: 'Product', width: '25%', align: 'left' as const },
        { key: 'customerName', label: 'Customer', width: '20%', align: 'left' as const },
        { key: 'status', label: 'Status', width: '15%', align: 'left' as const },
        { key: 'createdAt', label: 'Created', width: '20%', align: 'left' as const },
        { key: 'actions', label: 'Actions', width: '20%', align: 'center' as const },
    ];

    const statusVariant = {
        draft: 'bg-yellow-100 text-yellow-800',
        quoted: 'bg-blue-100 text-blue-800',
        ordered: 'bg-green-100 text-green-800',
    };

    return (
        <GenericTable
            headers={headers}
            data={data}
            loading={loading && !initialized}
            emptyMessage="No quotations found"
            renderRow={(quotation) => (
                <tr key={quotation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{quotation.productName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{quotation.customerName || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusVariant[quotation.status]
                                }`}
                        >
                            {quotation.status.toUpperCase()}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                            {new Date(quotation.createdAt).toLocaleDateString()}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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