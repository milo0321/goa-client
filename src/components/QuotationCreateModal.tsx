import { useState, useEffect } from 'react';
import dayjs from 'dayjs'; // 需要安装dayjs
import { useCustomerStore } from '../store/customerStore';
import { useQuotationStore } from '../store/quotationStore';
import { GenericModal } from './GenericModal';
import { Button, Input, Select, Checkbox, DatePicker } from 'antd';
import { IconPlus, IconTrash, IconPlane, IconShip } from '@tabler/icons-react';

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
  const { createItem, loading: quotationLoading } = useQuotationStore();

  // 表单状态管理
  const [formData, setFormData] = useState({
    customerId: '',
    productName: '',
    quantityType: 'single' as 'single' | 'multiple',
    notes: '',
    inquiryDate: dayjs(), //默认当前日期
    status: 'quoted' as 'quoted' | 'draft' // 添加状态字段
  });

  const [quantityTiers, setQuantityTiers] = useState([
    { quantity: 0, airPrice: 0, shipPrice: 0 }
  ]);

  const [additionalFees, setAdditionalFees] = useState<
    Array<{ feeType: string; amount: number; refundable: boolean; conditions?: string }>
  >([]);

  // 处理基础字段变更
  const handleBaseChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 处理日期变更
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, inquiryDate: date }));
    }
  };

  // 提交处理
  const handleSubmit = async () => {
    try {
      await createItem({
        ...formData,
        quantityTiers: quantityTiers.map(tier => ({
          quantity: tier.quantity,
          prices: [
            { method: 'air', unitPrice: tier.airPrice },
            { method: 'ship', unitPrice: tier.shipPrice }
          ]
        })),
        additionalFees
      });

      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      console.error('Create quotation failed:', error);
    }
  };

  // 确保加载客户列表
  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers(); // 初始化加载客户
    }
  }, [customers, customerLoading, fetchCustomers]);

  return (
    <GenericModal
      isOpen={isOpen}
      title="Create New Quotation"
      onClose={onClose}
      isLoading={quotationLoading || customerLoading}
    >
      <div className="space-y-6">
        {/* 基础信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <Select
              className="w-full"
              options={customers.map(c => ({ value: c.id, label: c.name }))}
              onChange={v => handleBaseChange('customerId', v)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Input
              value={formData.productName}
              onChange={e => handleBaseChange('productName', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Inquiry Date</label>
            <DatePicker
              className="w-full"
              value={formData.inquiryDate}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />
          </div>
        </div>

        {/* 数量阶梯 */}
        <div className="border rounded p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium">Quantity Tiers</h3>
            <Select
              value={formData.quantityType}
              onChange={v => handleBaseChange('quantityType', v)}
              options={[
                { value: 'single', label: 'Single Quantity' },
                { value: 'multiple', label: 'Multiple Tiers' }
              ]}
            />
          </div>

          {quantityTiers.map((tier, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <Input
                  addonBefore="Qty"
                  type="number"
                  value={tier.quantity}
                  onChange={e => {
                    const newTiers = [...quantityTiers];
                    newTiers[index].quantity = Number(e.target.value);
                    setQuantityTiers(newTiers);
                  }}
                />
              </div>
              <div className="col-span-3">
                <Input
                  addonBefore={<IconPlane size={16} />}
                  type="number"
                  value={tier.airPrice}
                  onChange={e => {
                    const newTiers = [...quantityTiers];
                    newTiers[index].airPrice = Number(e.target.value);
                    setQuantityTiers(newTiers);
                  }}
                />
              </div>
              <div className="col-span-3">
                <Input
                  addonBefore={<IconShip size={16} />}
                  type="number"
                  value={tier.shipPrice}
                  onChange={e => {
                    const newTiers = [...quantityTiers];
                    newTiers[index].shipPrice = Number(e.target.value);
                    setQuantityTiers(newTiers);
                  }}
                />
              </div>
              <div className="col-span-3">
                <Button
                  danger
                  icon={<IconTrash size={16} />}
                  onClick={() => setQuantityTiers(quantityTiers.filter((_, i) => i !== index))}
                />
              </div>
            </div>
          ))}

          {formData.quantityType === 'multiple' && (
            <Button
              type="dashed"
              icon={<IconPlus size={16} />}
              onClick={() => setQuantityTiers([...quantityTiers, { quantity: 0, airPrice: 0, shipPrice: 0 }])}
            >
              Add Tier
            </Button>
          )}
        </div>

        {/* 附加费用 */}
        <div className="border rounded p-4">
          <h3 className="font-medium mb-4">Additional Fees</h3>

          {additionalFees.map((fee, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <Select
                  value={fee.feeType}
                  onChange={v => {
                    const newFees = [...additionalFees];
                    newFees[index].feeType = v;
                    setAdditionalFees(newFees);
                  }}
                  options={[
                    { value: 'sampling', label: 'Sampling Fee' },
                    { value: 'mold', label: 'Mold Fee' },
                    { value: 'certification', label: 'Certification' }
                  ]}
                />
              </div>

              <div className="col-span-3">
                <Input
                  type="number"
                  value={fee.amount}
                  onChange={e => {
                    const newFees = [...additionalFees];
                    newFees[index].amount = Number(e.target.value);
                    setAdditionalFees(newFees);
                  }}
                  prefix="$"
                />
              </div>

              <div className="col-span-3 flex items-center">
                <Checkbox
                  checked={fee.refundable}
                  onChange={e => {
                    const newFees = [...additionalFees];
                    newFees[index].refundable = e.target.checked;
                    setAdditionalFees(newFees);
                  }}
                >
                  Refundable
                </Checkbox>
              </div>

              <div className="col-span-3">
                <Button
                  danger
                  icon={<IconTrash size={16} />}
                  onClick={() => setAdditionalFees(additionalFees.filter((_, i) => i !== index))}
                />
              </div>
            </div>
          ))}

          <Button
            type="dashed"
            icon={<IconPlus size={16} />}
            onClick={() => setAdditionalFees([...additionalFees,
            { feeType: 'sampling', amount: 0, refundable: false }
            ])}
          >
            Add Fee
          </Button>
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Input.TextArea
            value={formData.notes}
            onChange={e => handleBaseChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={quotationLoading || customerLoading}
          >
            Create Quotation
          </Button>
        </div>
      </div>
    </GenericModal>
  );
}