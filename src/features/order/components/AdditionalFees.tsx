import { Input, Select, Checkbox, Button, Row, Col } from 'antd';
import { IconTrash, IconPlus, IconReceipt2 } from '@tabler/icons-react';
import React, { useState } from 'react';

interface AdditionalFeesProps {
  additionalFees: { feeType: string; amount: number; refundable: boolean; conditions?: string }[];
  setAdditionalFees: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AdditionalFees = ({
  additionalFees,
  setAdditionalFees,
}: AdditionalFeesProps) => {
  const [feeOptions, setFeeOptions] = useState([
    { value: 'sampling', label: 'Sampling Fee' },
    { value: 'mold', label: 'Mold Fee' },
    { value: 'certification', label: 'Certification' },
  ]);

  const addFee = () => {
    setAdditionalFees([
      ...additionalFees,
      { feeType: 'sampling', amount: 0, refundable: false },
    ]);
  };

  return (
    <div className="border rounded p-4">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h4 className="font-medium mb-0 flex items-center">
            <IconReceipt2 className="mr-2" />
            Additional Fees
          </h4>
        </Col>
        <Col>
          <Button
            type="dashed"
            icon={<IconPlus size={16} />}
            onClick={() =>
              setAdditionalFees([...additionalFees, { feeType: 'sampling', amount: 0, refundable: false }])
            }
          >
            Add Fee
          </Button>
        </Col>
      </Row>

      {additionalFees.map((fee, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <Select
              mode="tags"
              value={fee.feeType}
              onChange={v => {
                const newVal = Array.isArray(v) ? v[0] : v;
                if (!feeOptions.find(opt => opt.value === newVal)) {
                  setFeeOptions([...feeOptions, { value: newVal, label: newVal }]);
                }
                const newFees = [...additionalFees];
                newFees[index].feeType = newVal;
                setAdditionalFees(newFees);
              }}
              options={feeOptions}
              style={{ minWidth: '150px' }}  // Ensure the select has a minimum width
            />
          </div>

          <div className="col-span-2">
            <Input
              value={fee.amount}
              onChange={e => {
                const newFees = [...additionalFees];
                newFees[index].amount = Number(e.target.value);
                setAdditionalFees(newFees);
              }}
              type="number"
              min={0}
              prefix="$"
            />
          </div>

          <div className="col-span-3 flex items-center">
            <Checkbox
              checked={fee.refundable}
              onChange={e => {
                const newFees = [...additionalFees];
                newFees[index].refundable = e.target.checked;
                setAdditionalFees(newFees);
              }}
            >
              Refundable
            </Checkbox>
          </div>

          {fee.refundable && (
            <div className="col-span-6">
              <Input
                value={fee.conditions || ''}
                onChange={e => {
                  const newFees = [...additionalFees];
                  newFees[index].conditions = e.target.value;
                  setAdditionalFees(newFees);
                }}
                placeholder="Refund conditions"
              />
            </div>
          )}

          <div className="col-span-1">
            <Button
              danger
              icon={<IconTrash size={16} />}
              onClick={() => {
                const newFees = [...additionalFees];
                newFees.splice(index, 1);
                setAdditionalFees(newFees);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
