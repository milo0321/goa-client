import { useEffect, useRef, useState } from 'react';
import { Button, notification, Upload, UploadProps } from 'antd';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';
import { useCustomerStore } from '@/features/customer/store/customer.store';
import { useOrderStore } from '../order.store';
import { GenericModal } from '@/components/GenericModal';
import { GenericForm } from '@/components/GenericForm';
import { CreateCostItem, CreateOrder, CreateOrderItem } from '../order.types';
import { logger } from '@/utils/logger';
import { parsePdfText } from '@/utils/pdf';
import { UploadOutlined } from '@ant-design/icons';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { OrderItemEditor } from '@/features/order/components/OrderItemEditor';
import { CostItemEditor } from '@/features/order/components/CostItemEditor';

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
  const {
    items: customers,
    loading: customerLoading,
    initialized: customerInitialized,
    fetchItems: fetchCustomers,
  } = useCustomerStore();
  const { createItem } = useOrderStore();

  const formRef = useRef<FormInstance>(null);
  const [uploading, setUploading] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItem[]>([]);
  const [costItems, setCostItems] = useState<CreateCostItem[]>([]);

  useEffect(() => {
    if (!customerInitialized && !customerLoading) {
      fetchCustomers().catch(err => {
        logger.error('Failed to fetch customers:', err);
      });
    }
  }, [customers, customerLoading, customerInitialized, fetchCustomers]);

  const handleSubmit = async (baseData: CreateOrder) => {
    try {
      const payload: CreateOrder = {
        ...baseData,
        orderDate: dayjs(baseData.orderDate).toISOString(),
        deliveryTime: dayjs(baseData.deliveryTime).toISOString(),
        orderItems: baseData.orderItems || [], // 确保存在
        costItems: baseData.costItems || [],
      };

      await createItem({
        ...payload,
        orderItems,
        costItems,
      });
      notification.success({ message: 'Order created successfully!' });
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

  const handleUpload: UploadProps['customRequest'] = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;

    try {
      // 检查文件类型
      if (!(file instanceof File)) {
        throw new Error('Invalid file type.');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are supported.');
      }

      setUploading(true);
      const text = await parsePdfText(file);

      // const customers = await getCustomersForParsing(); // 可从 store 或 props 注入
      const parsed = parsePdfTextToOrder(text);

      // 填充表单（你需要暴露 formRef 或 setFormData）
      if (formRef.current && parsed.formData) {
        formRef.current.setFieldsValue(parsed.formData);
        setOrderItems(parsed.orderItems);
      }

      logger.info('PDF parsed successfully', parsed);
      onSuccess?.({}, new XMLHttpRequest());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse PDF file';
      logger.error(message, err);
      onError?.(new Error(message));
    } finally {
      setUploading(false);
    }
  };

  const parsePdfTextToOrder = (
    text: string,
  ): {
    formData: Partial<CreateOrder>;
    orderItems: CreateOrderItem[];
  } => {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    const findLine = (keyword: string) =>
      lines.find(l => l.toLowerCase().includes(keyword.toLowerCase())) ?? '';

    const orderNoLine = findLine('order');
    const orderNoMatch = orderNoLine.match(/(\d{4}-\d{6})/);

    const deliveryLine = findLine('Please deliver by');
    const orderDateLine = findLine('Date of order');
    const articleLine = findLine('Artikel:');
    const article = articleLine?.split(':')[1]?.trim();

    // 提取 orderItems 区块
    const parsedOrderItems: CreateOrderItem[] = [];
    const posIndex = lines.findIndex(line => line.includes('Pos') && line.includes('Item no'));

    if (posIndex >= 0) {
      for (let i = posIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        // 假设格式："1 80502 Velvet Bag 10x15cm 1000 pcs 0.50 500.00"
        const parts = line.split(/\s{2,}/).filter(Boolean);
        if (parts.length < 6) continue;

        const [itemNo, ...rest] = parts;
        const qtyIndex = rest.findIndex(v => /^\d+$/.test(v));
        if (qtyIndex < 0 || !rest[qtyIndex + 1]) continue;

        const articleText = rest.slice(0, qtyIndex).join(' ');
        const quantity = parseInt(rest[qtyIndex], 10);
        const unit = rest[qtyIndex + 1];
        const unitPrice = parseFloat(rest[qtyIndex + 2] || '0');

        parsedOrderItems.push({
          itemNo: itemNo,
          article: articleText,
          quantity,
          unit,
          unitPrice,
          vatRate: 0,
        });
      }
    }
    return {
      formData: {
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
      },
      orderItems: parsedOrderItems,
    };
  };

  const baseFields = [
    { name: 'orderNo', label: 'Order No.', type: 'text' as const, required: true },
    { name: 'orderArticle', label: 'Order Article', type: 'text' as const, required: true },
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select' as const,
      options: Array.isArray(customers) ? customers.map(c => ({ value: c.id, label: c.name })) : [],
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
          <Upload accept=".pdf" showUploadList={false} customRequest={handleUpload}>
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
        >
          {/* 编辑明细 */}
          <OrderItemEditor items={orderItems} onChange={setOrderItems} />
          <CostItemEditor items={costItems} onChange={setCostItems} />
        </GenericForm>
      </div>
    </GenericModal>
  );
}
