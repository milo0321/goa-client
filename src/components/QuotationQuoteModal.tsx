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
  const [customerName, setCustomerName] = useState<string>('');

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers();
    }

    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      if (quotation.customerId && customers.length > 0) {
        const customer = customers.find(c => c.id === quotation.customerId);
        if (customer) {
          setCustomerName(customer.name);
        }
      }
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

  const displayFields = [
    { label: 'Customer', value: customerName },
    { label: 'Inquiry Date', value: new Date(currentQuotation.inquiryDate).toLocaleDateString() },
    { label: 'Article', value: currentQuotation.article },
    { label: 'Client', value: currentQuotation.client },
    { label: 'Size', value: currentQuotation.size },
    { label: 'Material', value: currentQuotation.material },
    { label: 'Color', value: currentQuotation.color },
    { label: 'Branding', value: currentQuotation.branding },
    { label: 'Packing', value: currentQuotation.packing },
    { label: 'Quantity', value: currentQuotation.quantity },
    { label: 'Certifications', value: currentQuotation.certifications },
    { label: 'Details', value: currentQuotation.details },
  ];

  const baseFields = [
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
      <div className="text-sm text-gray-800 space-y-3">
        {displayFields
          .filter((field) => field.value !== undefined && field.value !== null && field.value !== '')
          .map((field) => (
            <div key={field.label} className="flex">
              <div className="w-40 font-semibold">{field.label}:</div>
              <div className="flex-1 whitespace-pre-line">{field.value}</div>
            </div>
          ))}
      </div>
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