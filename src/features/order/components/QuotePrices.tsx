import { Input, Button, Row, Col, Select } from 'antd';
import {
  IconPlus,
  IconTrash,
  IconPlane,
  IconShip,
  IconPackage,
} from '@tabler/icons-react';
import { QuotePrice } from '../order.types';

const methodIcons = {
  air: <IconPlane size={16} />,
  ship: <IconShip size={16} />,
  express: <IconPackage size={16} />,
};

const methodOptions = [
  { label: 'Air', value: 'air' },
  { label: 'Ship', value: 'ship' },
  { label: 'Express', value: 'express' },
];

interface QuotePricesProps {
  quotePrices: QuotePrice[];
  setQuotePrices: React.Dispatch<React.SetStateAction<QuotePrice[]>>;
}

export const QuotePrices = ({
  quotePrices,
  setQuotePrices,
}: QuotePricesProps) => {
  const addMethod = (method: 'air' | 'ship' | 'express') => {
    const exists = quotePrices.find((p) => p.method === method);
    if (!exists) {
      setQuotePrices([
        ...quotePrices,
        {
          method,
          terms: 'CNF',
          destination: 'Germany',
          prices: [{ quantity: 1000, unitPrice: 0, currency: 'USD' }],
        },
      ]);
    }
  };

  const addTier = (index: number) => {
    const newPrices = [...quotePrices];
    newPrices[index].prices.push({
      quantity: 0,
      unitPrice: 0,
      currency: 'USD',
    });
    setQuotePrices(newPrices);
  };

  const removeMethod = (index: number) => {
    const newPrices = [...quotePrices];
    newPrices.splice(index, 1);
    setQuotePrices(newPrices);
  };

  const removeTier = (methodIndex: number, tierIndex: number) => {
    const newPrices = [...quotePrices];
    newPrices[methodIndex].prices.splice(tierIndex, 1);
    setQuotePrices(newPrices);
  };

  return (
    <div className="border rounded p-4 mx-auto">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col>
          <h4 className="font-medium mb-0 flex items-center">
            <IconPlane className="mr-2" />
            Shipping Methods & Pricing
          </h4>
        </Col>
        <Col>
          <Select
            placeholder="Add Method"
            options={methodOptions.filter(
              (m) => !quotePrices.find((p) => p.method === m.value)
            )}
            onSelect={(method) => addMethod(method as any)}
            style={{ width: 140 }}
          />
        </Col>
      </Row>

      {quotePrices.map((quote, index) => (
        <div key={quote.method} className="border rounded p-4 mb-4">
          <Row justify="space-between" align="middle" className="mb-2">
            <Col>
              <h5 className="flex items-center mb-2">
                {methodIcons[quote.method]}
                <span className="ml-2 capitalize">{quote.method} Pricing</span>
              </h5>
            </Col>
            <Col>
              <Button
                type="text"
                danger
                icon={<IconTrash size={16} />}
                onClick={() => removeMethod(index)}
              />
            </Col>
          </Row>

          <Row gutter={12} className="mb-3">
            <Col flex="100px">
              <Select
                placeholder="Terms"
                value={quote.terms}
                onChange={(val) => {
                  const newPrices = [...quotePrices];
                  newPrices[index].terms = val;
                  setQuotePrices(newPrices);
                }}
                options={[
                  { value: 'CNF', label: 'CNF' },
                  { value: 'FOB', label: 'FOB' },
                  { value: 'CIF', label: 'CIF' },
                  { value: 'EXW', label: 'EXW' },
                ]}
              />
            </Col>
            <Col flex="120px">
              <Select
                placeholder="Destination"
                value={quote.destination}
                onChange={(val) => {
                  const newPrices = [...quotePrices];
                  newPrices[index].destination = val;
                  setQuotePrices(newPrices);
                }}
                options={[
                  { value: 'Germany', label: 'Germany' },
                  { value: 'USA', label: 'USA' },
                  { value: 'UK', label: 'UK' },
                  { value: 'France', label: 'France' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'Australia', label: 'Australia' },
                  { value: 'Japan', label: 'Japan' },
                ]}
                showSearch
              />
            </Col>
          </Row>

          {quote.prices.map((price, tierIndex) => (
            <Row
              key={tierIndex}
              gutter={12}
              align="middle"
              className="mb-2"
              wrap={false}
            >
              <Col flex="160px">
                <Input
                  addonBefore="Qty"
                  type="number"
                  step={10}
                  min={10}
                  value={price.quantity}
                  onChange={(e) => {
                    const newPrices = [...quotePrices];
                    newPrices[index].prices[tierIndex].quantity = Number(
                      e.target.value
                    );
                    setQuotePrices(newPrices);
                  }}
                />
              </Col>
              <Col flex="160px">
                <Input
                  addonBefore="Unit"
                  type="number"
                  step={0.0001}
                  min={0}
                  value={price.unitPrice}
                  onChange={(e) => {
                    const newPrices = [...quotePrices];
                    newPrices[index].prices[tierIndex].unitPrice = Number(
                      e.target.value
                    );
                    setQuotePrices(newPrices);
                  }}
                />
              </Col>
              <Col flex="80px">
                <Select
                  value={price.currency}
                  onChange={(val) => {
                    const newPrices = [...quotePrices];
                    newPrices[index].prices[tierIndex].currency = val;
                    setQuotePrices(newPrices);
                  }}
                  options={[
                    { value: 'USD', label: 'USD' },
                    { value: 'EUR', label: 'EUR' },
                    { value: 'CNY', label: 'CNY' },
                  ]}
                />
              </Col>
              <Col flex="40px">
                <Button
                  type="text"
                  danger
                  icon={<IconTrash size={16} />}
                  onClick={() => removeTier(index, tierIndex)}
                />
              </Col>
            </Row>
          ))}

          <Button
            type="dashed"
            size="small"
            icon={<IconPlus size={14} />}
            onClick={() => addTier(index)}
          >
            Add Tier
          </Button>
        </div>
      ))}
    </div>
  );
};
