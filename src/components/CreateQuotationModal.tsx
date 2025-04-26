import { useCustomerStore } from '../store/customerStore';
import { useQuotationStore } from '../store/quotationStore';
import { GenericModal } from './GenericModal';
import { GenericForm } from './GenericForm';

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

interface QuotationFormData {
  customerId: string;
  productName: string;
  quantity: number;
  notes: string;
}

export function CreateQuotationModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateQuotationModalProps) {
  const { items: customers } = useCustomerStore();
  const { createItem, loading } = useQuotationStore();

  const fields = [
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select' as const,
      options: customers.map((customer) => ({
        value: customer.id,
        label: customer.name,
      })),
      required: true,
    },
    {
      name: 'productName',
      label: 'Product Name',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number' as const,
      min: 1,
      required: true,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea' as const,
    },
  ];

  const handleSubmit = async (data: QuotationFormData) => {
    await createItem(data);
    onSubmitSuccess?.();
    onClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      title="Create New Quotation"
      onClose={onClose}
      isLoading={loading}
    >
      <GenericForm
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Create Quotation"
        loading={loading}
      />
    </GenericModal>
  );
}