import { useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';
import CustomerForm from './CustomerForm';

interface EditCustomerModalProps {
  customerId: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function EditCustomerModal({ customerId, onClose, onSubmitSuccess }: EditCustomerModalProps) {
  const { currentItem: currentCustomer, items: customers, setCurrentItem: setCurrentCustomer } = useCustomerStore();

  useEffect(() => {
    const customer = customers.find(c => c.id === customerId);

    if (customer) {
      setCurrentCustomer(customer); // 设置当前编辑的客户
    }
  }, [customerId, customers, setCurrentCustomer]);

  if (!currentCustomer || currentCustomer.id !== customerId) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white rounded-lg p-4 max-w-md w-full">
          <p>Loading customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Edit Customer</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <CustomerForm
            initialData={currentCustomer}
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