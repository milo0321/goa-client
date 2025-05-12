import { useEffect } from 'react';
import { notification } from 'antd';
import { useCustomerStore } from '../../customer/store/customer.store';
import { useQuotationStore } from '../store/quotation.store';
import { GenericForm } from '../../../components/GenericForm';
import { GenericModal } from '../../../components/GenericModal';

interface QuotationEditModalProps {
  quotationId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function QuotationEditModal({
  quotationId,
  onClose,
  onSubmitSuccess,
}: QuotationEditModalProps) {
  const {
    currentItem: currentQuotation,
    items: quotations,
    setCurrentItem: setCurrentQuotation,
    updateItem
  } = useQuotationStore();

  const { items: customers, fetchItems: fetchCustomers, loading: customerLoading } = useCustomerStore(); // 加载客户数据

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers(); // 加载客户列表
    }

    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      setCurrentQuotation(quotation);
    }
  }, [quotationId, quotations, customers, customerLoading, fetchCustomers, setCurrentQuotation]);

  const handleSubmit = async (baseData: {
    article: string;
    customerId: string;
    inquiryDate: string;
    status: 'draft' | 'quoted' | 'ordered' | 'canceled';
    notes?: string;
  }) => {
    try {
      console.log('Submitting form data:', baseData);
      const merged = { ...currentQuotation }; // 克隆 currentQuotation 为主
      Object.entries(baseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          (merged as any)[key] = value;
        }
      });

      await updateItem(quotationId, {
        ...merged
      });
      notification.success({ message: 'Quotation updated!' });
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      notification.error({
        message: 'Update failed',
        description: err instanceof Error ? err.message : String(err)
      });
    }
  };

  if (!currentQuotation || currentQuotation.id !== quotationId) {
    return <GenericModal isOpen title="Edit Quotation" onClose={onClose} isLoading />;
  }

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
      isOpen
      title="Edit Quotation"
      onClose={onClose}
    >
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        {/* 基础信息表单 */}
        <GenericForm
          initialData={currentQuotation}
          fields={baseFields}
          onSubmit={handleSubmit}
          submitText="Update Quotation"
        >
        </GenericForm>
      </div>
    </GenericModal>
  );
}