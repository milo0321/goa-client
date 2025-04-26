import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';
import { GenericModal } from './GenericModal';
import { GenericForm } from './GenericForm';

interface EditCustomerModalProps {
  customerId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function EditCustomerModal({
  customerId,
  onClose,
  onSubmitSuccess,
}: EditCustomerModalProps) {
  const { currentItem: currentCustomer, items: customers, setCurrentItem: setCurrentCustomer, updateItem } = useCustomerStore();

  useEffect(() => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setCurrentCustomer(customer);
    }
  }, [customerId, customers, setCurrentCustomer]);

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const },
    { name: 'company', label: 'Company', type: 'text' as const },
    { name: 'position', label: 'Position', type: 'text' as const },
    { name: 'address', label: 'Address', type: 'text' as const },
  ];

  const handleSubmit = async (data: any) => {
    await updateItem(customerId, data);
    onSubmitSuccess?.();
  };

  if (!currentCustomer || currentCustomer.id !== customerId) {
    return <GenericModal isOpen={true} title="Edit Customer" onClose={onClose} isLoading={true} />;
  }

  return (
    <GenericModal isOpen={true} title="Edit Customer" onClose={onClose}>
      <GenericForm
        initialData={currentCustomer}
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Update Customer"
      />
    </GenericModal>
  );
}