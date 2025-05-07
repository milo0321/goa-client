import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';
import { useQuotationStore } from '../store/quotationStore';
import { GenericModal } from './GenericModal';
import { GenericForm } from './GenericForm';
import { notification } from 'antd';

interface QuotationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function QuotationCreateModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: QuotationCreateModalProps) {
  const { items: customers, loading: customerLoading, fetchItems: fetchCustomers } = useCustomerStore();
  const { createItem } = useQuotationStore();

  // 提交处理
  const handleSubmit = async (baseData: {
    customerId: string;
    article: string;
    client: string,
    size: string,
    material: string,
    color: string,
    branding: string,
    packing: string,
    quantity: string,
    certifications: string,
    details: string,
    inquiryDate: string;
    status: 'draft' | 'quoted' | 'ordered' | 'canceled';
  }) => {
    try {
      await createItem({
        ...baseData
      });
      onSubmitSuccess?.(); // 如果成功，调用成功回调
      onClose(); // 然后关闭模态框
    } catch (error) {
      console.error('Create quotation failed:', error);
      notification.error({
        message: 'Submission Failed',
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // 确保加载客户列表
  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers(); // 初始化加载客户
    }
  }, [customers, customerLoading, fetchCustomers]);

  // 基础表单字段
  const baseFields = [
    { name: 'customerId', label: 'Customer', type: 'select' as const, options: customers.map(c => ({ value: c.id, label: c.name })), required: true },
    { name: 'inquiryDate', label: 'Inquiry Date', type: 'date' as const, required: true },
    { name: 'article', label: 'Article', type: 'text' as const, required: true },
    { name: 'client', label: 'Client', type: 'text' as const, required: false },
    { name: 'size', label: 'Size', type: 'text' as const, required: false },
    { name: 'material', label: 'Material', type: 'text' as const, required: false },
    { name: 'color', label: 'Color', type: 'text' as const, required: false },
    { name: 'branding', label: 'Branding', type: 'text' as const, required: false },
    { name: 'packing', label: 'Packing', type: 'text' as const, required: false },
    { name: 'quantity', label: 'Quantity', type: 'text' as const, required: false },
    { name: 'certifications', label: 'Certifications', type: 'text' as const, required: false },
    { name: 'details', label: 'Details', type: 'textarea' as const }
  ];

  return (
    <GenericModal
      isOpen={isOpen}  // 使用传入的 isOpen 而不是直接传递 true
      title="Add Quotation"
      onClose={onClose}
    >
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        {/* 基础信息表单 */}
        <GenericForm
          fields={baseFields}
          onSubmit={handleSubmit}
          submitText="Update Quotation"
        >
        </GenericForm>
      </div>
    </GenericModal>
  );
}