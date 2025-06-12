import { useEffect, useState } from 'react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { logger } from '@/utils/logger';
import Pagination from '@/components/Pagination';
import { useCustomerStore } from '../store/customer.store';
import { CustomerTable } from './CustomerTable';
import { CustomerCreateModal } from '../modals/CustomerCreateModal';
import CustomerEditModal from '../modals/CustomerEditModal';

export default function CustomerList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const { initialized, loading, items: customers, pagination, fetchItems, deleteItem } = useCustomerStore();

  // 首次加载处理
  useEffect(() => {
    if (!initialized && !loading) {
      fetchItems.catch((err) => {
        logger.error('Failed to load customers', err);
      });
    }
  }, [initialized, loading, fetchItems]);

  const handlePageChange = (page: number) => {
    fetchItems({ page, limit: pagination.limit }).catch((err) => {
      logger.error('Failed to change customers', err);
    });
  };

  const handleRefresh = () => {
    fetchItems({
      page: pagination.page,
      limit: pagination.limit,
      force: true,
    }).catch((err) => {
      logger.error('Failed to refresh customers', err);
    });
  };

  const handleDelete = (id: string) => {
    deleteItem(id).then(() => handleRefresh());
  };

  return (
    <div className="space-y-6">
      {/* 操作工具栏 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
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
            Add Customer
          </button>
        </div>
      </div>

      {/* 加载中状态显示 Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : (
        <>
          {/* 表格区域 */}
          <CustomerTable
            data={customers}
            onEdit={setEditingCustomerId}
            onDelete={handleDelete}
          />

          {/* 分页控制 */}
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
      <CustomerCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleRefresh}
      />

      {/* 编辑模态框 */}
      {editingCustomerId && (
        <CustomerEditModal
          customerId={editingCustomerId}
          onClose={() => setEditingCustomerId(null)}
          onSubmitSuccess={() => {
            setEditingCustomerId(null);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}