import { useEffect, useState } from 'react';
import { useQuotationStore } from '../store/quotationStore';
import { GenericForm } from './GenericForm';
import { GenericModal } from './GenericModal';
import { Button, Input, Select, Checkbox, notification } from 'antd';
import { IconPlus, IconTrash, IconBox, IconPlane, IconShip } from '@tabler/icons-react';
import { QuantityTier, AdditionalFee } from '../types/quotation';

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

  // 本地状态管理复杂表单数据
  const [quantityTiers, setQuantityTiers] = useState<QuantityTier[]>([]);
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [loadingPrices, setLoadingPrices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      setCurrentQuotation(quotation);
      setQuantityTiers(quotation.quantityTiers || []);
      setAdditionalFees(quotation.additionalFees || []);
    }
  }, [quotationId, quotations, setCurrentQuotation]);

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
    notes?: string;
  }) => {
    try {
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
    { name: 'customerId', label: 'Customer', type: 'text' as const, required: true },
    { name: 'notes', label: 'Notes', type: 'textarea' as const }
  ];

  return (
    <GenericModal
      isOpen
      title="Edit Quotation"
      onClose={onClose}
      className="max-w-4xl" // 增加模态框宽度
    >
      <div className="max-h-[70vh] overflow-y-auto pr-4 -mr-4">
        <div className="space-y-6 pb-4">
          {/* 基础信息表单 */}
          <GenericForm
            initialData={currentQuotation}
            fields={baseFields}
            onSubmit={handleSubmit}
            submitText="Update Quotation"
          />

          {/* 数量阶梯编辑区 */}
          <div className="border rounded p-4">
            <h4 className="font-medium mb-4 flex items-center">
              <IconBox className="mr-2" />
              Quantity Tiers
            </h4>

            {quantityTiers.map((tier, index) =>
            (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4">
                <div className="col-span-2">
                  <Input
                    addonBefore="Qty"
                    value={tier.quantity}
                    onChange={e => {
                      const newTiers = [...quantityTiers];
                      newTiers[index].quantity = Number(e.target.value);
                      setQuantityTiers(newTiers);
                    }}
                    type="number"
                    min={1}
                    className="w-full"
                  />
                </div>

                {['air', 'ship'].map(method => {
                  const price = tier.prices?.find(p => p.method === method)?.unitPrice;
                  const loadingKey = `${index}-${method}`;

                  return (
                    <div key={method} className="col-span-4">
                      <Input
                        addonBefore={method === 'air' ?
                          <IconPlane size={16} /> :
                          <IconShip size={16} />}
                        value={price || ''}
                        onChange={e => {
                          const newTiers = [...quantityTiers];
                          const priceIndex = newTiers[index].prices?.findIndex(p => p.method === method) ?? -1;

                          if (priceIndex >= 0) {
                            newTiers[index].prices[priceIndex].unitPrice = Number(e.target.value);
                          } else {
                            newTiers[index].prices = [
                              ...(newTiers[index].prices || []),
                              {
                                method: method as 'air' | 'ship',
                                unitPrice: Number(e.target.value),
                                currency: 'USD'
                              }
                            ];
                          }
                          setQuantityTiers(newTiers);
                        }}
                        type="number"
                        step="0.001"
                        min={0}
                        suffix="USD"
                      />
                      <Button
                        size="small"
                        loading={loadingPrices[loadingKey]}
                        onClick={() => handlePriceCalculation(index, method as 'air' | 'ship')}
                        className="mt-1"
                      >
                        Calculate
                      </Button>
                    </div>
                  );
                })}

                <div className="col-span-1 flex items-center">
                  <Button
                    danger
                    icon={<IconTrash size={16} />}
                    onClick={() => {
                      const newTiers = [...quantityTiers];
                      newTiers.splice(index, 1);
                      setQuantityTiers(newTiers);
                    }}
                  />
                </div>
              </div>
            ))}

            <Button
              type="dashed"
              icon={<IconPlus size={16} />}
              onClick={() => setQuantityTiers([...quantityTiers, {
                quantity: 0,
                prices: [
                  { method: 'air', unitPrice: 0, currency: 'USD' },
                  { method: 'ship', unitPrice: 0, currency: 'USD' }
                ]
              }])}
              className="w-full"
            >
              Add Tier
            </Button>
          </div>

          {/* 附加费用编辑区 */}
          <div className="border rounded p-4">
            <h4 className="font-medium mb-4">Additional Fees</h4>

            {additionalFees.map((fee, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-start">
                <div className="col-span-3">
                  <Select
                    value={fee.feeType}
                    onChange={value => {
                      const newFees = [...additionalFees];
                      newFees[index].feeType = value;
                      setAdditionalFees(newFees);
                    }}
                    options={[
                      { value: 'sampling', label: 'Sampling Fee' },
                      { value: 'mold', label: 'Mold Fee' },
                      { value: 'certification', label: 'Certification' }
                    ]}
                    className="w-full"
                  />
                </div>

                <div className="col-span-3">
                  <Input
                    value={fee.amount}
                    onChange={e => {
                      const newFees = [...additionalFees];
                      newFees[index].amount = Number(e.target.value);
                      setAdditionalFees(newFees);
                    }}
                    type="number"
                    min={0}
                    prefix="$"
                    className="w-full"
                  />
                </div>

                <div className="col-span-4 flex items-center gap-2">
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

                {fee.refundable && (
                  <div className="col-span-3">
                    <Input
                      value={fee.conditions || ''}
                      onChange={e => {
                        const newFees = [...additionalFees];
                        newFees[index].conditions = e.target.value;
                        setAdditionalFees(newFees);
                      }}
                      placeholder="Refund conditions"
                      className="w-full"
                    />
                  </div>
                )}

                <div className="col-span-1">
                  <Button
                    danger
                    icon={<IconTrash size={16} />}
                    onClick={() => {
                      const newFees = [...additionalFees];
                      newFees.splice(index, 1);
                      setAdditionalFees(newFees);
                    }}
                  />
                </div>
              </div>
            ))}

            <Button
              type="dashed"
              icon={<IconPlus size={16} />}
              onClick={() => setAdditionalFees([
                ...additionalFees,
                {
                  feeType: 'sampling',
                  amount: 0,
                  refundable: false
                }
              ])}
              className="w-full"
            >
              Add Fee
            </Button>
          </div>
        </div>
      </div>
    </GenericModal >
  );
}