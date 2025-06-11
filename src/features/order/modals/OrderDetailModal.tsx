// components/OrderDetailView.tsx
import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GenericModal } from '@/components/GenericModal';
import { useOrderStore } from '../order.store';
import { useCustomerStore } from '../../customer/store/customer.store';
import { formatPackingDetails } from '@/utils/format';
import type { PackingDetail } from '../order.types';
import { logger } from '@/utils/logger';

interface OrderDetailViewProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderDetailModal({ orderId, onClose }: OrderDetailViewProps) {
  const {
    currentItem: currentOrder,
    items: orders,
    setCurrentItem: setCurrentOrder,
  } = useOrderStore();

  const {
    items: customers,
    fetchItems: fetchCustomers,
    loading: customerLoading,
  } = useCustomerStore();

  const [customerName, setCustomerName] = useState<string>('');
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!customers.length && !customerLoading) {
      fetchCustomers().catch((err) => {
        logger.error('Failed to fetch customers:', err);
      });
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
  }, [orderId, orders, customers, customerLoading, fetchCustomers, setCurrentOrder]);

  const handleExportPDF = () => {
    if (!currentOrder) return;

    const pdf = new jsPDF();
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
      .getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

    const fileName = `${customerName}_${currentOrder.orderArticle || 'Order'}_${timestamp}.pdf`.replace(/\s+/g, '_');

    const tableBody = displayFields
      .filter((field) => field.value !== undefined && field.value !== null && field.value !== '')
      .map((field) => [field.label, field.value || '-']);

    pdf.setFontSize(20);
    pdf.text('FUZHOU RUXING GIFTS CO., LIMITED', 14, 10);
    pdf.setFontSize(16);
    pdf.text('Order Details', 14, 20);

    autoTable(pdf, {
      startY: 30,
      head: [['Field', 'Value']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [33, 150, 243] },
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 120 },
      },
    });

    pdf.setFontSize(9);
    pdf.text(`Generated on: ${now.toLocaleString()}`, 14, pdf.internal.pageSize.height - 10);
    pdf.save(fileName);
  };

  if (!currentOrder) {
    return <div className="text-gray-500">Loading...</div>;
  }

  const displayFields: { label: string; value: unknown }[] = [
    {
      label: 'Order Date',
      value: currentOrder.orderDate ? new Date(currentOrder.orderDate).toLocaleDateString() : '-',
    },
    {
      label: 'Delivery Time',
      value: currentOrder.deliveryTime ? new Date(currentOrder.deliveryTime).toLocaleDateString() : '-',
    },
    { label: 'Customer', value: customerName },
    { label: 'Order No', value: currentOrder.orderNo },
    { label: 'Customer Order No', value: currentOrder.customerOrderNo },
    { label: 'Order Article', value: currentOrder.orderArticle },
    { label: 'Currency', value: currentOrder.currency },
    { label: 'Payment Terms', value: currentOrder.paymentTerms },
    { label: 'Shipping Method', value: currentOrder.shippingMethod },
    { label: 'Status', value: currentOrder.status },
    { label: 'Remarks', value: currentOrder.remarks },
    {
      label: 'Packing Details',
      value: formatPackingDetails(currentOrder.packingDetails || [] as PackingDetail[]),
    },
  ];

  return (
    <GenericModal
      isOpen
      title="Order Details"
      onClose={onClose}
      ref={detailRef}
    >
      <div className="text-sm text-gray-800 space-y-3">
        {displayFields
          .filter(
            (field) =>
              field.value !== undefined &&
              field.value !== null &&
              field.value !== '',
          )
          .map((field) => (
            <div key={field.label} className="flex">
              <div className="w-40 font-semibold">{field.label}:</div>
              <div className="flex-1 whitespace-pre-line">
                {typeof field.value === 'string' || typeof field.value === 'number'
                  ? field.value
                  : JSON.stringify(field.value)}
              </div>
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
