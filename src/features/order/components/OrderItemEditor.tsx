// components/OrderItemEditor.tsx
import { EditableTableEditor } from './EditableTableEditor';
import { CreateOrderItem } from '@/features/order/order.types';

interface Props {
  items: CreateOrderItem[];
  onChange: (updated: CreateOrderItem[]) => void;
}

export const OrderItemEditor = ({ items, onChange }: Props) => (
  <EditableTableEditor<CreateOrderItem>
    title="Order Items"
    items={items}
    onChange={onChange}
    addLabel="Add Item"
    createDefault={() => ({
      itemNo: `${items.length + 1}`,
      article: '',
      quantity: 0,
      unit: 'pcs',
      unitPrice: 0,
      vatRate: 0,
    })}
    fields={[
      { key: 'article', label: 'Article', type: 'text' },
      { key: 'quantity', label: 'Quantity', type: 'number' },
      { key: 'unit', label: 'Unit', type: 'text' },
      { key: 'unitPrice', label: 'Unit Price', type: 'number' },
      { key: 'vatRate', label: 'VAT %', type: 'number' },
    ]}
  />
);
