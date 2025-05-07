import { useEffect, useState } from 'react';
import { useCustomerStore } from '../store/customerStore';
import { useQuotationStore } from '../store/quotationStore';
import { GenericForm } from './GenericForm';
import { GenericModal } from './GenericModal';
import { notification } from 'antd';
import { QuantityTier, AdditionalFee } from '../types/quotation';
import { QuantityTiers } from './QuantityTier';
import { AdditionalFees } from './AdditionalFees';

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
    updateItem,
    calculatePrice
  } = useQuotationStore();

  const { items: customers, fetchItems: fetchCustomers, loading: customerLoading } = useCustomerStore(); // 加载客户数据

  // 本地状态管理复杂表单数据
  const [quantityTiers, setQuantityTiers] = useState<QuantityTier[]>([]);
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [loadingPrices, setLoadingPrices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers(); // 加载客户列表
    }

    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      setCurrentQuotation(quotation);
      setQuantityTiers(quotation.quantityTiers || []);
      setAdditionalFees(quotation.additionalFees || []);
    }
  }, [quotationId, quotations, customers, customerLoading, fetchCustomers, setCurrentQuotation]);

  const handlePriceCalculation = async (tierIndex: number, method: 'air' | 'ship') => {
    const tier = quantityTiers[tierIndex];
    if (!tier?.quantity) return;

    setLoadingPrices(prev => ({ ...prev, [`${tierIndex}-${method}`]: true }));

    try {
      const price = await calculatePrice({
        quantity: tier.quantity,
        shippingMethod: method
      });

      const updatedTiers = [...quantityTiers];
      const priceIndex = updatedTiers[tierIndex].prices.findIndex(p => p.method === method);

      if (priceIndex >= 0) {
        updatedTiers[tierIndex].prices[priceIndex].unitPrice = price;
      } else {
        updatedTiers[tierIndex].prices.push({
          method,
          unitPrice: price,
          currency: 'USD'
        });
      }

      setQuantityTiers(updatedTiers);
    } catch (err) {
      notification.error({
        message: 'Price calculation failed',
        description: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setLoadingPrices(prev => ({ ...prev, [`${tierIndex}-${method}`]: false }));
    }
  };

  const handleSubmit = async (baseData: {
    productName: string;
    customerId: string;
    inquiryDate: string;
    status: 'draft' | 'quoted' | 'ordered' | 'canceled';
    notes?: string;
  }) => {
    try {
      console.log('Submitting form data:', baseData);
      console.log('Quantity Tiers:', quantityTiers);
      console.log('Additional Fees:', additionalFees);

      await updateItem(quotationId, {
        ...baseData,
        quantityTiers,
        additionalFees
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
    { name: 'productName', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'customerId', label: 'Customer', type: 'select' as const, options: customers.map(c => ({ value: c.id, label: c.name })), required: true },
    { name: 'inquiryDate', label: 'Inquiry Date', type: 'date' as const, required: true },
    { name: 'notes', label: 'Notes', type: 'textarea' as const }
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
          {/* 渲染数量阶梯和附加费用部分 */}
          <QuantityTiers
            quantityTiers={quantityTiers}
            setQuantityTiers={setQuantityTiers}
            loadingPrices={loadingPrices}
            handlePriceCalculation={handlePriceCalculation}
          />
          <AdditionalFees
            additionalFees={additionalFees}
            setAdditionalFees={setAdditionalFees}
          />
        </GenericForm>
      </div>
    </GenericModal>
  );
}