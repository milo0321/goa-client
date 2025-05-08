import React from 'react';
import { InputNumber, Select, Radio, Form, Space } from 'antd';

const { Option } = Select;

export type ProductionTimeValue = {
  type: 'exact' | 'range';
  from: number;
  to?: number;
  unit: 'days' | 'months';
};

interface ProductionTimeInputProps {
  label: string;
  value: ProductionTimeValue;
  onChange: (val: ProductionTimeValue) => void;
}

export const ProductionTimeInput: React.FC<ProductionTimeInputProps> = ({
  label,
  value,
  onChange,
}) => {
  const handleChange = (field: Partial<ProductionTimeValue>) => {
    onChange({ ...value, ...field });
  };

  return (
    <Form.Item label={label} style={{ marginBottom: 16 }}>
      <Radio.Group
        value={value.type}
        onChange={e => handleChange({ type: e.target.value })}
        style={{ marginBottom: 8 }}
      >
        <Radio value="exact">Exact</Radio>
        <Radio value="range">Range</Radio>
      </Radio.Group>

      <Space>
        <InputNumber
          min={0}
          value={value.from}
          onChange={val => handleChange({ from: val || 0 })}
          placeholder={value.type === 'exact' ? 'Days' : 'From'}
        />
        {value.type === 'range' && (
          <InputNumber
            min={value.from || 0}
            value={value.to}
            onChange={val => handleChange({ to: val || 0 })}
            placeholder="To"
          />
        )}
        <Select
          value={value.unit}
          onChange={unit => handleChange({ unit })}
          style={{ width: 100 }}
        >
          <Option value="days">Days</Option>
          <Option value="months">Months</Option>
        </Select>
      </Space>
    </Form.Item>
  );
};
