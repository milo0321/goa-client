import { Input, Select, Checkbox, Button } from 'antd';
import { IconTrash, IconPlus } from '@tabler/icons-react';

interface AdditionalFeesProps {
  additionalFees: { feeType: string; amount: number; refundable: boolean; conditions?: string }[];
  setAdditionalFees: React.Dispatch<React.SetStateAction<any[]>>;
}

export const AdditionalFees = ({
  additionalFees,
  setAdditionalFees,
}: AdditionalFeesProps) => {
  return (
    <div className="border rounded p-4">
      <h4 className="font-medium mb-4">Additional Fees</h4>
      {additionalFees.map((fee, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <Select
              value={fee.feeType}
              onChange={v => {
                const newFees = [...additionalFees];
                newFees[index].feeType = v;
                setAdditionalFees(newFees);
              }}
              options={[
                { value: 'sampling', label: 'Sampling Fee' },
                { value: 'mold', label: 'Mold Fee' },
                { value: 'certification', label: 'Certification' },
              ]}
            />
          </div>

          <div className="col-span-3">
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
            <div className="col-span-3">
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

      <Button
        type="dashed"
        icon={<IconPlus size={16} />}
        onClick={() =>
          setAdditionalFees([...additionalFees, { feeType: 'sampling', amount: 0, refundable: false }])
        }
      >
        Add Fee
      </Button>
    </div>
  );
};
