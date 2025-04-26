import { useCustomerStore } from '../store/customerStore';
import { GenericModal } from './GenericModal';
import { GenericForm } from './GenericForm';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export function CreateCustomerModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateCustomerModalProps) {
  const { createItem, loading } = useCustomerStore();

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const },
    { name: 'company', label: 'Company', type: 'text' as const },
    { name: 'position', label: 'Position', type: 'text' as const },
    { name: 'address', label: 'Address', type: 'text' as const },
  ];

  const handleSubmit = async (data: any) => {
    await createItem(data);
    onSubmitSuccess?.();
    onClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      title="Create New Customer"
      onClose={onClose}
      isLoading={loading}
    >
      <GenericForm
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Create Customer"
        loading={loading}
      />
    </GenericModal>
  );
}