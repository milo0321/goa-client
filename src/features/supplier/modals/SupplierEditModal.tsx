import { useEffect } from 'react';
import { useSupplierStore } from '../supplier.store';
import { GenericModal } from '../../../components/GenericModal';
import { GenericForm } from '../../../components/GenericForm';

interface SupplierEditModalProps {
  supplierId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function SupplierEditModal({
  supplierId,
  onClose,
  onSubmitSuccess,
}: SupplierEditModalProps) {
  const { currentItem: currentSupplier, items: suppliers, setCurrentItem: setCurrentSupplier, updateItem } = useSupplierStore();

  useEffect(() => {
    const supplier = suppliers.find((c) => c.id === supplierId);
    if (supplier) {
      setCurrentSupplier(supplier);
    }
  }, [supplierId, suppliers, setCurrentSupplier]);

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as const, required: true },
    { name: 'email', label: 'Email', type: 'email' as const, required: true },
    { name: 'phone', label: 'Phone', type: 'tel' as const },
    { name: 'company', label: 'Company', type: 'text' as const },
    { name: 'position', label: 'Position', type: 'text' as const },
    { name: 'address', label: 'Address', type: 'text' as const },
  ];

  const handleSubmit = async (data: any) => {
    await updateItem(supplierId, data);
    onSubmitSuccess?.();
  };

  if (!currentSupplier || currentSupplier.id !== supplierId) {
    return <GenericModal isOpen={true} title="Edit Supplier" onClose={onClose} isLoading={true} />;
  }

  return (
    <GenericModal isOpen={true} title="Edit Supplier" onClose={onClose}>
      <GenericForm
        initialData={currentSupplier}
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Update Supplier"
      />
    </GenericModal>
  );
}