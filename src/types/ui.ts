export interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox';
  options?: { label: string, value: string }[]; // Only used for select fields
  required?: boolean;
  placeholder?: string;
}