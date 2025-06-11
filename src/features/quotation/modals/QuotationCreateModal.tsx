import { useEffect, useRef, useState } from 'react';
import { useCustomerStore } from '../../customer/store/customer.store';
import { useQuotationStore } from '../store/quotation.store';
import { GenericModal } from '../../../components/GenericModal';
import { GenericForm } from '../../../components/GenericForm';
import { notification, Button, Input } from 'antd';
import dayjs from 'dayjs';

interface QuotationCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function QuotationCreateModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: QuotationCreateModalProps) {
  const {
    items: customers,
    loading: customerLoading,
    initialized: customerInitialized,
    fetchItems: fetchCustomers,
  } = useCustomerStore();
  const { createItem } = useQuotationStore();
  const formRef = useRef(null);
  const [rawText, setRawText] = useState('');
  const initialFormData = {
    inquiryDate: dayjs(), // 设置当前时间
  };

  // 提交处理
  const handleSubmit = async (baseData: {
    customerId: string;
    article: string;
    client: string;
    size: string;
    material: string;
    color: string;
    branding: string;
    packing: string;
    quantity: string;
    certifications: string;
    details: string;
    inquiryDate: string;
    status: 'draft' | 'quoted' | 'ordered' | 'canceled';
  }) => {
    try {
      await createItem({
        ...baseData,
      });
      onSubmitSuccess?.(); // 如果成功，调用成功回调
      onClose(); // 然后关闭模态框
    } catch (error) {
      console.error('Create quotation failed:', error);
      notification.error({
        message: 'Submission Failed',
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // 确保加载客户列表
  useEffect(() => {
    console.log('Checking customer load conditions:', {
      length: customers.length,
      loading: customerLoading,
      initialized: customerInitialized,
    });

    if (!customers.length && !customerLoading && !customerInitialized) {
      fetchCustomers(); // 初始化加载客户
    }
  }, [customers.length, customerLoading, customerInitialized, fetchCustomers]);

  // 点击解析
  const handleParseText = () => {
    if (!rawText.trim()) {
      notification.warning({ message: 'No input to parse.' });
      return;
    }

    const parsed = parseClipboardText(rawText);
    formRef.current?.setFieldsValue(parsed);
    notification.success({
      message: 'Parsed Successfully',
      description: 'Fields have been populated from the input.',
    });
  };

  // 正则解析文本
  const parseClipboardText = (text: string) => {
    const result: Record<string, string> = {};

    const patterns: Record<string, RegExp[]> = {
      article: [/Article:\s*(.+)/i],
      color: [/Color:\s*(.+)/i, /Colour:\s*(.+)/i],
      branding: [/Print:\s*(.+)/i, /Branding:\s*(.+)/i],
      size: [/Size:\s*(.+)/i],
      material: [/Material:\s*(.+)/i],
      packing: [/Packing:\s*(.+)/i],
      quantity: [/Quantity:\s*(.+)/i],
    };

    for (const [key, regexList] of Object.entries(patterns)) {
      for (const regex of regexList) {
        const match = text.match(regex);
        if (match) {
          result[key] = match[1].trim();
          break; // 成功匹配一个就跳过剩下的
        }
      }
    }

    return result;
  };

  // 基础表单字段
  const baseFields = [
    {
      name: 'customerId',
      label: 'Customer',
      type: 'select' as const,
      options: customers.map((c) => ({ value: c.id, label: c.name })),
      required: true,
    },
    {
      name: 'inquiryDate',
      label: 'Inquiry Date',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'article',
      label: 'Article',
      type: 'text' as const,
      required: true,
    },
    { name: 'client', label: 'Client', type: 'text' as const, required: false },
    { name: 'size', label: 'Size', type: 'text' as const, required: false },
    {
      name: 'material',
      label: 'Material',
      type: 'text' as const,
      required: false,
    },
    { name: 'color', label: 'Color', type: 'text' as const, required: false },
    {
      name: 'branding',
      label: 'Branding',
      type: 'text' as const,
      required: false,
    },
    {
      name: 'packing',
      label: 'Packing',
      type: 'text' as const,
      required: false,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'text' as const,
      required: false,
    },
    {
      name: 'certifications',
      label: 'Certifications',
      type: 'text' as const,
      required: false,
    },
    { name: 'details', label: 'Details', type: 'textarea' as const },
  ];

  return (
    <GenericModal isOpen={isOpen} title="Add Quotation" onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto space-y-6">
        {/* 输入原始文本并解析 */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Paste Raw Text Here:</label>
          <Input.TextArea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`Paste quotation content, e.g.:\nArticle: ABC123\nColor: Red\nSize: 30x40cm`}
          />
          <div className="flex justify-end">
            <Button type="primary" onClick={handleParseText}>
              Parse to Fields
            </Button>
          </div>
        </div>

        {/* 表单区域 */}
        <GenericForm
          formRef={formRef}
          initialData={initialFormData}
          fields={baseFields}
          onSubmit={handleSubmit}
          submitText="Create Quotation"
        />
      </div>
    </GenericModal>
  );
}
