import { useState, useEffect } from 'react';
import { IconRefresh, IconPlus } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { useSupplierStore } from '../supplier.store';
import { SupplierTable } from './SupplierTable';
import Pagination from '../../../components/Pagination';
import { SupplierCreateModal } from '../modals/SupplierCreateModal';
import SupplierEditModal from '../modals/SupplierEditModal';

export default function SupplierList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const { initialized, loading, items: suppliers, pagination, fetchItems, deleteItem } = useSupplierStore();

  // 首次加载处理
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

  const handleDelete = (id: string) => {
    deleteItem(id).then(() => handleRefresh());
  };

  return (
    <div className="space-y-6">
      {/* 操作工具栏 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
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
            Add Supplier
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
          <SupplierTable
            data={suppliers}
            onEdit={setEditingSupplierId}
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
      <SupplierCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleRefresh}
      />

      {/* 编辑模态框 */}
      {editingSupplierId && (
        <SupplierEditModal
          supplierId={editingSupplierId}
          onClose={() => setEditingSupplierId(null)}
          onSubmitSuccess={() => {
            setEditingSupplierId(null);
            handleRefresh();
          }}
        />
      )}
    </div>
  );
}