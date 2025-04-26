import { useState } from 'react';
import ErrorMessage from './ErrorMessage';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  step?: string;
}

interface GenericFormProps<T> {
  initialData?: T;
  fields: FormField[];
  onSubmit: (data: T) => Promise<void>;
  submitText?: string;
  loading?: boolean;
}

export function GenericForm<T>({
  initialData,
  fields,
  onSubmit,
  submitText = 'Submit',
  loading = false,
}: GenericFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialData || {} as T);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    name: string
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save data. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              value={(formData as any)[field.name] || ''}
              onChange={(e) => handleChange(e, field.name)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
              required={field.required}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              value={(formData as any)[field.name] || ''}
              onChange={(e) => handleChange(e, field.name)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required={field.required}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              value={(formData as any)[field.name] || (field.type === 'number' ? 0 : '')}
              onChange={(e) => handleChange(e, field.name)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required={field.required}
              min={field.min}
              step={field.step}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : submitText}
      </button>
    </form>
  );
}