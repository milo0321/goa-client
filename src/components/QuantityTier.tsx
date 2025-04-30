import { Input, Button } from 'antd';
import { IconPlus, IconTrash, IconPlane, IconShip } from '@tabler/icons-react';

interface QuantityTierProps {
  quantityTiers: { quantity: number; airPrice: number; shipPrice: number }[];
  setQuantityTiers: React.Dispatch<React.SetStateAction<any[]>>;
  loadingPrices: Record<string, boolean>;
  handlePriceCalculation: (tierIndex: number, method: 'air' | 'ship') => void;
}

export const QuantityTiers = ({
  quantityTiers,
  setQuantityTiers,
  loadingPrices,
  handlePriceCalculation,
}: QuantityTierProps) => {
  return (
    <div className="border rounded p-4">
      <h4 className="font-medium mb-4 flex items-center">
        <IconPlane className="mr-2" />
        Quantity Tiers
      </h4>
      {quantityTiers.map((tier, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-3">
            <Input
              addonBefore="Qty"
              value={tier.quantity}
              onChange={e => {
                const newTiers = [...quantityTiers];
                newTiers[index].quantity = Number(e.target.value);
                setQuantityTiers(newTiers);
              }}
              type="number"
            />
          </div>

          {['air', 'ship'].map(method => {
            const price = tier[`${method}Price`];
            const loadingKey = `${index}-${method}`;
            return (
              <div key={method} className="col-span-3">
                <Input
                  addonBefore={method === 'air' ? <IconPlane size={16} /> : <IconShip size={16} />}
                  value={price || ''}
                  onChange={e => {
                    const newTiers = [...quantityTiers];
                    newTiers[index][`${method}Price`] = Number(e.target.value);
                    setQuantityTiers(newTiers);
                  }}
                />
                <Button
                  size="small"
                  loading={loadingPrices[loadingKey]}
                  onClick={() => handlePriceCalculation(index, method)}
                  className="mt-1"
                >
                  Calculate
                </Button>
              </div>
            );
          })}

          <div className="col-span-1">
            <Button
              danger
              icon={<IconTrash size={16} />}
              onClick={() => {
                const newTiers = [...quantityTiers];
                newTiers.splice(index, 1);
                setQuantityTiers(newTiers);
              }}
            />
          </div>
        </div>
      ))}

      <Button
        type="dashed"
        icon={<IconPlus size={16} />}
        onClick={() =>
          setQuantityTiers([...quantityTiers, { quantity: 0, airPrice: 0, shipPrice: 0 }])
        }
      >
        Add Tier
      </Button>
    </div>
  );
};
