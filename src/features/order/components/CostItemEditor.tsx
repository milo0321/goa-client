// components/CostItemEditor.tsx
import { EditableTableEditor } from './EditableTableEditor';
import { CreateCostItem } from '@/features/order/order.types';

interface Props {
  items: CreateCostItem[];
  onChange: (updated: CreateCostItem[]) => void;
}

export const CostItemEditor = ({ items, onChange }: Props) => (
  <EditableTableEditor<CreateCostItem>
    title="Cost Items"
    items={items}
    onChange={onChange}
    addLabel="Add Cost"
    createDefault={() => ({
      componentName: '',
      componentType: '',
      quantity: 1,
      unit: 'pcs',
      unitCost: 0,
      remarks: '',
    })}
    fields={[
      { key: 'componentName', label: 'Name', type: 'text' },
      { key: 'componentType', label: 'Type', type: 'text' },
      { key: 'quantity', label: 'Qty', type: 'number' },
      { key: 'unit', label: 'Unit', type: 'text' },
      { key: 'unitCost', label: 'Unit Cost', type: 'number' },
    ]}
  />
);
