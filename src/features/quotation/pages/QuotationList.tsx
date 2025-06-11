import { useEffect, useState } from 'react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { useQuotationStore } from '../store/quotation.store';
import { QuotationTable } from './QuotationTable';
import Pagination from '../../../components/Pagination';
import QuotationCreateModal from '../modals/QuotationCreateModal';
import QuotationEditModal from '../modals/QuotationEditModal';
import QuotationQuoteModal from '../modals/QuotationQuoteModal';
import QuotationDetailModal from '../modals/QuotationDetailModal';
import { logger } from '@/utils/logger';

export default function QuotationList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingQuotationId, setEditingQuotationId] = useState<string | null>(null);
  const [quoteQuotationId, setQuoteQuotationId] = useState<string | null>(null);
  const [viewQuotationId, setViewQuotationId] = useState<string | null>(null);
  const { initialized, loading, items: quotations, pagination, fetchItems, deleteItem } = useQuotationStore();

  // 首次加载处理
  useEffect(() => {
    if (!initialized && !loading) {
      fetchItems().catch((err) => {
        logger.error('Failed to fetch items:', err);
      });
    }
  }, [initialized, loading, fetchItems]);

  const handlePageChange = (page: number) => {
    fetchItems({ page, limit: pagination.limit }).catch((err) => {
      logger.error('Failed to change page:', err);
    });
  };

  const handleRefresh = () => {
    fetchItems({
      page: pagination.page,
      limit: pagination.limit,
      force: true,
    }).catch((err) => {
      logger.error('Failed to refresh data:', err);
    });
  };

  const handleDelete = (id: string) => {
    deleteItem(id).then(() => handleRefresh());
  };

  return (
    <div className="space-y-6">
      {/* 操作工具栏 - 与Customer完全相同的样式 */}
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

      {/* 加载状态 - 与Customer相同 */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : (
        <>
          {/* 表格区域 */}
          <QuotationTable
            data={quotations}
            onQuote={setQuoteQuotationId}
            onEdit={setEditingQuotationId}
            onDelete={handleDelete}
            onView={setViewQuotationId}
          />

          {/* 分页控制 - 复用相同组件 */}
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

      {/* 创建模态框 */}
      <QuotationCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleRefresh}
      />

      {/* 编辑模态框 */}
      {editingQuotationId && (
        <QuotationEditModal
          quotationId={editingQuotationId}
          onClose={() => setEditingQuotationId(null)}
          onSubmitSuccess={() => {
            setEditingQuotationId(null);
            handleRefresh();
          }}
        />
      )}

      {/* 询价模态框 */}
      {quoteQuotationId && (
        <QuotationQuoteModal
          quotationId={quoteQuotationId}
          onClose={() => setQuoteQuotationId(null)}
          onSubmitSuccess={() => {
            setQuoteQuotationId(null);
            handleRefresh();
          }}
        />
      )}

      {/* 询价模态框 */}
      {viewQuotationId && (
        <QuotationDetailModal
          quotationId={viewQuotationId}
          onClose={() => setViewQuotationId(null)}
        />
      )}
    </div>
  );
}