import { useState, useEffect } from 'react';
import { IconRefresh, IconPlus } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { useQuotationStore } from '../store/quotationStore';
import { GenericTable } from '../components/GenericTable';
import Pagination from '../components/Pagination';
import { CreateQuotationModal } from '../components/CreateQuotationModal';
import { QuotationDetailModal } from '../components/QuotationDetailModal';
import { formatDate } from '../utils/date';

export default function QuotationList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const { initialized, loading, items: quotations, pagination, fetchItems, submitQuotation } = useQuotationStore();

  // Initial data fetch
  useEffect(() => {
    if (!initialized && !loading) {
      fetchItems();
    }
  }, [initialized, loading, fetchItems]);

  const handlePageChange = (page: number) => {
    fetchItems({ page, limit: pagination.limit });
  };

  const handleRefresh = () => {
    fetchItems({
      page: pagination.page,
      limit: pagination.limit,
      force: true,
    });
  };

  const handleSubmitPrice = async (id: string, price: number) => {
    await submitQuotation(id, price);
    handleRefresh();
  };

  const headers = [
    { key: 'customer', label: 'Customer', width: '20%', align: 'left' as const },
    { key: 'product', label: 'Product', width: '20%', align: 'left' as const },
    { key: 'quantity', label: 'Quantity', width: '15%', align: 'center' as const },
    { key: 'status', label: 'Status', width: '15%', align: 'center' as const },
    { key: 'quotedPrice', label: 'Quoted Price', width: '15%', align: 'right' as const },
    { key: 'quotedDate', label: 'Quoted Date', width: '15%', align: 'center' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quotation Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <IconRefresh className="mr-2 h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add Quotation
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : (
        <>
          {/* Quotation Table */}
          <GenericTable
            headers={headers}
            data={quotations}
            loading={loading && !initialized}
            emptyMessage="No quotations found"
            renderRow={(quotation) => (
              <tr
                key={quotation.id}
                onClick={() => setSelectedQuotationId(quotation.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{quotation.customer?.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{quotation.productName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">{quotation.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quotation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {quotation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-500">
                    {quotation.quotedPrice ? `$${quotation.quotedPrice}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-500">
                    {quotation.quotedDate ? formatDate(quotation.quotedDate) : '-'}
                  </div>
                </td>
              </tr>
            )}
          />

          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              currentPage={pagination.page}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Create Quotation Modal */}
      <CreateQuotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleRefresh}
      />

      {/* Quotation Detail Modal */}
      {selectedQuotationId && (
        <QuotationDetailModal
          quotationId={selectedQuotationId}
          onClose={() => setSelectedQuotationId(null)}
          onSubmit={handleSubmitPrice}
        />
      )}
    </div>
  );
}