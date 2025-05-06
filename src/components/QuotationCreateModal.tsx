import { useState, useEffect } from 'react';
import dayjs from 'dayjs'; // 需要安装dayjs
import { useCustomerStore } from '../store/customerStore';
import { useQuotationStore } from '../store/quotationStore';
import { GenericModal } from './GenericModal';
import { GenericForm } from './GenericForm';
import { notification } from 'antd';
import { ShippingPrice } from '../types/quotation';
import { QuantityTiers } from './QuantityTier';

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
  const { createItem, calculatePrice } = useQuotationStore();
  const [loadingPrices, setLoadingPrices] = useState<Record<string, boolean>>({});

  // 表单状态管理
  const [formData] = useState({
    customerId: '',
    productName: '',
    quantityType: 'single' as 'single' | 'multiple',
    notes: '',
    inquiryDate: dayjs(), //默认当前日期
    status: 'quoted' as 'quoted' | 'draft' // 添加状态字段
  });

  const [quantityTiers, setQuantityTiers] = useState<{
    quantity: number;
    prices: ShippingPrice[];
  }[]>([
    { quantity: 0, prices: [{ method: 'air', unitPrice: 0, currency: 'USD' }] },  // 初始值
  ]);

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

  // 提交处理
  const handleSubmit = async () => {
    try {
      await createItem({
        ...formData,
        quantityTiers
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
    { name: 'productName', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'customerId', label: 'Customer', type: 'select' as const, options: customers.map(c => ({ value: c.id, label: c.name })), required: true },
    {
      name: 'inquiryDate',
      label: 'Inquiry Date',
      type: 'date' as const,  // 渲染日期选择器
      required: true
    },
    { name: 'notes', label: 'Notes', type: 'textarea' as const }
  ];

  return (
    <GenericModal
      isOpen={isOpen}  // 使用传入的 isOpen 而不是直接传递 true
      title="Edit Quotation"
      onClose={onClose}
    >
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        {/* 基础信息表单 */}
        <GenericForm
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
        </GenericForm>
      </div>
    </GenericModal>
  );
}