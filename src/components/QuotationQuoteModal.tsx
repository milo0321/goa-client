// QuotationQuoteModal.tsx
import { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { Button, Input, Select, Form } from 'antd';
import { GenericModal } from './GenericModal';

interface QuotationQuoteModalProps {
  inquiryData: {
    id: string;
    customerName: string,
    productName: string,
    inquiryDate: string,
    quantityTiers: Array<{ quantity: number }>;
  };
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quoteData: QuoteFormData) => Promise<void>;
}

interface QuoteFormData {
  sampleTime: string;
  massTime: string;
  packing: string;
  quantityTiers: Array<{
    quantity: number;
    airPrice: number;
    shipPrice: number;
  }>;
  additionalFees: Array<{
    feeType: string;
    amount: number;
    refundable: boolean;
    conditions?: string;
  }>;
}

export function QuotationQuoteModal({
  inquiryData,
  isOpen,
  onClose,
  onSubmit,
}: QuotationQuoteModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    quantityTiers: inquiryData.quantityTiers.map(t => ({
      ...t,
      airPrice: 0,
      shipPrice: 0
    })),
    additionalFees: [],
    packing: 'standard',
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        sampleTime: dayjs(values.sampleTime).format('YYYY-MM-DD'),
        massTime: dayjs(values.massTime).format('YYYY-MM-DD'),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericModal
      isOpen={isOpen}
      title={`Quote for ${inquiryData.productName} from ${inquiryData.customerName} in ${inquiryData.inquiryDate}`}
      onClose={onClose}
      isLoading={loading}
    >
      <Form form={form} initialValues={initialValues} layout="vertical">
        {/* 时间信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Form.Item
            label="Sample Production Time"
            name="sampleTime"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Mass Production Time"
            name="massTime"
            rules={[{ required: true }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        {/* 包装信息 */}
        <Form.Item label="Packing Method" name="packing">
          <Select
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'export', label: 'Export' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </Form.Item>

        {/* 价格阶梯 */}
        <div className="border rounded p-4 mb-6">
          <h3 className="font-medium mb-4">Price Tiers</h3>
          <Form.List name="quantityTiers">
            {(fields) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-3">
                      <Form.Item
                        {...restField}
                        name={[name, 'quantity']}
                        label="Quantity"
                      >
                        <Input disabled />
                      </Form.Item>
                    </div>
                    <div className="col-span-3">
                      <Form.Item
                        {...restField}
                        name={[name, 'airPrice']}
                        label="Air Price"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" prefix="$" />
                      </Form.Item>
                    </div>
                    <div className="col-span-3">
                      <Form.Item
                        {...restField}
                        name={[name, 'shipPrice']}
                        label="Ship Price"
                        rules={[{ required: true }]}
                      >
                        <Input type="number" prefix="$" />
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        </div>

        {/* 附加费用（保持原有逻辑） */}
        {/* 提交按钮 */}
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
          >
            Submit Quote
          </Button>
        </div>
      </Form>
    </GenericModal>
  );
}