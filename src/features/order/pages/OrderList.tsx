import React, { useEffect, useState } from 'react';
import { IconPlus, IconRefresh } from '@tabler/icons-react';
import { Loader2 } from 'lucide-react';
import { useOrderStore } from '../order.store';
import { OrderTable } from './OrderTable';
import Pagination from '@/components/Pagination';
import OrderCreateModal from '../modals/OrderCreateModal';
import OrderEditModal from '../modals/OrderEditModal';
import OrderDetailModal from '../modals/OrderDetailModal';
import { logger } from '@/utils/logger';

export default function OrderList() {
  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);
  const [
    editingOrderId,
    setEditingOrderId,
  ] = useState<string | null>(null);
  const [
    viewOrderId,
    setViewOrderId,
  ] = useState<string | null>(null);

  const {
    initialized,
    loading,
    items: orders,
    pagination,
    fetchItems,
    deleteItem,
  } = useOrderStore();

  useEffect(() => {
    if (!initialized && !loading) {
      logger.info('fetchItems');
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
    fetchItems({ page: pagination.page, limit: pagination.limit, force: true }).catch((err) => {
      logger.error('Failed to refresh data:', err);
    });
  };

  const handleDelete = (id: string) => {
    deleteItem(id).then(handleRefresh);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <div className="flex space-x-3">
          <button onClick={handleRefresh}
                  className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium hover:bg-gray-50">
            <IconRefresh className="mr-2 h-4 w-4" /> Refresh
          </button>
          <button onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
            <IconPlus className="mr-2 h-4 w-4" /> Add Order
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="ml-2 text-gray-500">Loading...</span>
        </div>
      ) : (
        <>
          <OrderTable data={orders} onEdit={setEditingOrderId} onDelete={handleDelete} onView={setViewOrderId} />

          <div className="flex justify-center">
            <Pagination currentPage={pagination.page} totalItems={pagination.total} itemsPerPage={pagination.limit}
                        onPageChange={handlePageChange} />
          </div>
        </>
      )}

      <OrderCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}
                        onSubmitSuccess={handleRefresh} />

      {editingOrderId && (
        <OrderEditModal orderId={editingOrderId} onClose={() => setEditingOrderId(null)} onSubmitSuccess={() => {
          setEditingOrderId(null);
          handleRefresh();
        }} />
      )}

      {viewOrderId && (
        <OrderDetailModal orderId={viewOrderId} onClose={() => setViewOrderId(null)} />
      )}
    </div>
  );
}
