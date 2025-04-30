import { useEffect, useState } from 'react';
import { useCustomerStore } from '../store/customerStore';
import { useQuotationStore } from '../store/quotationStore';
import { GenericForm } from './GenericForm';
import { GenericModal } from './GenericModal';
import { notification } from 'antd';
import { QuantityTier, AdditionalFee } from '../types/quotation';
import { QuantityTiers } from './QuantityTier';
import { AdditionalFees } from './AdditionalFees';

interface QuotationQuoteModalProps {
  quotationId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function QuotationQuoteModal({
  quotationId,
  onClose,
  onSubmitSuccess,
}: QuotationQuoteModalProps) {
  const {
    currentItem: currentQuotation,
    items: quotations,
    setCurrentItem: setCurrentQuotation,
    updateItem,
    calculatePrice
  } = useQuotationStore();

  const {
    items: customers,
    fetchItems: fetchCustomers,
    loading: customerLoading
  } = useCustomerStore();

  const [quantityTiers, setQuantityTiers] = useState<QuantityTier[]>([]);
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [loadingPrices, setLoadingPrices] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers();
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
    sampleProductionTime?: string;
    massProductionTime?: string;
    packingMethod?: string;
    notes?: string;
  }) => {
    try {
      await updateItem(quotationId, {
        ...baseData,
        status: 'quoted', // 强制标记为 quoted
        quantityTiers,
        additionalFees
      });
      notification.success({ message: 'Quotation submitted successfully!' });
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      notification.error({
        message: 'Submit failed',
        description: err instanceof Error ? err.message : String(err)
      });
    }
  };

  if (!currentQuotation || currentQuotation.id !== quotationId) {
    return <GenericModal isOpen title="Quote Quotation" onClose={onClose} isLoading />;
  }

  const baseFields = [
    { name: 'productName', label: 'Product Name', type: 'text' as const, required: true },
    { name: 'customerId', label: 'Customer', type: 'select' as const, options: customers.map(c => ({ value: c.id, label: c.name })), required: true },
    { name: 'inquiryDate', label: 'Inquiry Date', type: 'date' as const, required: true },
    { name: 'sampleProductionTime', label: 'Sample Production Time', type: 'text' as const, placeholder: 'e.g. 3-5 days' },
    { name: 'massProductionTime', label: 'Mass Production Time', type: 'text' as const, placeholder: 'e.g. 10-15 days' },
    { name: 'packingMethod', label: 'Packing Method', type: 'textarea' as const, placeholder: 'Detailed packing instructions...' },
    {
      name: 'notes', label: 'Notes', type: 'textarea' as const, attrs: {
        rows: 10, // 控制初始高度
        style: { resize: 'vertical', minHeight: '80px', overflow: 'hidden' },
        onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }
      }
    }
  ];

  return (
    <GenericModal isOpen title="Quote Quotation" onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        <GenericForm
          initialData={currentQuotation}
          fields={baseFields}
          onSubmit={handleSubmit}
          submitText="Submit Quotation"
        >
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