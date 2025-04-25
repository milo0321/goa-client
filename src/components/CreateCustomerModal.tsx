import CustomerForm from './CustomerForm';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Create New Customer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <CustomerForm 
            onSubmitSuccess={() => {
              onSubmitSuccess?.();
              onClose();
            }} 
          />
        </div>
      </div>
    </div>
  );
}