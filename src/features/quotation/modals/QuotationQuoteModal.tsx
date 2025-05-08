import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { QuotePrice, AdditionalFee, PackingDetail, ProductionTimeValue } from '../types/quotation.types';
import { useCustomerStore } from '../../customer/store/customer.store';
import { useQuotationStore } from '../store/quotation.store';
import { GenericForm } from '../../../components/GenericForm';
import { GenericModal } from '../../../components/GenericModal';
import { QuotePrices } from '../components/QuotePrices';
import { AdditionalFees } from '../components/AdditionalFees';
import { PackingMethodInput } from '../components/PackingMethodInput';
import { ProductionTimeInput } from '../components/ProductionTimeInput';

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
  } = useQuotationStore();

  const {
    items: customers,
    fetchItems: fetchCustomers,
    loading: customerLoading
  } = useCustomerStore();

  const [quotePrices, setQuotePrices] = useState<QuotePrice[]>([]);
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [packingMethods, setPackingMethods] = useState<PackingDetail[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [sampleTime, setSampleTime] = useState<ProductionTimeValue>({
    type: 'range',
    from: 10,
    to: 15,
    unit: 'days',
  });

  const [massTime, setMassTime] = useState<ProductionTimeValue>({
    type: 'exact',
    from: 30,
    unit: 'days',
  });

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
      setQuotePrices(quotation.quotePrices || []);
      setAdditionalFees(quotation.additionalFees || []);
      setPackingMethods(quotation.packingMethods || []);
    }
  }, [quotationId, quotations, customers, customerLoading, fetchCustomers, setCurrentQuotation]);

  const handleSubmit = async (baseData: {
    productName: string;
    customerId: string;
    inquiryDate: string;
    sampleProductionTime?: string;
    massProductionTime?: string;
    notes?: string;
  }) => {
    try {
      await updateItem(quotationId, {
        ...baseData,
        status: 'quoted', // 强制标记为 quoted
        quantityTiers: quotePrices,
        additionalFees,
        packingMethods
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
      <div className="max-h-[160vh] overflow-y-auto space-y-6">
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
          <ProductionTimeInput
            label="Sample Production Time"
            value={sampleTime}
            onChange={setSampleTime}
          />

          <ProductionTimeInput
            label="Mass Production Time"
            value={massTime}
            onChange={setMassTime}
          />
          <QuotePrices
            quotePrices={quotePrices}
            setQuotePrices={setQuotePrices}
          />
          <AdditionalFees
            additionalFees={additionalFees}
            setAdditionalFees={setAdditionalFees}
          />
          <PackingMethodInput
            packingMethods={packingMethods}
            setPackingMethods={setPackingMethods}
          />
        </GenericForm>
      </div>
    </GenericModal>
  );
}