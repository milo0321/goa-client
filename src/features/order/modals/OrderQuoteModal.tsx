import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { AdditionalFee, PackingDetail, ProductionTime, QuotePrice } from '../order.types';
import { useCustomerStore } from '../../customer/store/customer.store';
import { useOrderStore } from '../order.store';
import { GenericForm } from '@/components/GenericForm';
import { GenericModal } from '@/components/GenericModal';
import { QuotePrices } from '../components/QuotePrices';
import { AdditionalFees } from '../components/AdditionalFees';
import { PackingMethodInput } from '../components/PackingMethodInput';
import { ProductionTimeInput } from '../components/ProductionTimeInput';
import { logger } from '@/utils/logger'; // ✅ Make sure you have a logger utility

interface OrderQuoteModalProps {
  orderId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function OrderQuoteModal({
                                          orderId,
                                          onClose,
                                          onSubmitSuccess,
                                        }: OrderQuoteModalProps) {
  const {
    currentItem: currentOrder,
    items: orders,
    setCurrentItem: setCurrentOrder,
    updateItem,
  } = useOrderStore();

  const {
    items: customers,
    fetchItems: fetchCustomers,
    loading: customerLoading,
  } = useCustomerStore();

  const [quotePrices, setQuotePrices] = useState<QuotePrice[]>([]);
  const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);
  const [packingDetails, setPackingDetails] = useState<PackingDetail[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [sampleTime, setSampleTime] = useState<ProductionTime>({
    timeType: 'range',
    fromTime: 10,
    toTime: 15,
    unit: 'days',
  });

  const [massTime, setMassTime] = useState<ProductionTime>({
    timeType: 'exact',
    fromTime: 30,
    unit: 'days',
  });

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers().catch((err) => {
        logger.error('Failed to fetch customers:', err);
      });
    }

    const order = orders.find((q) => q.id === orderId);
    if (order) {
      if (order.customerId && customers.length > 0) {
        const customer = customers.find((c) => c.id === order.customerId);
        if (customer) {
          setCustomerName(customer.name);
        }
      }
      setCurrentOrder(order);
    }
  }, [
    orderId,
    orders,
    customers,
    customerLoading,
    fetchCustomers,
    setCurrentOrder,
  ]);

  const handleSubmit = async (baseData: {
    customerId: string;
    inquiryDate: string;
    sampleTime?: string;
    massTime?: string;
    notes?: string;
  }) => {
    try {
      const merged = { ...currentOrder };
      Object.entries(baseData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          (merged as any)[key] = value;
        }
      });

      await updateItem(orderId, {
        ...merged,
        status: 'quoted',
        quotePrices,
        additionalFees,
        packingDetails,
        sampleTime,
        massTime,
      });

      notification.success({ message: 'Order submitted successfully!' });
      onSubmitSuccess?.();
      onClose();
    } catch (err) {
      notification.error({
        message: 'Submit failed',
        description: err instanceof Error ? err.message : String(err),
      });
    }
  };

  if (!currentOrder || currentOrder.id !== orderId) {
    return (
      <GenericModal isOpen title="Quote Order" onClose={onClose} isLoading />
    );
  }

  const displayFields = [
    { label: 'Customer', value: customerName },
    {
      label: 'Inquiry Date',
      value: new Date(currentOrder.inquiryDate).toLocaleDateString(),
    },
    { label: 'Article', value: currentOrder.article },
    { label: 'Client', value: currentOrder.client },
    { label: 'Size', value: currentOrder.size },
    { label: 'Material', value: currentOrder.material },
    { label: 'Color', value: currentOrder.color },
    { label: 'Branding', value: currentOrder.branding },
    { label: 'Packing', value: currentOrder.packing },
    { label: 'Quantity', value: currentOrder.quantity },
    { label: 'Certifications', value: currentOrder.certifications },
    { label: 'Details', value: currentOrder.details },
  ];

  const baseFields = [
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea' as const,
      attrs: {
        rows: 10,
        style: {
          resize: 'vertical',
          minHeight: '80px',
          overflow: 'hidden',
        },
        onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        },
      },
    },
  ];

  return (
    <GenericModal isOpen title="Quote Order" onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        <div className="text-sm text-gray-800 space-y-3">
          {displayFields
            .filter(
              (field) =>
                field.value !== undefined &&
                field.value !== null &&
                field.value !== '',
            )
            .map((field) => (
              <div key={field.label} className="flex">
                <div className="w-40 font-semibold">{field.label}:</div>
                <div className="flex-1 whitespace-pre-line">{field.value}</div>
              </div>
            ))}
        </div>

        <GenericForm
          initialData={currentOrder}
          fields={baseFields}
          onSubmit={handleSubmit}
          submitText="Submit Order"
        >
          <ProductionTimeInput
            label="Sample Time"
            value={sampleTime}
            onChange={setSampleTime}
          />
          <ProductionTimeInput
            label="Mass Time"
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
            packingMethods={packingDetails}
            setPackingMethods={setPackingDetails}
          />
        </GenericForm>
      </div>
    </GenericModal>
  );
}
