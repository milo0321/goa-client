import { useState } from 'react';
import ErrorMessage from './ErrorMessage';
import { Button, DatePicker } from 'antd';
import dayjs from 'dayjs';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'date';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  min?: number;
  step?: string;
}

interface GenericFormProps<T> {
  initialData?: T;
  fields: FormField[];
  onSubmit: (data: T) => Promise<void>;
  submitText?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

export function GenericForm<T>({
  initialData,
  fields,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  children,
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

  const handleDateChange = (date: any, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 在提交前统一格式化日期字段
    const formattedData = { ...formData };

    // 查找所有日期字段并格式化
    fields.forEach(field => {
      if (field.required && !formattedData[field.name]) {
        if (field.type === 'date') {
          formattedData[field.name] = dayjs(); // 默认当前时间
        } else {
          formattedData[field.name] = ''; // 空字符串作为默认
        }
      }
    });

    try {
      await onSubmit(formattedData);
    } catch (err) {
      console.error('Form submission error:', err);
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
              placeholder={field.placeholder}
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
          ) : field.type === 'date' ? (
            <DatePicker
              id={field.name}
              value={dayjs((formData as any)[field.name])}  // Handle date value conversion
              onChange={(date) => handleDateChange(date, field.name)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              format="YYYY-MM-DD"
              required={field.required}
            />
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
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
      {children}
      <div className="flex justify-end mt-4">
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {submitText}
        </Button>
      </div>
    </form>
  );
}