import { useState, useEffect } from 'react';
import { useCustomerStore } from '../store/customerStore';
import { CreateCustomer, UpdateCustomer, Customer } from '../types/customer';

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmitSuccess?: () => void;
}

export default function CustomerForm({ 
  initialData,
  onSubmitSuccess
}: CustomerFormProps) {
  const { createItem: createCustomer, updateItem: updateCustomer, loading } = useCustomerStore();
  const [formData, setFormData] = useState<CreateCustomer | UpdateCustomer>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    position: initialData?.position || '',
    address: initialData?.address || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || '',
        company: initialData.company || '',
        position: initialData.position || '',
        address: initialData.address || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await updateCustomer(initialData.id, formData);
      } else {
        await createCustomer(formData as CreateCustomer);
      }
      onSubmitSuccess?.();
    } catch (err) {
      console.error('Failed to save customer:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* 添加其他字段... */}

      <button 
        type="submit" 
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : initialData ? 'Update' : 'Create'}
      </button>
    </form>
  );
}