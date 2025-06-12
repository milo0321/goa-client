// components/EditableTableEditor.tsx
import { Button, Input, InputNumber } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

export interface EditableField<T> {
  key: keyof T;
  label: string;
  type: 'text' | 'number';
  placeholder?: string;
}

interface Props<T> {
  title: string;
  items: T[];
  fields: EditableField<T>[];
  onChange: (updated: T[]) => void;
  createDefault: () => T;
  addLabel?: string;
}

export const EditableTableEditor = <T,>({
  title,
  items,
  fields,
  onChange,
  createDefault,
  addLabel = 'Add Item',
}: Props<T>) => {
  const updateItem = (index: number, key: keyof T, value: string | number | null) => {
    const updated = [...items];
    // Use type assertion to correctly assign the value
    updated[index] = {
      ...updated[index],
      [key]: value as T[typeof key],
    };
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, createDefault()]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="font-semibold">{title}</label>
        <Button type="dashed" icon={<PlusOutlined />} onClick={addItem}>
          {addLabel}
        </Button>
      </div>

      {items.length > 0 && (
        <div className={`grid grid-cols-${fields.length + 1} gap-2 text-sm text-gray-600 font-medium px-1`}>
          {fields.map((f) => (
            <div key={String(f.key)}>{f.label}</div>
          ))}
          <div className="text-center">Action</div>
        </div>
      )}

      {items.map((item, idx) => (
        <div key={idx} className={`grid grid-cols-${fields.length + 1} gap-2 items-center`}>
          {fields.map((f) =>
            f.type === 'text' ? (
              <Input
                key={String(f.key)}
                value={(item[f.key] as unknown) as string ?? ''}
                placeholder={f.placeholder}
                onChange={(e) => updateItem(idx, f.key, e.target.value)}
              />
            ) : (
              <InputNumber
                key={String(f.key)}
                value={(item[f.key] as unknown) as number ?? 0}
                placeholder={f.placeholder}
                min={0}
                onChange={(v) => updateItem(idx, f.key, v)}
              />
            )
          )}
          <div className="text-center">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeItem(idx)}
              size="small"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
