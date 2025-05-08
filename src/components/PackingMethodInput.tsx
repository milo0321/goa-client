import React from 'react';
import { Input, Button, Row, Col, Space } from 'antd';
import { IconTrash, IconPlus, IconPackages } from '@tabler/icons-react';
import { PackingDetail } from '../types/quotation';
import { formatPackingMethodDescription } from '../utils/format';

interface PackingMethodInputProps {
  packingMethods: PackingDetail[];
  setPackingMethods: React.Dispatch<React.SetStateAction<PackingDetail[]>>;
}

export const PackingMethodInput = ({
  packingMethods,
  setPackingMethods,
}: PackingMethodInputProps) => {
  const handleChange = (
    index: number,
    field: keyof PackingDetail,
    subfield: string,
    value: string
  ) => {
    const updated = [...packingMethods];
    updated[index][field] = {
      ...(updated[index][field] || {}),
      [subfield]: value,
    };
    setPackingMethods(updated);
  };

  const addMethod = () => {
    setPackingMethods([
      ...packingMethods,
      {
        innerPack: { value: '', unit: 'pcs/bag' },
        outerPack: { value: '', unit: 'pcs/carton' },
        cartonSize: { length: '', width: '', height: '', unit: 'cm' },
        weight: { value: '', unit: 'kg/carton' },
      },
    ]);
  };

  const removeMethod = (index: number) => {
    const updated = [...packingMethods];
    updated.splice(index, 1);
    setPackingMethods(updated);
  };

  return (
    <div className="border rounded p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h4 className="font-medium mb-0 flex items-center">
            <IconPackages className="mr-2" />
            Packing Method
          </h4>
        </Col>
        <Col>
          <Button type="dashed" icon={<IconPlus size={16} />} onClick={addMethod}>
            Add Packing Method
          </Button>
        </Col>
      </Row>

      {packingMethods.map((method, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          <Row gutter={16}>
            <Col span={6}>
              <Space direction="vertical" size={4}>
                <label>Inner Pack</label>
                <Input
                  placeholder="e.g. 100"
                  value={method.innerPack?.value}
                  onChange={e => handleChange(index, 'innerPack', 'value', e.target.value)}
                />
                <Input
                  placeholder="e.g. pcs/bag"
                  value={method.innerPack?.unit}
                  onChange={e => handleChange(index, 'innerPack', 'unit', e.target.value)}
                />
              </Space>
            </Col>

            <Col span={6}>
              <Space direction="vertical" size={4}>
                <label>Outer Pack</label>
                <Input
                  placeholder="e.g. 500"
                  value={method.outerPack?.value}
                  onChange={e => handleChange(index, 'outerPack', 'value', e.target.value)}
                />
                <Input
                  placeholder="e.g. pcs/carton"
                  value={method.outerPack?.unit}
                  onChange={e => handleChange(index, 'outerPack', 'unit', e.target.value)}
                />
              </Space>
            </Col>

            <Col span={8}>
              <Space direction="vertical" size={4}>
                <label>Carton Size (L × W × H)</label>
                <Input.Group compact>
                  <Input
                    style={{ width: '30%' }}
                    placeholder="L"
                    value={method.cartonSize?.length}
                    onChange={e => handleChange(index, 'cartonSize', 'length', e.target.value)}
                  />
                  <Input
                    style={{ width: '30%' }}
                    placeholder="W"
                    value={method.cartonSize?.width}
                    onChange={e => handleChange(index, 'cartonSize', 'width', e.target.value)}
                  />
                  <Input
                    style={{ width: '30%' }}
                    placeholder="H"
                    value={method.cartonSize?.height}
                    onChange={e => handleChange(index, 'cartonSize', 'height', e.target.value)}
                  />
                </Input.Group>
                <Input
                  placeholder="e.g. cm"
                  value={method.cartonSize?.unit}
                  onChange={e => handleChange(index, 'cartonSize', 'unit', e.target.value)}
                />
              </Space>
            </Col>

            <Col span={4}>
              <Space direction="vertical" size={4}>
                <label>Gross Weight</label>
                <Input
                  placeholder="e.g. 21"
                  value={method.weight?.value}
                  onChange={e => handleChange(index, 'weight', 'value', e.target.value)}
                />
                <Input
                  placeholder="e.g. kg/carton"
                  value={method.weight?.unit}
                  onChange={e => handleChange(index, 'weight', 'unit', e.target.value)}
                />
              </Space>
            </Col>

            <Col span={2} className="flex items-center pt-6">
              <Button
                danger
                icon={<IconTrash size={16} />}
                onClick={() => removeMethod(index)}
              />
            </Col>
          </Row>

          <p className="mt-2 text-gray-600 text-sm">
            <strong>Preview:</strong> {formatPackingMethodDescription(method)}
          </p>
        </div>
      ))}
    </div>
  );
};
