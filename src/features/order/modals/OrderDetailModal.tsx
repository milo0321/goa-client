// components/OrderDetailView.tsx
import { useEffect, useState, useRef } from 'react';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GenericModal } from '../../../components/GenericModal';
import { useOrderStore } from '../order.store';
import { useCustomerStore } from '../../customer/store/customer.store';
import {
  formatQuotePrices,
  formatProductionTime,
  formatPackingDetails,
  formatAdditionalFee,
} from '../../../utils/format';

interface OrderDetailViewProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetailModal({
  orderId,
  onClose,
}: OrderDetailViewProps) {
  const {
    currentItem: currentOrder,
    items: orders,
    setCurrentItem: setCurrentOrder,
  } = useOrderStore();
  const {
    items: customers,
    fetchItems: fetchCustomers,
    loading: customerLoading,
  } = useCustomerStore(); // 加载客户数据
  const [customerName, setCustomerName] = useState<string>('');
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers(); // 加载客户列表
    }

    const order = orders.find((q) => q.id === orderId);
    if (order) {
      if (order.customerId && customers.length > 0) {
        const customer = customers.find((c) => c.id === order.customerId);
        if (customer) {
          setCustomerName(customer.name);
        }
      }
      setCurrentOrder(order);
    }
  }, [
    orderId,
    orders,
    customers,
    customerLoading,
    fetchCustomers,
    setCurrentOrder,
  ]);

  const handleExportPDF = () => {
    const pdf = new jsPDF();

    const article = currentOrder ? currentOrder.article : 'Order';
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
      .getHours()
      .toString()
      .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

    const fileName = `${customerName}_${article}_${timestamp}.pdf`.replace(
      /\s+/g,
      '_'
    );

    // 页眉：公司信息和标题
    pdf.setFontSize(20);
    pdf.text('FUZHOU RUXING GIFTS CO., LIMITED', 14, 10);
    pdf.setFontSize(16);
    pdf.text('Order Details', 14, 20);

    // 表格内容
    const tableBody = displayFields
      .filter(
        (field) =>
          field.value !== undefined &&
          field.value !== null &&
          field.value !== ''
      )
      .map((field) => [field.label, field.value || '-']);

    autoTable(pdf, {
      startY: 30,
      head: [['Field', 'Value']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] }, // 蓝色表头
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 120 },
      },
    });

    // 页脚：生成时间
    pdf.setFontSize(9);
    pdf.text(
      `Generated on: ${now.toLocaleString()}`,
      14,
      pdf.internal.pageSize.height - 10
    );

    // 导出
    pdf.save(fileName);
  };

  if (!currentOrder) {
    return <div className="text-gray-500">Loading...</div>;
  }

  const displayFields = [
    {
      label: 'Inquiry Date',
      value: new Date(currentOrder.inquiryDate).toLocaleString(),
    },
    { label: 'Customer', value: customerName },
    { label: 'Article', value: currentOrder.article },
    { label: 'Client', value: currentOrder.client },
    { label: 'Size', value: currentOrder.size },
    { label: 'Material', value: currentOrder.material },
    { label: 'Color', value: currentOrder.color },
    { label: 'Branding', value: currentOrder.branding },
    { label: 'Packing', value: currentOrder.packing },
    { label: 'Quantity', value: currentOrder.quantity },
    { label: 'Certifications', value: currentOrder.certifications },
    { label: 'Details', value: currentOrder.details },
    { label: 'Prices', value: formatQuotePrices(currentOrder.quotePrices) },
    {
      label: 'Sample Time',
      value: formatProductionTime(currentOrder.sampleTime),
    },
    { label: 'Mass Time', value: formatProductionTime(currentOrder.massTime) },
    {
      label: 'Fee',
      value: formatAdditionalFee(currentOrder.additionalFees || []),
    },
    {
      label: 'Packing',
      value: formatPackingDetails(currentOrder.packingDetails || []),
    },
  ];

  return (
    <GenericModal
      isOpen // 使用传入的 isOpen 而不是直接传递 true
      title="Order Details"
      onClose={onClose}
      ref={detailRef}
    >
      {/* Detail content section */}
      <div className="text-sm text-gray-800 space-y-3">
        {displayFields
          .filter(
            (field) =>
              field.value !== undefined &&
              field.value !== null &&
              field.value !== ''
          )
          .map((field) => (
            <div key={field.label} className="flex">
              <div className="w-40 font-semibold">{field.label}:</div>
              <div className="flex-1 whitespace-pre-line">{field.value}</div>
            </div>
          ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleExportPDF}
          className="flex items-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Export PDF
        </Button>
      </div>
    </GenericModal>
  );
}
