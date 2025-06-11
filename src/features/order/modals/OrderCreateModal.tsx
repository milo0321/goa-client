import { useEffect, useRef, useState } from 'react';
import { Button, notification } from 'antd';
import dayjs from 'dayjs';
import { useCustomerStore } from '../../customer/store/customer.store';
import { useOrderStore } from '../order.store';
import { GenericModal } from '@/components/GenericModal';
import { GenericForm } from '@/components/GenericForm';
import { CreateOrder } from '../order.types';
import { logger } from '@/utils/logger';

interface OrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function OrderCreateModal({
                                           isOpen,
                                           onClose,
                                           onSubmitSuccess,
                                         }: OrderCreateModalProps) {
  const { items: customers, loading: customerLoading, fetchItems: fetchCustomers } = useCustomerStore();
  const { createItem } = useOrderStore();
  const formRef = useRef<unknown>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers().catch((err) => {
        logger.error('Failed to fetch customers:', err);
      });
    }
  }, [customers, customerLoading, fetchCustomers]);

  const handleSubmit = async (baseData: CreateOrder) => {
    try {
      const payload: CreateOrder = {
        ...baseData,
        orderDate: dayjs(baseData.orderDate).toISOString(),
        deliveryTime: dayjs(baseData.deliveryTime).toISOString(),
        orderItems: baseData.orderItems || [], // 确保存在
        costItems: baseData.costItems || [],
      };

      await createItem(payload);
      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      logger.error('Create order failed:', error);
      notification.error({
        message: 'Submission Failed',
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = await pdfParse(Buffer.from(arrayBuffer));
      const parsed = parsePdfTextToOrder(pdfData.text);

      formRef.current?.setFieldsValue(parsed);
      notification.success({ message: 'PDF parsed and form filled.' });
      onSuccess?.(null, new XMLHttpRequest());
    } catch (err) {
      console.error('PDF parsing error:', err);
      notification.error({ message: 'Failed to parse PDF' });
      onError?.(err as Error);
    } finally {
      setUploading(false);
    }
  };

  const parsePdfTextToOrder = (
    text: string,
  ): Partial<CreateOrder> => {
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
    const findLine = (keyword: string) =>
      lines.find((l) => l.toLowerCase().includes(keyword.toLowerCase())) ?? '';

    const orderNoLine = findLine('order');
    const orderNoMatch = orderNoLine.match(/(\d{4}-\d{6})/);

    const deliveryLine = findLine('Please deliver by');
    const orderDateLine = findLine('Date of order');
    const articleLine = findLine('Artikel:');
    const article = articleLine?.split(':')[1]?.trim();

    // 提取 orderItems 区块
    const orderItems: CreateOrderItem[] = [];
    const posIndex = lines.findIndex(
      (line) => line.includes('Pos') && line.includes('Item no'),
    );

    if (posIndex >= 0) {
      for (let i = posIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        // 假设格式："1 80502 Velvet Bag 10x15cm 1000 pcs 0.50 500.00"
        const parts = line.split(/\s{2,}/).filter(Boolean);
        if (parts.length < 6) continue;

        const [itemNo, ...rest] = parts;
        const qtyIndex = rest.findIndex((v) => /^\d+$/.test(v));
        if (qtyIndex < 0 || !rest[qtyIndex + 1]) continue;

        const articleText = rest.slice(0, qtyIndex).join(' ');
        const quantity = parseInt(rest[qtyIndex], 10);
        const unit = rest[qtyIndex + 1];
        const unitPrice = parseFloat(rest[qtyIndex + 2] || '0');

        orderItems.push({
          itemNo: itemNo,
          article: articleText,
          quantity,
          unit,
          unitPrice,
          vatRate: 0,
        });
      }
    }

    // 提取 tooling 成本（示例静态）
    const costItems: CreateCostItem[] = [
      {
        componentName: 'Werkzeugkosten / moulding charge',
        componentType: 'Molding',
        quantity: 1,
        unit: 'pcs',
        unitCost: 150,
        remarks: 'Tooling',
      },
    ];

    return {
      orderNo: orderNoMatch?.[1] ?? '',
      orderArticle: article ?? '',
      currency: 'USD',
      paymentTerms: '',
      deliveryTime: deliveryLine
        ? new Date(deliveryLine.split(':').pop()!.trim()).toISOString()
        : '',
      shippingMethod: '',
      orderDate: orderDateLine
        ? new Date(orderDateLine.split(':').pop()!.trim()).toISOString()
        : dayjs().toISOString(),
      remarks: 'Generated from PDF',
      status: 'draft',
      orderItems,
      costItems,
    };
  };

  const baseFields = [
    { name: 'orderNo', label: 'Order No.', type: 'text' as const, required: true },
    { name: 'orderArticle', label: 'Order Article', type: 'text' as const, required: true },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select' as const,
      options: Array.isArray(customers)
        ? customers.map((c) => ({ value: c.id, label: c.name }))
        : [],
      required: true,
      attrs: {
        disabled: customerLoading,
      },
    },
    { name: 'customerOrderNo', label: 'Customer Order No.', type: 'text' as const },
    { name: 'customerName', label: 'Customer Name', type: 'text' as const },
    { name: 'currency', label: 'Currency', type: 'text' as const, required: true },
    { name: 'paymentTerms', label: 'Payment Terms', type: 'text' as const, required: true },
    { name: 'deliveryTime', label: 'Delivery Time', type: 'date' as const, required: true },
    { name: 'shippingMethod', label: 'Shipping Method', type: 'text' as const },
    { name: 'orderDate', label: 'Order Date', type: 'date' as const, required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea' as const },
    // 这里暂不处理 packingDetails、orderItems、costItems 的表单字段，可以后续补充
  ];

  return (
    <GenericModal isOpen={isOpen} title="Create Order" onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        {/* 上传PDF区域 */}
        <div className="space-y-2">
          <label className="font-semibold">Upload Order PDF:</label>
          <Upload
            accept=".pdf"
            showUploadList={false}
            customRequest={handleUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload PDF to Auto-fill
            </Button>
          </Upload>
        </div>

        {/* 表单区域 */}
        <GenericForm
          formRef={formRef}
          initialData={{ orderDate: dayjs().toISOString() }}
          fields={baseFields}
          onSubmit={handleSubmit}
          submitText="Create Order"
        />
      </div>
    </GenericModal>
  );
}
